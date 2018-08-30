/** IMPORTS **/

const PostSchema = require("../schemas/PostSchema");


/** PRIVATE METHODS **/

/**
 * This function format date passed by parameter
 * @param {Date} date date
 * @return {Date} formatted
 */
const formatDate = () => {
    return new Date(new Date().toLocaleString("en-US"));
};


module.exports = class PostOrm {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.Mongo = this.App.Mongo();
        this.postSchema = PostSchema;
    }


    /** REST **/

    /**
     * This function returns mongo
     */
    getMongo(){
        return this.mongo
    }

    
    /**
     * This function returns the postSchema
     */
    getSchema(){
        return this.postSchema
    }


    /**
     * This function insert into table the data passed by parameters
     * @param {String} url 
     * @param {String} title 
     * @param {String} content 
     * @param {String} author 
     * @param {Array} tags 
     */
    insert(url, title, content, thumb, author, tags){
        this.postSchema.find().select("postId").sort({postId: 'desc'}).exec((err, res) => {
            const ristre = {
                postId: res[0]["postId"] + 1,
                url: url,
                title: title,
                content: content,
                thumb: thumb,
                description: content.substring(0, 300),//get first 300 chars
                date: formatDate(),
                author: author,
                tags: tags
            };

            new this.postSchema(ristre).save(err => { 
                if (err) this.App.throwErr(err) 
            });

            this.App.debug("Data inserted: " + JSON.stringify(ristre));
        })
    }


    /**
     * This function update ristre from db
     * @param {Object} condition condition 
     * @param {Object} data data
     * @param {*} callback callback
     */
    update(condition, data, callback){
        if (this.App.isNull(callback))
            this.postSchema.update(condition, data, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data updated! with this condition: " + JSON.stringify(condition) + " & the data updated: " + JSON.stringify(data));
            });
        else this.postSchema.update(condition, data, callback);
    }


    /**
     * This function delete ristre from db
     * @param {Object} condition condition
     * @param {*} callback callback
     */
    delete(condition, callback){
        if (this.App.isNull(callback))
            this.postSchema.findOneAndRemove(condition, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data removed! with this condition & data removed: " + JSON.stringify(condition));
            });
        else this.postSchema.findOneAndRemove(condition, callback);
    }


    /**
     * This function return a posts content with primary key
     * @param {String} pk primary key 
     * @param {*} callback callback
     * @return {String} post content
     */
    findByPk(pk, selector, callback){
        const condition = {postId: pk};
        this.postSchema.find(condition).select(selector).exec(callback)
    }


    /**
     * This function return a posts content
     * @param {Object} condition condition
     * @param {String} selector selector
     * @param {*} callback callback
     * @return {String} post content
     */
    findByQuery(condition, selector, callback){
        if (!this.App.isNull(selector))
            this.postSchema.find(condition).select(selector).exec(callback);
        else this.postSchema.find(condition).exec(callback);
    }


    /**
     * This function print all data
     */
    printAll(){
        this.findByQuery({}, null, (err, res) => {
            if (err) this.App.throwErr(err);
            else res.forEach(row => this.App.debug(row))
        })
    }


}