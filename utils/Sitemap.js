module.exports = class Sitemap {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.sitemap = this.App.prepareSitemap();
    }


    /** REST **/

    /**
     * This function generates a sitemap
     */
    generateFile(){
        this.sitemap.toFile();
    }


}