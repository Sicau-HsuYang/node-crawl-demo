var CrawlSprite = require('./src/crawl-sprite');
var fileManager = require('./src/helpers/file-manager');
var config = require('./src/config/index');
var imageFetcher = require('./src/components/image-fetcher');
var fetcher = new imageFetcher();
var dowork = fetcher.fetch.bind(fetcher);
fileManager.dirExists(config.SAVE_PATH).then(() => {
    var start = new CrawlSprite('http://www.baidu.com', dowork);
    return start.parse();
}).then(links => {
    // console.log(links);
});
