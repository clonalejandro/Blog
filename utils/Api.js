module.exports = class Api {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
    }


    /** REST **/

    /**
     * This function return the last entries
     * @param {number} amount 
     */
    getLastEntries(amount = 1){
        const schema = this.App.PostOrm().getSchema();
        return schema.find().sort({date: 'desc'}).limit(amount).exec();
    }


}