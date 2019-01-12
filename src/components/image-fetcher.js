var BaseFetcher = require('./base-fetcher');
class ImageFetcher extends BaseFetcher{
    /**
     * 抓取图片的约束
     * @param {*} options 
     * size: 1kb,
     * ext: 'jpg', 'jpeg', 'gif', 'png'
     */
    constructor(options = { ext: ['jpg', 'jpeg', 'gif', 'png'] }){
        super(options);
    }

    readSpecificRegExp(){
        if (this._imgRegExp) return this._imgRegExp;
        let matchImgs = this.options.ext.map(x => `(${x})`).join('|');
        this._imgRegExp = new RegExp('((http(s)?)|(ftp):)?\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:\\/~\\+#]*[\\w\\-\\@?^=%&\\/~\\+#])?\.('+ matchImgs +')','g');
        return this._imgRegExp;
    }


    async fetch(response) {
        let fetch_uris = this.readUrisFromReponse(response);
        let results = await this.doWork(fetch_uris);
        results = results.unique();
        return results
    }


}

module.exports = ImageFetcher;