var libHost = require('../helpers/lib-provider');
const { appSetting, entry } = libHost.config;
class Schedule {
    
    get $fetcher(){
        return new (libHost.getFetcher('image'))({
            url: entry,
            ext: ['jpg', 'jpeg', 'png'],
            minSize: 50,
            maxSize: 1024
        });
    }

    constructor(){
        this.config = appSetting;
        this.$counted = 0;
        this.$visited = {};
    }



    async start(){
        var chief = new libHost.crawler(entry, this.$fetcher);
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
            let new_crawl = new libHost.crawler(link_ele, this.$fetcher);
            let sub_links = await new_crawl.parse();
            this.$visited[link_ele] = new_crawl;
            this.$counted++;
            this.deepSearch(sub_links);
        };
    }
}

module.exports = Schedule;
