angular.module('newLook', [])
.controller('PictureController', ['$scope','$window', '$http', '$document', PictureController]);


navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

function PictureController($scope, $window, $http, $document) {
  this.UI = {
    imageCapture: null,
    tempFileUrl: ''
  }

  var pictureElement = document.querySelector('.picture');
  var imageInput = document.querySelector('input[type="file"]');

  this.capturePhoto = () => {
    console.log('capturing photo');
    // navigator.getUserMedia({audio: false, video: true}, processMedia, errorMedia);
    var click = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });

    imageInput.dispatchEvent(click);
  }

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const tempFileUrl = window.URL.createObjectURL(file);
    pictureElement.src = tempFileUrl;
    this.UI.tempFileUrl = tempFileUrl;
    // window.URL.revokeObjectURL(tempFileUrl);
  });
}
