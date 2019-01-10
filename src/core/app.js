var CrawlSprite = require('../core/crawl-sprite');
var fileManager = require('../helpers/file-manager');
var config = require('../config/index');
var imageFetcher = require('../components/image-fetcher');
class App {
    constructor(url, keyword){
        this.url = url;
        this.keyword = keyword;
    }

    async run() {
        var fetcher = new imageFetcher();
        var dowork = fetcher.fetch.bind(fetcher);
        await fileManager.dirExists(config.SAVE_PATH);
        var start = new CrawlSprite(this.url, dowork);
        let links = await start.parse();
        console.log(links);
    }
}

module.exports = App;