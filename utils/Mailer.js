/** IMPORTS **/

const mailer = require("nodemailer");
const config = require("../assets/data/config.json");


/** PRIVATE METHODS **/

function prepareServer(){
    if (config.gmail.use)
        return mailer.createTransport(config.gmail.config);
    else if (config.stmp.use)
        return mailer.createTransport(config.stmp.config);
}


module.exports = class Mailer {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.server = prepareServer();
    }


    /** REST **/

    /**
     * This function send a mail from mail server
     * @param {Object} options options
     */
    sendMail(options){
        if (!config.stmp.use && !config.gmail.use) {
            this.App.throwAlert("Not defined mail server in the config file");
            return;
        }

        this.server.sendMail(options, (err, res) => {
            if (err) {
                this.App.throwErr(err);
                return;
            }

            this.App.debug("Email sent: " + res.response);
        })
    }

    
}