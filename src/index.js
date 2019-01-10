var Crawler = require("crawler");
var needle = require('needle');
var path = require('path');
var fs = require('fs');

var regExp = /(http(s)?:)?\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?\.((png)|(jp(e)?g)|(gif))/g
var getFileName = (str) => {
    if (typeof str !== "string") return null;
    var lastIndex = str.lastIndexOf('/');
    return str.substr(lastIndex+1);
};

var getPath = (str, filename) => {
   return str+"/"+filename;
}


var crawlMain = new Crawler({
    rateLimit: 1000,
    encoding: null,
    maxConnections : 10,
    // This will be called for each crawled page
    callback: async function (error, res, done) {
        console.log(res);
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
                       console.log(resp);
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