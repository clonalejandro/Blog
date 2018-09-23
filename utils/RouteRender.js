/** IMPORTS **/

const config = require("../assets/data/config.json");
const path = require("path");
//const sitemap = require("../sitemap.xml");

module.exports = class RouteRender {


    /** SMALL CONSTRUCTORS **/

    constructor(server, App){
        this.server = server;
        this.App = App;
    }


    /** REST **/

    /**
     * This function render the sitemap
     */
    renderSitemap(){
        this.server.get('/sitemap*', (req, res) => {
            try {
                res.contentType('application/xml');
                res.sendFile(path.join(__dirname, "../sitemap.xml"));
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering sitemap");
    }


    /**
     * This function render pages with routes file
     * @param {Object} routes 
     */
    renderPages(routes){
        Object.keys(routes).forEach(url => {
            const view = routes[url];

            this.server.get(url, (req, res) => {
                try {
                    res.render(view, {
                        webURI: config.url,
                        twitter: config.twitter,
                        blogLogo: config.logo,
                        blogName: config.blogName,
                        apiKey: config.apiKey
                    })
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
     */
    renderPosts(){
        this.server.get("/posts/:postName", (req, res) => {
            this.App.PostOrm().findByQuery({url: "/" + req.params.postName}, null, (err, rows) => {
                if (rows[0] == null || rows[0] == undefined){
                    res.status(404);
                    res.render('errors/404');
                    return;
                }

                rows = rows[0];
                
                try {
                    res.render('post', {
                        webURI: config.url,
                        blogLogo: config.logo,
                        blogName: config.blogName,
                        twitter: config.twitter,
                        id: rows.postId,
                        title: rows.title,
                        content: rows.content,
                        thumb: rows.thumb,
                        description: rows.description,
                        date: rows.date,
                        author: rows.author,
                        tagsString: rows.tags.join(" "),
                        tags: rows.tags,
                        isAuthenticated: req.isAuthenticated(),
                        apiKey: config.apiKey
                    })
                }
                catch (err){
                    this.renderInternalErr(res, err);
                }
            })
        });
        this.App.debug("The server is registering posts routes");
    }


    /**
     * This function render all api routes
     */
    renderApi(){
        this.renderApiEntries();
        this.renderApiDeleteEntries();
        this.renderApiUpdateContent();
        this.renderApiCreateEntrie();
        this.renderApiDeleteMail();
        this.renderApiCreateMail(); 
        this.renderApiTest();
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
                this.renderForbidden(res);
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
                req.body.postId = parseInt(req.body.postId, 10) : 
                req.body.postId = req.body.postId;

            if (!req.isAuthenticated()){
                this.renderForbidden(res);
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
     * This function render routes with api update content
     */
    renderApiUpdateContent(){
        this.server.post('/api/update-entrie-content', (req, res) => {
            typeof req.body.postId == "string" ?
                req.body.postId = parseInt(req.body.postId, 10) :
                req.body.postId = req.body.postId;

            if (!req.isAuthenticated()){
                this.renderForbidden(res);
                return;
            }

            try {
                this.App.Api().updateEntrieContent(req.body.postId, req.body.content, req.body.description);
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/update-entrie-content\"");
    }


    /**
     * This function render route for api create a post
     */
    renderApiCreateEntrie(){
        this.server.post('/api/create-entrie', (req, res) => {
            if (!req.isAuthenticated()){
                this.renderForbidden(res);
                return;
            }

            //HYDRATE tags
            req.body.tags = req.body.tags.replace("[", "");
            req.body.tags = req.body.tags.replace("]", "");
            req.body.tags = this.App.replaceAll(req.body.tags, "\"", "");
            req.body.tags = req.body.tags.split(",");

            try {
                const data = req.body;

                this.App.PostOrm().insert(data.url, data.title, data.content, data.thumb, data.description, req.user.username, data.tags);
                this.App.Api().alertNewsletter(data);

                res.redirect('/panel');
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/create-entrie\"");
    }


    /**
     * This function render route for api delete email from feed
     */
    renderApiDeleteMail(){
        this.server.get('/api/delete-mail', (req, res) => {
            this.App.FeedOrm().findByQuery({_id: req.query.id}, null, (err, rows) => {
                if (rows[0] == null || rows[0] == undefined){
                    res.render('errors/404');
                    return;
                }

                rows = rows[0];

                try {
                    this.App.Api().deleteMail(req.params.id, rows.email);
                    res.redirect('/');
                }
                catch (err){
                    this.App.throwAlert(err);
                    res.status(500).send(err);
                }
            })
        });
        this.App.debug("The server is registering api-route: \"/api/delete-mail\"");
    }


     /**
     * This function render route for api create email from feed
     */
    renderApiCreateMail(){
        this.server.post('/api/create-mail', (req, res) => {
            try {
                this.App.Api().createMail(req.body.email);
                res.redirect('/');
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/create-mail\"");
    }


    /**
     * This function render route for api test
     */
    renderApiTest(){
        this.server.post('/api/test', (req, res) => {
            if (!req.isAuthenticated()){
                this.renderForbidden(res);
                return;
            }

            try {
                this.App.debug(req.body, "TEST");
                res.redirect('/panel');
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        this.App.debug("The server is registering api-route: \"/api/test\"");
    }


    /**
     * This function render the register pasarel
     * @param {*} passport passport
     */
    renderRegister(passport){
        this.server.get('/signup', this.preventRelogin, (req, res) => {
            try {
                if (req.isAuthenticated()) res.redirect('/logout');
                res.render('signup', { 
                    message: req.flash('message'),
                    blogLogo: config.logo,
                    twitter: config.twitter,
                    webURI: config.url
                });
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
                res.render('login', { 
                    message: req.flash('message'),
                    blogLogo: config.logo,
                    twitter: config.twitter,
                    webURI: config.url 
                });
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


    /**
     * This function render the panel route and the panel view
     */
    renderPanel(){
        this.server.get('/panel', this.isAuthenticated, (req, res) => {
            try {
                res.render('panel', {username: req.user.username, apiKey: config.apiKey});
            } 
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err);
            }
        });
        
        this.App.debug("The server is registering route: \"/panel\" aiming to: panel");
    }


    /**
     * This function render errors like 404, 500
     */
    renderErrors(){
        //404
        this.server.use((req, res) =>
            res.render('errors/404', {
                webURI: config.url,
                twitter: config.twitter,
                blogLogo: config.logo,
                blogName: config.blogName,
                apiKey: config.apiKey
            })
        );
        this.App.debug("The server is registering route: \"404\" aiming to: errors/404");

        //500
        this.server.use((error, req, res, next) => {
            res.status(error.stauts || 500)
            res.render('errors/500', {
                webURI: config.url,
                twitter: config.twitter,
                blogLogo: config.logo,
                blogName: config.blogName,
                apiKey: config.apiKey,
                error: error.message
            })
        });
        this.App.debug("The server is registering route: \"500\" aiming to: errors/500");
    }


    /**
     * This function render all 500 error
     * @param {*} res res
     * @param {*} error error
     */
    renderInternalErr(res, error){
        res.status(500);
        res.render('errors/500', {
            webURI: config.url,
            twitter: config.twitter,
            blogLogo: config.logo,
            blogName: config.blogName,
            apiKey: config.apiKey,
            error: error.message
        })
    }


    /**
     * This function render all 401 error
     * @param {*} res res
     */
    renderForbidden(res){
        res.status(401);
        res.render('errors/401', {
            webURI: config.url,
            twitter: config.twitter,
            blogLogo: config.logo,
            blogName: config.blogName,
            apiKey: config.apiKey
        })
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