'use strict' ;

const fs =require('fs');
const db =require('./db') ;


var files = fs.readdirSync(__dirname+"/models");


let js_files = files.filter(function(f){
    return f.endsWith('.js');
},files);

//TODO
module.exports ={} ;


for(var f of js_files){

    console.log(`import model from file ${f}`) ;
    //....(.js)-去除
    var name =f.substring(0,f.length-3) ;
    //将model暴露出来 ---model.Pet  model.Cat ；；；
    module.exports[name] =require(__dirname+"/models/"+f) ;
}

//将db的初始化数据库设置给model 
module.exports.sync = ()=>{db.sync();} ;











