var express = require('express');
var path = require('path');
var multer = require('multer')
var appRoot = require('app-root-path');
// handle storage using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/public/img/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + 'ok' + Date.now() + path.extname(file.originalname));
    }
 });

 var upload = multer({ storage: storage });
 module.exports = {
    upload
 }