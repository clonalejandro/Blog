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
            this.server.get(url, (req, res) => res.render(view));
            this.App.debug("The server is registering route: \"" + url + "\" aiming to: " + view);
        })
    }


    /**
     * This function render posts with db
     * @param {PostOrm} PostOrm 
     */
    renderPosts(PostOrm){
        PostOrm.findByQuery({}, null, (err, res) => {
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

                this.server.get(data.url, (req, res) => 
                    res.render('post', {
                        title: data.title,
                        content: data.content,
                        thumb: data.thumb,
                        description: data.description,
                        date: data.date,
                        author: data.author,
                        tags: data.tags
                    })
                );

                this.App.debug("The server is registering route: \"" + data.url + "\" aiming to: post");
            })
        })
    }


}