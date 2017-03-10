// app/api.js
var User = require('../app/models/user');
var Post = require('../app/models/post');
var config = require('../config/config');
var secret = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var path = require('path');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name
    }, secret, {
        expiresIn: '1h'
    });

    return token;
}

module.exports = function(app, express, passport, upload, cloudinary) {
    var api = express.Router();
    //SIGNUP NEW USER
    api.post('/signup', function(req, res) {
        var user = new User();
        user.email = req.body.email;
        user.name = req.body.name;
        user.password = user.generateHash(req.body.password);
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created!',
                token: createToken(user)
            });
        });
    });
    //LOGIN USER
    api.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log("user not found");
                res.send({
                    message: "Users doesn't exist"
                });
                return;
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                } else {
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: 'Logged In!',
                        token: token
                    });
                }

            });
        })(req, res, next);
    });
    //LOGIN FB USER
    api.get('/facebook', passport.authenticate('facebook', {
        authType: 'rerequest',
        scope: ['email']
    }));
    // handle the callback after facebook has authenticated the user
    api.get('/facebook/callback', function(req, res, next) {
        passport.authenticate('facebook', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                res.redirect('/facebook-login/' + createToken(user));
            });
        })(req, res, next);
    });
    api.get('/pictures', function(req, res) {
        var id = req.query.id;
        if (id) {
            res.sendFile(path.resolve('./uploads/' + id));
        }

    });
    //MIDDLEWARE
    api.use(function(req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token, secret, function(err, decoded) {
                if (err) {
                    console.log("expired");
                    res.status(403).send({
                        expired: true,
                        success: false,
                        message: "failed to auth user: " //todo: check if token expired?!
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "no token provided"
            });
        }
    });
    //SHOW ALL USERES -- ONLY WITH LOGIN TOKEN
    api.get('/profile', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.send(err);
                return;
            } else {
                res.json(users);
            }
        });
    });
    api.get('/myPosts', function(req, res) {
        var userId = req.decoded.id;
        Post.find({
            user: userId
        }, function(err, posts) {
            if (err) {
                res.send(err);
                return;
            } else {
                res.json(posts);
            }
        });
    });
    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });
    //UPLOAD NEW POST/IMAGE --> OLDSCOOL
    api.post('/posts/new', upload.single('file'), function(req, res, next) {
        console.log("post new!");
        cloudinary.uploader.upload(req.file.path, function(result) {

            if (result) {
                //console.log(result);

                var postData = req.body.postData;

                var image = {
                    link: result.url,
                    safelink: result.secure_url,
                    filename: result.public_id,
                    mime: result.format,
                    size: result.bytes,
                    originalname: result.original_filename,
                    thumbnail: "postData.croppedDataUrl"
                };


                var state = postData.state;
                var country = postData.country;


                var post = new Post();
                post.title = postData.title;
                post.story = postData.story;
                post.date = postData.date;
                post.state = state.selectedOption;
                post.country = country.selectedOption;
                post.user = req.decoded.id;
                post.image = image;

                console.log(post);

                post.save(function(err) {
                    console.log("post save");
                    if (err) {
                        res.send(err);
                        return;
                    }
                    res.json({
                        success: true,
                        message: 'Post has been created!'
                    });
                });
            } else {
                console.log("error");
                //console.log(error);
            }
        }, config.uploadOptions);
    });


    return api;
};
