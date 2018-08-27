/** IMPORTS **/

const routes = require("./assets/data/routes.json");
const Color = require("./utils/Color");
var PostOrm = require("./orms/PostOrm");
var RouteRender = require("./utils/RouteRender");


module.exports = class App {


    /** SMALL CONSTRUCTORS **/

    constructor(server, path){
        this.server = server;
        this.path = path;
        
        PostOrm = new PostOrm(App);
        RouteRender = new RouteRender(server, App);
    }


    /** REST **/

    /**
     * This is an instance of PostOrm
     */
    static PostOrm(){
        return PostOrm
    }


    /**
     * This function debug data passed by parameter
     * @param {*} data message
     */
    static debug(data, type = "NORMAL"){
        data instanceof Object ? data = JSON.stringify(data) : data = data;
        const prefix = "[" + type + "]";
        const prompt = " ⇒ ";

        if (prefix.includes("ERROR")) console.log(Color.FgRed + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("ALERT")) console.log(Color.FgYellow + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else console.log(Color.FgBlue + prefix + Color.FgMagenta + prompt + Color.Reset + data);
    }


    /**
     * This function throw custom alerts
     * @param {*} data alert 
     */
    static throwAlert(data){
        data instanceof Object ? data = JSON.stringify(data) : data = data;
        App.debug(data, "ALERT");
    }


    /**
     * This function throw custom errors
     * @param {*} err error
     */
    static throwErr(err){
        if(!App.isNull(err)) App.debug(err.message, "ERROR");
    }


    /**
     * This function prepare node server
     * @param {*} port 
     */
    prepareServer(port){
        this.server.set('views', this.path.join(__dirname, 'views'));
        this.server.set('view engine', 'pug');

        this.server.listen(port, () => {
            App.debug("The server has been started! 🎨");
            App.debug("The server listen port: " + port);
        });
    }


    /**
     * This function register a server routes
     */
    prepareRoutes(){
        RouteRender.renderPages(routes);
        RouteRender.renderPosts(PostOrm);
    }


    /**
     * This function check if data is null
     * @param {*} data 
     * @return {boolean} isNull
     */
    static isNull(data){
        return data == null || data == undefined;
    }


    /**
     * This function check if data is null
     * @param {*} data 
     * @return {boolean} isNull
     */
    isNull(data){
        return data == null || data == undefined || data == "";
    }


}