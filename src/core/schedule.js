var CrawlSprite = require('../core/crawl-sprite');
class Schedule {
    constructor(){
        this.$counted = 0;
        this.$visited = {};
    }

    deepSearch(links){
       let new_links = links.filter(x => !this.$visited[x]);
       let new_crawl = new CrawlSprite(new_links, null);
    }
}

module.exports = Schedule;
