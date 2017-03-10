angular.module('postService', [])

.factory('PostService', function($http, Upload, $location) {
    var postFactory = {};

    postFactory.create = function(postData) {
        return $http.post('/api/post/create', postData);
    };
    
    postFactory.upload = function(file, ctrl ) {
        //var thumb = Upload.json(ctrl.postData.croppedDataUrl, 'thumb');
               
        console.log("upload it");
        //TODO: CHECK RETURN 
        return Upload.upload({
            url: 'api/posts/new',
            data: {
                file: file,
                postData: ctrl.postData
            }
        }).then(function (res) {
            console.log('Success. Response: ');
            console.log(res);
            ctrl.postData = ''; //clear input
            ctrl.message = res.data.message;
            $location.path('/myPosts');
        }, function (res) {
            console.log('Error status: ' + res.status);
            ctrl.message = res.status;
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            var progress = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name;
            ctrl.message = progress;
        });
    };

    return postFactory;
});
