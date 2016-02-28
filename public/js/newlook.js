(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('newLook', []).controller('PictureController', ['$scope', '$window', '$http', '$document', PictureController]);

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function PictureController($scope, $window, $http, $document) {
  var _this = this;

  this.UI = {
    imageCapture: null,
    tempFileUrl: ''
  };

  var pictureElement = document.querySelector('.picture');
  var imageInput = document.querySelector('input[type="file"]');

  this.capturePhoto = function () {
    console.log('capturing photo');
    // navigator.getUserMedia({audio: false, video: true}, processMedia, errorMedia);
    var click = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });

    imageInput.dispatchEvent(click);
  };

  imageInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    var tempFileUrl = window.URL.createObjectURL(file);
    pictureElement.src = tempFileUrl;
    _this.UI.tempFileUrl = tempFileUrl;
    // window.URL.revokeObjectURL(tempFileUrl);
  });
}

},{}]},{},[1]);
