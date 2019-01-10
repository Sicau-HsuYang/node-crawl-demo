var Crawler = require("crawler");
class CrawlerSprite {
    constructor(url,callback, options = {}) {
        this.linkRegExp = /((http(s)?):)?\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/g
        this.uriRegExp = /<a[^>]*?href="[\w\W]*?">/g;
        this.url = url;
        this.prefix = this.url.startsWith('https') ? 'https:' : 'http:';
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
                let aTags = htmlStr.match(this.uriRegExp)|| [];
                nextFetchPath.push(...aTags.map(element_a => {
                    let execResult = this.linkRegExp.exec(element_a);
                    let this_url = Array.isArray(execResult) ? execResult[0] : null;
                    if (this_url) {
                        !this_url.startsWith('https') && !this_url.startsWith('http') ? this_url = this.prefix + this_url : null;
                    }
                    return this_url;
                }).filter(x => x !== null));
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