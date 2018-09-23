/** IMPORTS **/

const sitemap = require("express-sitemap")();


/** PRIVATE METHODS **/

function generateMap(server){
    sitemap.generate(server);
}


module.exports = class Sitemap {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        generateMap(this.App.server);
    }


    /** REST **/

    /**
     * This function generates a sitemap
     */
    generateFile(){
        sitemap.toFile();
    }


}