var CrawlSprite = require('../core/crawl-sprite');
class Schedule {
    constructor(config = {}){
        this.config = config;
        this.$counted = 0;
        this.$visited = {};
    }

    setting(params = {}){
        this.params = params;
        if(this.params.entry) {
            this.$visited[this.params.entry] = {};
        }
    }

    async deepSearch(links){
        if(this.$counted >= this.config.maxPages) {
            process.exit(0);
            return;
        }
        let new_links = links.filter(x => !this.$visited[x]);
        for(var i=0;i<new_links.length;i++){
            let link_ele = new_links[i];
            let new_crawl = new CrawlSprite(link_ele, null);
            let sub_links = await new_crawl.parse();
            this.deepSearch(sub_links);
            this.$visited[link_ele] = new_crawl;
            this.$counted++;
        };
    }
}

module.exports = Schedule;
