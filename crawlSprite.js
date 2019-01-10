var Crawler = require("crawler");
class CrawlerSprite {
    constructor(url,callback, options = {}) {
        this.url = url;
        this.options = options;
        this.crawl = null;
    }
    
    fetch() {
        return new Promise((resolve,reject) => {
            this.crawl = new Crawler({
                rateLimit: options.rateLimit || 1000,
                encoding: options.encoding || null,
                maxConnections: options.maxConnections || 10,
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

    parse() {
        let nextFetchPath = [];
        return nextFetchPath
    }
}

module.exports = CrawlerSprite;