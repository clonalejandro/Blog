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


}