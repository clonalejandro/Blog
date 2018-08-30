/** IMPORTS **/

const UserSchema = require("../schemas/UserSchema");
const bCrypt = require("bcrypt-nodejs");


module.exports = class UserOrm {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.Mongo = this.App.Mongo();
        this.userSchema = UserSchema;
    }


    /** REST **/

    /**
     * This function returns mongo
     */
    getMongo(){
        return this.mongo
    }

    
    /**
     * This function returns the userSchema
     */
    getSchema(){
        return this.userSchema
    }


    /**
     * This function insert into table the data passed by parameters
     * @param {String} username username 
     * @param {String} password password 
     * @param {String} email email
     */
    insert(username, password, email, callback){
        const ristre = {
            username: username,
            password: this.createHash(password),
            email: email
        };

        if (callback == null || callback == undefined)
            new this.userSchema(ristre).save(err => { 
                if (err) this.App.throwErr(err) 
            });
        else new this.userSchema(ristre).save(callback);
        
        this.App.debug("Data inserted: " + JSON.stringify(ristre));
    }


    /**
     * This function update ristre from db
     * @param {Object} condition condition 
     * @param {Object} data data
     * @param {*} callback callback
     */
    update(condition, data, callback){
        if (this.App.isNull(callback))
            this.userSchema.update(condition, data, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data updated! with this condition: " + JSON.stringify(condition) + " & the data updated: " + JSON.stringify(data));
            });
        else this.userSchema.update(condition, data, callback);
    }


    /**
     * This function delete ristre from db
     * @param {Object} condition condition
     * @param {*} callback callback
     */
    delete(condition, callback){
        if (this.App.isNull(callback))
            this.userSchema.findOneAndRemove(condition, (err, res) => {
                if (err) this.App.throwErr(err);
                else this.App.debug("Data removed! with this condition & data removed: " + JSON.stringify(condition));
            });
        else this.userSchema.findOneAndRemove(condition, callback);
    }


    /**
     * This function find by one in db
     * @param {Object} condition condition
     * @param {*} callback callback
     */
    findByOne(condition, callback){
        this.userSchema.findOne(condition, callback);
    }


    /**
     * This function find with query in db
     * @param {Object} condition condition
     * @param {String} selector selector
     * @param {*} callback callback
     */
    findByQuery(condition, selector, callback){
        if (!this.App.isNull(selector)) this.userSchema.find(condition).select(selector).exec(callback);
        else this.userSchema.find(condition).exec(callback);
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


    /**
     * This function encrypt the password passed by parameter
     * @param {String} password 
     * @return {String} passwordHashed
     */
    createHash(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }


    /**
     * This function check if user & password is correct
     * @param {String} user 
     * @param {String} password 
     * @return {Boolean} isValid
     */
    isValidPassword(user, password){
        return bCrypt.compareSync(password, user.password)
    }

}