/** IMPORTS **/

const FeedSchema = require("../schemas/FeedSchema");


module.exports = class FeedOrm {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.Mongo = this.App.Mongo();
        this.feedSchema = FeedSchema;
    }


    /** REST **/

    /**
     * This function returns mongo
     * @return {*} mongo 
     */
    getMongo(){
        return this.mongo
    }

    
    /**
     * This function returns the feedSchema
     * @return {*} feedSchema
     */
    getSchema(){
        return this.feedSchema
    }


    /**
     * This function insert into table the data passed by parameters
     * @param {String} email email
     * @param {*} callback callback
     */
    insert(email, callback = null){
        if (callback == null || callback == undefined)
            new this.feedSchema(email).save(err => {
                if (err) this.App.throwErr(err)
            });
        else new this.feedSchema(email).save(callback);

        this.App.debug("Data inserted: " + JSON.stringify(email));
    }


    /**
     * This function update ristre from db
     * @param {Object} condition condition 
     * @param {Object} data data
     * @param {*} callback callback
     */
    update(condition, data, callback = null){
        if (this.App.isNull(callback))
            this.feedSchema.update(condition, data, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data updated! with this condition: " + JSON.stringify(condition) + " & the data updated: " + JSON.stringify(data));
            });
        else this.feedSchema.update(condition, data, callback);
    }


    /**
     * This function delete ristre from db
     * @param {Object} condition condition
     * @param {*} callback callback
     */
    delete(condition, callback = null){
        if (this.App.isNull(callback))
            this.feedSchema.findOneAndRemove(condition, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data removed! with this condition & data removed: " + JSON.stringify(condition));
            });
        else this.feedSchema.findOneAndRemove(condition, callback);
    }


        /**
     * This function find by one in db
     * @param {Object} condition condition
     * @param {*} callback callback
     */
    findByOne(condition, callback){
        this.feedSchema.findOne(condition, callback);
    }


    /**
     * This function find with query in db
     * @param {Object} condition condition
     * @param {String} selector selector
     * @param {*} callback callback
     */
    findByQuery(condition, selector, callback){
        if (!this.App.isNull(selector)) this.feedSchema.find(condition).select(selector).exec(callback);
        else this.feedSchema.find(condition).exec(callback);
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