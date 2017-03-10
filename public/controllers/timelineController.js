angular.module('timelineCtrl', [])
        .controller('TimelineCtrl', function (Auth, UserService) {
            var ctrl = this;
    
            //checkLogin
            UserService.getUser()
                .then(function (data) {
                    ctrl.getUserPosts();
                });

            ctrl.createPostJSON = function() {
                var events = [];

                ctrl.posts.forEach(function(obj) {
                    var media = {
                            'url' : obj.image.safelink
                    };

                    var date = moment(obj.date);

                    var start_date = {
                            'month' : date.format('M'),
                            'day': date.format('D'),
                            'year' : date.format('YYYY')
                    };

                    var text = {
                        'headline' : obj.title,
                        'text' : obj.story
                    };

                    var post = {
                            'media' : media,
                            'start_date' : start_date,
                            'text' : text
                    };

                    events.push(post);
                });

                var json = {
                    'events' : events
                };

                //https://timeline.knightlab.com/docs/options.html
                var options = {
                    start_at_end: true
                };
                timeline = new TL.Timeline('timeline-embed', json, options);
            };

            ctrl.getUserPosts = function() {
                console.log("get User Posts for timeline!");
                Auth.getUserPosts()
                    .then(function (data) {
                        ctrl.posts = data.data;
                        console.log(ctrl.posts);
                        ctrl.createPostJSON();
                        //console.log(data.data);
                    });
            };
        });


//var json = {
//                "events": [{
//                        "media": {
//                            "url": "//upload.wikimedia.org/wikipedia/commons/0/0f/Flickr_Whitney_Houston_performing_on_GMA_2009_4.jpg",
//                        },
//                        "start_date": {
//                            "month": "2",
//                            "day": "11",
//                            "year": "2012"
//                        },
//                        "text": {
//                            "headline": "Whitney Houston<br/> 1963-2012",
//                            "text": "<p>Houston, 48, was discovered dead at the Beverly Hilton Hotel on  on Feb. 11, 2012. She is survived by her daughter, Bobbi Kristina Brown, and mother, Cissy Houston.</p>"
//                        }
//                    }, {
//                        "media": {
//                            "url": "//upload.wikimedia.org/wikipedia/commons/0/0f/Flickr_Whitney_Houston_performing_on_GMA_2009_4.jpg",
//                        },
//                        "start_date": {
//                            "month": "2",
//                            "day": "11",
//                            "year": "2016"
//                        },
//                        "text": {
//                            "headline": "Whitney Houston<br/> 1963-2012",
//                            "text": "<p>Houston, 48, was discovered dead at the Beverly Hilton Hotel on  on Feb. 11, 2012. She is survived by her daughter, Bobbi Kristina Brown, and mother, Cissy Houston.</p>"
//                        }
//                    }]
//            };
//            timeline = new TL.Timeline('timeline-embed', json);
