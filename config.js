'use strict';

const defaultConfig = './config_default.js';
const overrideConfig = './config_override.js';
const testConfig = './config_test.js';

const fs =require('fs') ;

var config =null ;

//test的环境下，加载config-test
if(process.env.NODE_ENV==='test'){
    console.log(`load ${testConfig} ....`);
    config = require(testConfig) ;
}else{
    console.log(`load ${overrideConfig}...`);
    config = require(defaultConfig) ;
    try {
        if(fs.statSync(overrideConfig).isFile()){
            console.log(`load ${overrideConfig}`);
            config =Object.assign(config,require(overrideConfig));           
      }
    } catch (error) {
       console.log(`cannot load config ${overrideConfig}`) 
    }
}

module.exports = config ;

