class PostTable {


    /** SMALL CONSTRUCTORS **/

    constructor(){
        this.posts = new Array();
        this.trigger = 10;
        this.requestLastPosts();
    }


    /** REST **/

    /**
     * This function build and return the request response
     */
    requestLastPosts(){
        const url = "/api/last-entries?key=12345A&amount=100";
        const req = new XMLHttpRequest();

        req.open("get", url, true);
        req.onreadystatechange = (event) => {
            if (req.readyState === 4)
                if (req.status === 200) {
                    this.posts = JSON.parse(req.responseText);
                    this.buildPosts();
                } 
                else console.error(req.statusText);
        };
        req.send();
    }


    /**
     * This function draw all post per trigger
     */
    buildPosts(){
        for (let i = 0; i < this.trigger; i++){ 
            if (!this.posts.length){
                $("#load-more").remove();
                break;
            }

            const row = this.posts[i];
            const properties = {
                postId: row["postId"],
                title: row["title"],
            };

            let element = "<tr>";

            element += "<td>" + properties.postId + "</td>";
            element += "<td>" + properties.title + "</td>";
            element += "<td>" + `<a class='btn btn-icon red animated' onclick='openTrasher(this)' id='D${properties.postId}'><i class='icon icons-trash'></i></a>` + "</td>";

            $("#posts").append(element);
        }
        this.posts.splice(0, this.trigger);
    }
};


/** FUNCTIONAL **/

var postId = 0;
const modalTrasher = new Modal("modalTrasher");

$(document).ready(() => {
    const postTable = new PostTable();

    //LISTENERS
    $("#modalTrasher .modal-close").click(() => modalTrasher.close());
    $("#modalTrasher .close").click(() => modalTrasher.close());
    $("#modalTrasher .delete").click(() => deleteEntrie());
});


function deleteEntrie(){
    const url = "/api/delete-entrie?postId=" + postId;
    const req = new XMLHttpRequest();

    req.open("post", url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = (event) => {
        if (req.readyState === 4)
            if (req.status === 200) {
                this.posts = JSON.parse(req.responseText);
                this.buildPosts();
            } 
            else console.error(req.statusText);
    };
    req.send("postId=" + postId);

    $($("#D" + postId).parent().parent()[0]).remove();
    modalTrasher.close();
}


function openTrasher(bind){
    modalTrasher.open();
    postId = bind.id.replace("D", "");
}