var imageFetcher = require('../components/image-fetcher');
var CrawlSprite = require('../core/crawl-sprite');
const { appSetting, entry } = require('../config/index');
class Schedule {
    constructor(){
        this.config = appSetting;
        this.$counted = 0;
        this.$visited = {};
        this.$fetcher = null;
    }
    async start(){
        var fetcher = new imageFetcher({
            ext: ['jpg', 'jpeg', 'png'],
            minSize: 50,
            maxSize: 1024
        });
        this.$fetcher = fetcher.fetch.bind(fetcher);
        var chief = new CrawlSprite(entry, this.$fetcher);
        this.$visited[entry] = chief;
        this.$counted++;
        let primaryLinks = await chief.parse();
        this.deepSearch(primaryLinks);
    }

    async deepSearch(links){
        if(this.$counted >= this.config.maxPages) {
            process.exit(0);
            return;
        }
        let new_links = links.filter(x => !this.$visited[x]);
        for(var i=0;i<new_links.length;i++){
            let link_ele = new_links[i];
            let new_crawl = new CrawlSprite(link_ele, this.$fetcher);
            let sub_links = await new_crawl.parse();
            this.$visited[link_ele] = new_crawl;
            this.$counted++;
            this.deepSearch(sub_links);
        };
    }
}

module.exports = Schedule;
