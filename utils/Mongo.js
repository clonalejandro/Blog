/** IMPORTS **/

const mongoose = require("mongoose");


module.exports = class Mongo {


    /** SMALL CONSTRUCTORS **/

    constructor(dbName, App){
        this.App = App;
        this.properties = {
            name: dbName,
            url: "mongodb://localhost:27017/" + dbName
        };
    }


    /** REST **/

    /**
     * This function init the class and manage this
     */
    start(){
        mongoose.connect(this.properties.url, err => {
            if (err) this.App.throwErr(err);
            else this.App.debug("Database connected!");
        })
    }


    /**
     * This function return a mongoose instance
     */
    getClient(){
        return mongoose
    }


    /**
     * This function treat a scheam and return this treatted
     * @param {String} name 
     * @param {*} schema 
     * @return {*} schema
     */
    treatSchema(name, schema){
        return mongoose.model(name, schema)
    }


}