/** IMPORTS **/

const express      = require("express");
const App          = require("./App");
const path         = require("path");
const rateLimit    = require("express-rate-limit");
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require("express-session");
const passport     = require("passport");
const sitemap      = require("express-sitemap")();
const server       = express();
const manager      = new App(server, path);


/** REST **/

manager.configureProxy(rateLimit);
manager.configureServer(cookieParser, bodyParser, session, passport);
manager.prepareServer();
manager.prepareRoutes();

sitemap.generate(server);
sitemap.toFile();