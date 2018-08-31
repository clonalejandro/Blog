/** IMPORTS **/

const config = require("../assets/data/config.json");


module.exports = class RouteRender {


    /** SMALL CONSTRUCTORS **/

    constructor(server, App){
        this.server = server;
        this.App = App;
    }


    /** REST **/

    /**
     * This function render pages with routes file
     * @param {Object} routes 
     */
    renderPages(routes){
        Object.keys(routes).forEach(url => {
            const view = routes[url];

            this.server.get(url, (req, res) => {
                try {
                    res.render(view)
                } 
                catch (err){
                    this.App.throwAlert(err);
                    res.status(500).send(err);
                }
            });

            this.App.debug("The server is registering route: \"" + url + "\" aiming to: " + view);
        })
    }


    /**
     * This function render posts with db
     * @param {Boolean} debug debug
     */
    renderPosts(debug = true){
        this.App.PostOrm().findByQuery({}, null, (err, res) => {
            if (err){
                this.App.throwErr(err);
                return;
            }

            if (this.App.isNull(res)){
                this.App.throwAlert("Any post in db!");
                return;
            }

            res.forEach(row => {
                const data = {
                    postId: row["postId"],
                    url: row["url"],
                    title: row["title"],
                    content: row["content"],
                    thumb: row["thumb"],
                    description: row["description"],
                    date: row["date"],
                    author: row["author"],
                    tags: row["tags"]
                };

                this.server.get(data.url, (req, res) => {
                    try {
                        res.render('post', {
                            title: data.title,
                            content: data.content,
                            thumb: data.thumb,
                            description: data.description,
                            date: data.date,
                            author: data.author,
                            tagsString: data.tags.join(" "),
                            tags: data.tags
                        })
                    } 
                    catch (err){
                        this.App.throwAlert(err);
                        res.status(500).send(err);
                    }
                });
                if (debug) this.App.debug("The server is registering route: \"" + data.url + "\" aiming to: post");
            })
        })
    }


    /**
     * This function render all api routes
     */
    renderApi(){
        //this.App.PostOrm().delete({postId: 4});
        /*this.App.PostOrm().insert(
            '/clonewars-nueva-temporada',
            'Clone wars nueva temporada',
            'Hablemos del retraso de disney para sacar su última temporada de clone wars',
            "http://getwallpapers.com/wallpaper/full/8/8/f/248404.jpg",
            "alejandro rios calera",
            ["Star wars", "Clone wars", "Temporada"]
        );*/

        this.renderApiEntries();
        this.renderApiDeleteEntries();
    }


    /**
     * This function render the Auth system
     * @param {*} passport 
     */
    renderAuth(passport){
        if (config.registerAllowed) this.renderRegister(passport);
        this.renderLogin(passport);
        this.renderLogout();
    }


    /** OTHERS **/

    /**
     * This function render routes with api entries
     */
    renderApiEntries(){
        this.server.get('/api/last-entries', async (req, res) => {
            req.query.key = this.App.replaceAll(req.query.key, "\"", "");
            typeof req.query.amount == "string" ?
                req.query.amount = parseInt(req.query.amount, 10) : 
                req.query.amount = req.query.amount;

            if (this.App.isNull(req.query.key) || req.query.key != config.apiKey){
                res.status(401).send("<h1>Forbidden</h1>");//TODO Build system errors with pug
                return;
            }

            try {
                const entries = await this.App.Api().getLastEntries(req.query.amount);
                res.send(entries);
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/last-entries\"");
    }


    /**
     * This function render routes with api deletes
     */
    renderApiDeleteEntries(){
        this.server.post('/api/delete-entrie', (req, res) => {
            typeof req.body.postId == "string" ?
                req.body.postId = parseInt(req.query.postId, 10) : 
                req.body.postId = req.body.postId;

            if (req.connection.remoteAddress != "::1"){
                res.status(401).send("<h1>Forbidden</h1>");//TODO Build system errors with pug
                return;
            }

            try {
                this.App.Api().deleteEntrie(req.body.postId);
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/delete-entrie\"");
    }


    /**
     * This function render the register pasarel
     * @param {*} passport passport
     */
    renderRegister(passport){
        this.server.get('/signup', this.preventRelogin, (req, res) => {
            try {
                if (req.isAuthenticated()) res.redirect('/logout');
                res.render('signup', { message: req.flash('message') });
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });

        this.server.post('/signup', passport.authenticate('signup', {
            successRedirect: '/panel',
            failureRedirect: '/signup',
            failureFlash: true 
        }));


        this.App.debug("The server is registering route: \"/signup\" aiming to: signup");
    }


    /**
     * This function render the login pasarel
     * @param {*} passport passport
     */
    renderLogin(passport){
        this.server.get('/login', this.preventRelogin, (req, res) => {
            try {
                res.render('login', { message: req.flash('message') });
            } 
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });

        this.server.post('/login', passport.authenticate('login', {
            successRedirect: '/panel',
            failureRedirect: '/login',
            failureFlash: true 
        }));

        this.App.debug("The server is registering route: \"/login\" aiming to: login");
    }


    /**
     * This function render the signout for destroy sessions
     */
    renderLogout(){
        this.server.get('/logout', (req, res) => {
            try {
                req.logout();
                res.redirect('/login');
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });

        this.App.debug("The server is registering route: \"/logout\" aiming to: nothing view")
    }


    renderPanel(){
        this.server.get('/panel', this.isAuthenticated, (req, res) => {
            try {
                res.render('panel', {username: req.user.username});
            } 
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        
        this.App.debug("The server is registering route: \"/panel\" aiming to: panel");
    }


    /**
     * This function protect panel checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    isAuthenticated(req, res, next){
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }


    /**
     * This function prevent relogin checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    preventRelogin(req, res, next){
        if (req.isAuthenticated()) res.redirect('/logout');
        else next();
    }


}