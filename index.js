var Crawler = require("crawler");
var needle = require('needle');
var path = require('path');
var fs = require('fs');
var dayjs = require('dayjs');
var regExp = /(http(s)?:)?\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?\.((png)|(jp(e)?g)|(gif))/g
var getFileName = (str) => {
    if (typeof str !== "string") return null;
    var lastIndex = str.lastIndexOf('/');
    return str.substr(lastIndex+1);
};

/**
 * 读取路径信息
 * @param {string} path 路径
 */
var getStat = function (path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}
 
/**
 * 创建路径
 * @param {string} dir 路径
 */
var mkdir = function(dir){
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}
 
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
var dirExists = async function(dir){
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if(status){
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}


var getPath = (str, filename) => {
   return str+"/"+filename;
}

const SAVE_PATH = `./img-${dayjs().format('YYYYMMDD')}`;

var crawlMain = new Crawler({
    rateLimit: 1000,
    encoding: null,
    maxConnections : 10,
    // This will be called for each crawled page
    callback: async function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
           await dirExists(SAVE_PATH);
           let htmlStr = res.body;
           if(typeof htmlStr === "string") {
               let results = htmlStr.match(regExp) || [];
               results.forEach(src => {
                   needle('get', src).then(resp => {
                       resp.setEncoding('binary');
                       fs.writeFile(getPath(SAVE_PATH, getFileName(src)), resp.raw, "binary", function(err) {
                           if(err) {
                               console.log("down fail, error msg:" + err.message);
                           }
                       });
                   });
               });
           };
        }
        done();
    }
});

// Queue just one URL, with default callback
crawlMain.queue({
    uri: 'https://www.baidu.com'
});