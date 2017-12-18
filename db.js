'use strict' ;
const Sequelize  =require('sequelize');
const config =require('./config')
const uuid =require('node-uuid') ;

//生成id
function generateId() {
    return uuid.v4();
}

//定义配置的db
var sequelize =new Sequelize(config.database,config.user,config.password,{
    host:config.host ,
    dialect:"mysql",
    pool:{
        max:5 ,
        min:1 ,
        idle:30000
    }
});

//自定义数据类型
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
//id的类型
const ID_TYPE = Sequelize.STRING(50);

/**
 * const db = require('../db');
module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    gender: db.BOOLEAN
});
 * 
 * @param {*} name 
 * @param {*} attributes 
 * 定义medel ;
 */
function defineModel(name,attributes){
    //最终的attrs  
    var attrs ={} ;
    for(let key in attributes){
       let value =attributes[key] ;
       //key:{type:,}形式的情况下
       if( typeof value ==='object'&&value['type']){
           value.allowNull =value.allowNull||false ;
           attrs[key] =value ;
        //key:value的形式下；
        }else{
           attrs[key] ={
               type:value,
               allowNull :false 
           }
       }          
    } 
    
    //公共的部分；
    attrs.id ={
        type:ID_TYPE ,
        allowNull :false ,
        primaryKey:true 
    }  
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version={
        type:Sequelize.BIGINT ,
        allowNull :false 
    };

    //打印一下执行的情况；
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
        if (k === 'type') {
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));

    return  sequelize.define(name,attrs,
        {timestamps:false,
         hooks:{
              beforeValidate:function(object){
              var now =Date.now() ;
              //若是新插入的对象的时候
              if(object.isNewRecord) {
                   if(!object.id){
                       object.id =generateId();
                   }
                   object.createdAt = now ;
                   object.updatedAt =now ; 
                   object.version = 0 ;
              }else{
                    object.updatedAt =now ; 
                    object.version++ ;
              }
             }
         }
        }
        );
}


var exp ={
    defineModel:defineModel ,
    sync:()=>{
        // only allow create ddl in non-production environment:
        //我们可以用sync()方法自动创建出表结构，而不是自己维护SQL脚本
        //Sync all defined models to the DB.
        console.log("==========================================="+process.env.NODE_ENV);
        if(process.env.NODE_ENV!='production'){
            sequelize.sync({force:true});
        }else{
          throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
  };
  

  for( var type of TYPES){
   exp[type] =Sequelize[type] ;
  }
  exp.ID =ID_TYPE ;
  
  exp.generateId =generateId ;

  module.exports =exp ;











