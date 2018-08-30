/** IMPORTS **/

const bCrypt = require("bcrypt-nodejs");
const LocalStrategy = require("passport-local").Strategy;


module.exports = class Auth {

    
    /** SMALL CONSTRUCTORS **/

    constructor(App, passport){
        this.App = App;
        this.passport = passport;

        this.configureLogin();
        this.configureRegister();
    }


    /** REST **/

    /**
     * This is an instance of passport
     */
    Passport(){
        return this.passport
    }


    /**
     * This function configure the login strategy
     */
    configureLogin(){
        const localStrategy = new LocalStrategy({passReqToCallback: true, usernameField: 'username', passwordField: 'password'}, (req, username, password, done) => this.App.UserOrm().findByOne(
            {'username': username}, (err, user) => {
                if (err) {
                    this.App.throwErr(err);
                    return done(err);
                }
                
                if (!user) return done(null, false, req.flash('message', 'User Not found!'));
                if (!this.isValidPassword(user, password)) return done(null, false, req.flash('message', 'Invalid Password'));
                return done(null, user);
            }
        ));

        this.passport.use('login', localStrategy)
    }


    /**
     * This function configure the register strategy
     */
    configureRegister(){
        const localStrategy = new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
            const findOrCreateUser = () => this.App.UserOrm().findByOne({'username': username}, (err, user) => {
                if (err){
                    this.App.throwErr(err);
                    return done(err);
                }

                if (user) return done(null, false, req.flash('message', 'User Already Exists'));
                
                var schema = this.App.UserOrm().getSchema();
                schema = new schema();
    
                schema.username = username;
                schema.password = password;
                schema.email = req.param.email;
            
                schema.save(err => {
                    if (err){
                        this.App.throwErr(err);
                        return;
                    }
                    return done(null, schema);
                })
            });
            process.nextTick(findOrCreateUser);
        });

        this.passport.use('signup', localStrategy)
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