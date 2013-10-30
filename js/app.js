/*
 * jQuery File Upload Plugin Angular JS Example 1.2.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true */
/*global window, angular */

(function() {
    'use strict';

    // var isOnGitHub = window.location.hostname === 'blueimp.github.io',
    //     url = isOnGitHub ? '//jquery-file-upload.appspot.com/' : 'server/php/';

    angular.module('demo', [
        'blueimp.fileupload'
    ])
    
    .config([
        '$httpProvider', 'fileUploadProvider',
        function($httpProvider, fileUploadProvider) {

            //for cros
            // delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // fileUploadProvider.defaults.redirect = window.location.href.replace(
            //     /\/[^\/]*$/,
            //     '/cors/result.html?%s'
            // );
            // if (isOnGitHub) {
            //     // Demo settings:
            //     angular.extend(fileUploadProvider.defaults, {
            //         // Enable image resizing, except for Android and Opera,
            //         // which actually support image resizing, but fail to
            //         // send Blob objects via XHR requests:
            //         disableImageResize: /Android(?!.*Chrome)|Opera/
            //             .test(window.navigator.userAgent),
            //         maxFileSize: 5000000,
            //         acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
            //     });
            // }
        }
    ])

    .controller('DemoFileUploadController', [
        '$scope', '$http', '$filter', '$window',
        function($scope, $http) {

            // $scope.options = {
            //     url: url
            // };
            // if (!isOnGitHub) {
            //     $scope.loadingFiles = true;
            //     $http.get(url)
            //         .then(
            //             function (response) {
            //                 $scope.loadingFiles = false;
            //                 $scope.queue = response.data.files || [];
            //             },
            //             function () {
            //                 $scope.loadingFiles = false;
            //             }
            //         );
            // }

            $scope.$on(['fileuploadadd'], function(e, data) {

                console.log('[DemoFileUploadController] fileuploadadd event:');
                console.log(data);
                // data.scope = $scope.option('scope');
                console.log("upload name" + data.files[0].name);
                $scope.options = {
                    url: 'https://140.92.25.66/vfs/services/obj_ops/upload_file',
                    type: 'POST'
                    // crossDomain: true,
                    // sequentialUploads: true,
                };

                $scope.options.headers = {
                    'Authorization': '8a1a08e9-6258-4634-a924-ed5fb2c9893a',
                    'X-COSA-PATH-Encoding': 'ISO-8859-1'
                };

            });
            $scope.$on(['fileuploadsend'], function(e, data) {
                console.log('[DemoFileUploadController] fileuploadsend:');
                console.log($scope);
                console.log(data);
                data.headers['X-COSA-Full-Path'] = '/' + data.files[0].name;
                console.log("cosa path:" + $scope.options.headers['X-COSA-Full-Path']);
            });
        }
    ])

    .controller('FileDestroyController', [
        '$scope', '$http',
        function($scope, $http) {
            console.log("[FileDestroyController]");
            var file = $scope.file,
                state;
            if (file.url) {
                file.$state = function() {
                    return state;
                };
                file.$destroy = function() {
                    state = 'pending';
                    return $http({
                        url: file.deleteUrl,
                        method: file.deleteType
                    }).then(
                        function() {
                            state = 'resolved';
                            $scope.clear(file);
                        },
                        function() {
                            state = 'rejected';
                        }
                    );
                };
            } else if (!file.$cancel && !file._index) {
                file.$cancel = function() {
                    $scope.clear(file);
                };
            }
        }
    ]);

}());