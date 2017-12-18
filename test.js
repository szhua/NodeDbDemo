'use strict' ;

const  fs =require('fs') ;

var files =fs.readdirSync(__dirname+'/models/');

console.log(files);

var pathname =__dirname+'/models/'+'Pet.js' ;

var print =require(pathname) ;

console.log(print) ;









