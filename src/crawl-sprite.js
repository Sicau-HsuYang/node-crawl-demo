var Crawler = require("crawler");
class CrawlerSprite {
    constructor(url,callback, options = {}) {
        this.uriRegExp = /((http(s)?):)?\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/g
        this.url = url;
        this.callback = callback;
        this.options = options;
        this.crawl = null;
    }
    
    fetch() {
        return new Promise((resolve,reject) => {
            this.crawl = new Crawler({
                rateLimit: this.options.rateLimit || 1000,
                // encoding: this.options.encoding || null,
                maxConnections: this.options.maxConnections || 10,
                callback: function (error, res, done) {
                    if(error){
                        console.log(error.message);
                        reject(error);
                    }else{
                        resolve(res);
                    }
                    done();
                }
            });
            this.crawl.queue({
                url: this.url
            });
        });
    }

    async parse() {
        let nextFetchPath = [];
        try {
            let resp = await this.fetch();
            if (resp.statusCode.toString().startsWith('2') || resp.statusCode.toString().startsWith('3')) {
                if(typeof this.callback === "function") {
                    this.callback(resp.body);
                }
                let htmlStr = typeof resp.body === "string" ? resp.body : '';
                nextFetchPath.push(...htmlStr.match(this.uriRegExp));
            } else {
                console.log(resp.statusMessage);
            }
        } catch(ex) {
            console.log(ex.message);
        }   
        return nextFetchPath;
    }
}

module.exports = CrawlerSprite;