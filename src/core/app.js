require('../extends/index');
var CrawlSprite = require('../core/crawl-sprite');
var Schedule = require('./schedule');
var fileManager = require('../helpers/file-manager');
var config = require('../config/index');
var imageFetcher = require('../components/image-fetcher');
class App {
    constructor(options = {}){
        this.options = options;
    }

    async run(url) {
        var fetcher = new imageFetcher({
            ext: ['jpg', 'jpeg', 'png'],
            minSize: 50,
            maxSize: 1024
        });
        var dowork = fetcher.fetch.bind(fetcher);
        await fileManager.dirExists(config.SAVE_PATH);
        var chiefCrawler = new CrawlSprite(url, dowork);
        let primaryLinks = await chiefCrawler.parse();
        let schedule = new Schedule(this.options.maxPages);
        schedule.setting({
            entry: this.url
        })
        schedule.deepSearch(primaryLinks);
    }
}

module.exports = App;