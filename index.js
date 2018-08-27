/** IMPORTS **/

const express = require("express");
const App = require("./App");
const path = require("path");
const server = express();
const manager = new App(server, path);


/** REST **/

manager.prepareServer(3000);
manager.prepareRoutes();