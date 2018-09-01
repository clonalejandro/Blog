/** IMPORTS **/

const config = require("../assets/data/config.json");


module.exports = class Api {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
    }


    /** REST **/

    /**
     * This function return the last entries
     * @param {number} amount amount
     */
    getLastEntries(amount = 1){
        const schema = this.App.PostOrm().getSchema();
        return schema.find().sort({date: 'desc'}).limit(amount).exec();
    }


    /**
     * This function delete entrie from db
     * @param {number} postId postId
     */
    deleteEntrie(postId){
        this.App.PostOrm().delete({postId: postId});
    }


    /**
     * This function update entrie content from db
     * @param {number} postId  postId
     * @param {String} content content
     * @param {String} description description
     */
    updateEntrieContent(postId, content, description){
        this.App.PostOrm().update({postId: postId}, {content: content, description: description});    
    }


    /**
     * This function remove a mail from Feed collection
     * @param {*} id id
     * @param {String} email email
     */
    deleteMail(id, email){
        this.App.FeedOrm().delete({_id: id});
        this.App.Mailer().sendMail({
            from: config.email,
            to: email,
            subject: `Goodbye from ${config.blogName}`,
            text: "Your account has been removed from our database."
        })
    }


    /**
     * This function add email for feed collection
     * @param {String} email email
     */
    createMail(email){
        this.App.FeedOrm().insert({email: email}, err => {
            if (err){
                this.App.throwErr(err);
                return;
            }

            this.App.FeedOrm().findByQuery({email: email}, "_id", (err, res) => {
                if (err){
                    this.App.throwErr(err);
                    return;
                }

                res = res[0];

                this.App.Mailer().sendMail({
                    from: config.email,
                    to: email,
                    subject: `Welcome to ${config.blogName}`,
                    text: `Happy hacking!\nIf you wish to unsubscribe here: ${config.url}/api/delete-mail?id=${res._id}`
                })
            })
        })
    }


    /**
     * This function alert to newsletter
     * @param {Object} data data
     */
    alertNewsletter(data){
        this.App.FeedOrm().findByQuery({}, null, (err, res) => {
            let emails = new Array();
            Object.keys(res).forEach(rows => emails.push(res[rows].email));
            emails = emails.join(",");

            this.App.Mailer().sendMail({
                from: config.email,
                to: emails,
                subject: `New entrie in ${config.blogName}`,
                text: `A new entrie has been published, you can see clicking here ${config.url}/posts${data.url} \nThis entrie is titled as ${data.title}`
            })
        });
    }


}