class PostBuilder {


    /** SMALL CONSTRUCTORS **/

    constructor(){
        this.posts = new Array();
        this.trigger = 4;
    }


    /** REST **/

    /**
     * This function build and return the request response
     */
    requestLastPosts(){
        const url = `/api/last-entries?key=${apiKey}&amount=100`;
        const req = new XMLHttpRequest();

        req.open("get", url, true);
        req.onreadystatechange = (event) => {
            if (req.readyState === 4)
                if (req.status === 200) {
                    this.posts = JSON.parse(req.responseText);
                    this.buildPosts();
                } 
                else {
                    console.error(req.statusText);
                }
        };
        req.send();
    }


    /**
     * This function return a randomColor for card
     */
    randomColor(){
        const random = Math.floor((Math.random() * 2) + 0);

        switch (random){
            case 0:
                return "blue";
            case 1:
                return "red";
            case 2:
                return "night";
        }
    }


    /**
     * This function return a date formatted
     * @param {Date} date date
     * @return {String} date 
     */
    dateFormater(date){
        return ("0" + date.getDate()).slice(-2) + "/" + ("0" + date.getMonth()).slice(-2) + "/" + date.getFullYear() + " " + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2);
    }


    /**
     * This function format the description
     * @param {String} description description
     * @return {String} description 
     */
    descriptionFormater(description){
        return description.includes("\\n") ? description.replace("\\n", "<br>") : description;
    }


    /**
     * This function build the posts
     */
    buildPosts(){
        const externalSvg = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTExLjYyNiA1MTEuNjI3IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTEuNjI2IDUxMS42Mjc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzkyLjg1NywyOTIuMzU0aC0xOC4yNzRjLTIuNjY5LDAtNC44NTksMC44NTUtNi41NjMsMi41NzNjLTEuNzE4LDEuNzA4LTIuNTczLDMuODk3LTIuNTczLDYuNTYzdjkxLjM2MSAgICBjMCwxMi41NjMtNC40NywyMy4zMTUtMTMuNDE1LDMyLjI2MmMtOC45NDUsOC45NDUtMTkuNzAxLDEzLjQxNC0zMi4yNjQsMTMuNDE0SDgyLjIyNGMtMTIuNTYyLDAtMjMuMzE3LTQuNDY5LTMyLjI2NC0xMy40MTQgICAgYy04Ljk0NS04Ljk0Ni0xMy40MTctMTkuNjk4LTEzLjQxNy0zMi4yNjJWMTU1LjMxYzAtMTIuNTYyLDQuNDcxLTIzLjMxMywxMy40MTctMzIuMjU5YzguOTQ3LTguOTQ3LDE5LjcwMi0xMy40MTgsMzIuMjY0LTEzLjQxOCAgICBoMjAwLjk5NGMyLjY2OSwwLDQuODU5LTAuODU5LDYuNTctMi41N2MxLjcxMS0xLjcxMywyLjU2Ni0zLjksMi41NjYtNi41NjdWODIuMjIxYzAtMi42NjItMC44NTUtNC44NTMtMi41NjYtNi41NjMgICAgYy0xLjcxMS0xLjcxMy0zLjkwMS0yLjU2OC02LjU3LTIuNTY4SDgyLjIyNGMtMjIuNjQ4LDAtNDIuMDE2LDguMDQyLTU4LjEwMiwyNC4xMjVDOC4wNDIsMTEzLjI5NywwLDEzMi42NjUsMCwxNTUuMzEzdjIzNy41NDIgICAgYzAsMjIuNjQ3LDguMDQyLDQyLjAxOCwyNC4xMjMsNTguMDk1YzE2LjA4NiwxNi4wODQsMzUuNDU0LDI0LjEzLDU4LjEwMiwyNC4xM2gyMzcuNTQzYzIyLjY0NywwLDQyLjAxNy04LjA0Niw1OC4xMDEtMjQuMTMgICAgYzE2LjA4NS0xNi4wNzcsMjQuMTI3LTM1LjQ0NywyNC4xMjctNTguMDk1di05MS4zNThjMC0yLjY2OS0wLjg1Ni00Ljg1OS0yLjU3NC02LjU3ICAgIEMzOTcuNzA5LDI5My4yMDksMzk1LjUxOSwyOTIuMzU0LDM5Mi44NTcsMjkyLjM1NHoiIGZpbGw9IiM3OTUwZjIiLz4KCQk8cGF0aCBkPSJNNTA2LjE5OSw0MS45NzFjLTMuNjE3LTMuNjE3LTcuOTA1LTUuNDI0LTEyLjg1LTUuNDI0SDM0Ny4xNzFjLTQuOTQ4LDAtOS4yMzMsMS44MDctMTIuODQ3LDUuNDI0ICAgIGMtMy42MTcsMy42MTUtNS40MjgsNy44OTgtNS40MjgsMTIuODQ3czEuODExLDkuMjMzLDUuNDI4LDEyLjg1bDUwLjI0Nyw1MC4yNDhMMTk4LjQyNCwzMDQuMDY3ICAgIGMtMS45MDYsMS45MDMtMi44NTYsNC4wOTMtMi44NTYsNi41NjNjMCwyLjQ3OSwwLjk1Myw0LjY2OCwyLjg1Niw2LjU3MWwzMi41NDgsMzIuNTQ0YzEuOTAzLDEuOTAzLDQuMDkzLDIuODUyLDYuNTY3LDIuODUyICAgIHM0LjY2NS0wLjk0OCw2LjU2Ny0yLjg1MmwxODYuMTQ4LTE4Ni4xNDhsNTAuMjUxLDUwLjI0OGMzLjYxNCwzLjYxNyw3Ljg5OCw1LjQyNiwxMi44NDcsNS40MjZzOS4yMzMtMS44MDksMTIuODUxLTUuNDI2ICAgIGMzLjYxNy0zLjYxNiw1LjQyNC03Ljg5OCw1LjQyNC0xMi44NDdWNTQuODE4QzUxMS42MjYsNDkuODY2LDUwOS44MTMsNDUuNTg2LDUwNi4xOTksNDEuOTcxeiIgZmlsbD0iIzc5NTBmMiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

        for (let i = 0; i < this.trigger; i++){
            if (!this.posts.length || this.posts[i] == undefined){
                $("#load-more").remove();
                break;
            }
            
            const row = this.posts[i];
            const properties = {
                postId: row["postId"],
                url: "/posts" + row["url"],
                title: row["title"],
                content: row["content"],
                thumb: row["thumb"],
                description: row["description"],
                date: row["date"],
                author: row["author"],
                tags: row["tags"]
            };
            let card = "<div class='card-link'>";

            (properties.thumb != "" && properties.thumb != undefined && properties.thumb != null) ? 
                card += `<div class='card card-shadow' style=\"background-image: url('${properties.thumb}')\">` :
                card += `<div class='card card-shadow card-${this.randomColor()}'>`;
            
            card += "<div class='filter'>" + `<a href='${properties.url}' class='external'>` + `<img src='${externalSvg}'>` + "</a>";
            card += "<h3 class='is-text'>Title</h3>" + "<p class='title is-text'>" + properties.title + "</p>";
            card += "<div class='card-body'>" + "<h3 class='is-text'>Description</h3>" + "<p class='description is-text'>" + this.descriptionFormater(properties.description) + "</p></div>";
            card += "<div class='card-footer'>" + "<h3 class='is-text'>Date</h3>" + "<p class='date is-text'>" + this.dateFormater(new Date(properties.date)) + "</p></div>";
            card += "</div></div></div>";

            $("div#posts").append(card);
        }

        this.posts.splice(0, this.trigger);
    }


};

const modalNews = new Modal("modalNews");

function loadModalFeed(){
    const rand = Math.floor((Math.random() * 15) + 1);
    if (rand == 1) modalNews.open();
}


$(document).ready(() => {
    console.log("DOM Loaded");
    
    /** MODAL **/
    loadModalFeed();
    $("#modalNews .modal-close").click(() => modalNews.close());
    $("#modalNews .close").click(() => modalNews.close());
    //$("#modalNews .delete").click(() => deleteEntrie());

    /** POST BUILDER */
    const builder = new PostBuilder();
    builder.requestLastPosts();

    /** TYPED */
    try {
        new Typed('.subtitleTyped', {
            strings: ['Programming', 'Hardware', 'Technology'],
            typeSpeed: 30,
            backSpeed: 60,
            backDelay: 500,
            startDelay: 1000,
            loop: true    
        });
    } 
    catch (ignored) {}

    /** EVENTS */
    $("#load-more").on('click', (event) => builder.buildPosts());

    
});