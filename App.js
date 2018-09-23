/** IMPORTS **/

const routes = require("./assets/data/routes.json");
const config = require("./assets/data/config.json");
const Color = require("./utils/Color");
const flash = require("connect-flash");
const sitemap = require("express-sitemap");
var Mongo = require("./utils/Mongo");
var Mailer = require("./utils/Mailer");
var PostOrm = require("./orms/PostOrm");
var UserOrm = require("./orms/UserOrm");
var FeedOrm = require("./orms/FeedOrm");
var Auth = require("./utils/Auth");
var Api = require("./utils/Api");
var RouteRender = require("./utils/RouteRender");


module.exports = class App {


    /** SMALL CONSTRUCTORS **/

    constructor(server, path){
        this.server = server;
        this.path = path;
        App.server = server;
        Mongo = new Mongo("blog", App);
        Mailer = new Mailer(App);
        PostOrm = new PostOrm(App);
        UserOrm = new UserOrm(App);
        FeedOrm = new FeedOrm(App);
        Api = new Api(App);
        RouteRender = new RouteRender(server, App);

        Mongo.start();
    }


    /** REST **/

    /**
     * This is an instance of RouteRender
     */
    static RouteRender(){
        return RouteRender
    }


    /**
     * This is an instance of PostOrm
     */
    static PostOrm(){
        return PostOrm
    }


    /**
     * This is an instance of UserOrm
     */
    static UserOrm(){
        return UserOrm
    }


    static FeedOrm(){
        return FeedOrm
    }


    /**
     * This is an instance of Mongo
     */
    static Mongo(){
        return Mongo
    }


    /**
     * This is an instance of Mail server
     */
    static Mailer(){
        return Mailer
    }

    
    /**
     * This is an instance of Api
     */
    static Api(){
        return Api
    }


    /**
     * This function replace all
     * @param {String} data 
     * @param {String} charToReplace charToReplace
     * @param {String} newChar newChar 
     * @return {String} data 
     */
    static replaceAll(data, charToReplace, newChar = ""){
        if (App.isNull(data)) return data;
        
        typeof data != "string" ? data = data.toString() : data = data;

        while (data.includes(charToReplace))
            data = data.replace(charToReplace, newChar);

        return data;
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
        else if (prefix.includes("TEST")) console.log(Color.FgCyan + prefix + Color.FgMagenta + prompt + Color.Reset + data);
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
     * This function configure proxy server
     * @param {*} rateLimit 
     */
    configureProxy(rateLimit){
        this.server.enable("trust proxy");

        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: "Too many accounts created from this IP, please try again after an hour"
        });

        this.server.use('/api/', apiLimiter);
    }


    /**
     * This function configure the middlewares
     * @param {*} cookieParser cookieParser
     * @param {*} bodyParser bodyParser
     * @param {*} session session
     * @param {*} passport passport
     */
    configureServer(cookieParser, bodyParser, session, passport){
        this.server.use(cookieParser());
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(flash());
        this.server.use(session(config.session));
        this.server.use(passport.initialize());
        this.server.use(passport.session());

        passport.serializeUser((user, done) => done(null, user._id));
        passport.deserializeUser((id, done) => App.UserOrm().getSchema().findById(id, (err, user) => done(err, user)));
        
        Auth = new Auth(App, passport);
    }


    /**
     * This function prepare node server
     */
    prepareServer(){
        this.server.set('views', this.path.join(__dirname, 'views'));
        this.server.set('view engine', 'pug');
        this.server.listen(config.port, () => {
            App.debug("The server has been started! 🎨");
            App.debug("The server listen port: " + config.port);
        });
    }


    /**
     * This function register a server routes
     */
    prepareRoutes(){
        RouteRender.renderPages(routes);
        RouteRender.renderPosts();
        RouteRender.renderAuth(Auth.Passport());
        RouteRender.renderPanel();
        RouteRender.renderApi();
        RouteRender.renderSitemap();
        RouteRender.renderErrors();
    }


    /**
     * This function prepare the siteMap
     */
    prepareSitemap(){
        const url = config.url.includes("https://") ? 
            config.url.replace("https://", "") :
            config.url.replace("http://", "");

        const siteMap = sitemap({
            url: url
        });

        siteMap.generate(App.server);

        return siteMap;
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