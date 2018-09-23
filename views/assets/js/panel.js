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
        const url = `/api/last-entries?key=${apiKey}&amount=100`;
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
            if (!this.posts.length || this.posts[i] == undefined){
                $("#load-more").remove();
                break;
            }

            const row = this.posts[i];
            const properties = {
                postId: row["postId"],
                title: row["title"],
                url: row["url"]
            };

            let element = "<tr>";

            element += "<td>" + `<a style='color: white' class='no-decoration' href='/posts${properties.url}'>${properties.postId}</a>` + "</td>";
            element += "<td>" + `<a style='color: white' class='no-decoration' href='/posts${properties.url}'>${properties.title}</a>` + "</td>";
            element += "<td>" + `<a class='btn btn-icon trasher red animated' onclick='openTrasher(this)' id='D${properties.postId}'><i class='icon icons-trash'></i></a>` + "</td>";

            $("#posts").append(element);
        }
        this.posts.splice(0, this.trigger);
    }
};


/** FUNCTIONAL **/

var postId = 0;
const modalTrasher = new Modal("modalTrasher", {
    registerCloseEvent: true,//When you click the "x", this close
    registerCloseOut: true//When you click out the modal, this close
});

$(document).ready(() => {
    const postTable = new PostTable();

    //LISTENERS
    $("#modalTrasher .delete").click(() => deleteEntrie());
    $("textarea").jqte({change: onContentChange}).jqteVal("<span style='color: red'>Put your post content here</span>");
    $('[name=tags]').tagify({maxTags: 20, delimiters: ","});
});


/**
 * This function extract text from html node
 * @param {String} html 
 */
function strip(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}


/**
 * This copy this content in invisible node for convert content to description without html nodes
 */
function onContentChange(){
    const editorContent = strip($(".jqte_editor").html()).substr(0, 77) + "...";
    $("#description").attr("value", editorContent);
}


/**
 * Delete an entrie post with the private api
 */
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


/**
 * Manage the content while you press the bubble button
 * @param {*} bind 
 */
function actionManager(bind){
    const id = bind.id;
    const icon = bind.childNodes[0];

    if (id == "create"){
       $("#posts").attr("style", "display: none");
       $("#creator").attr("style", null);

       bind.setAttribute("id", "return");//Switch the bubble
       icon.setAttribute("class", "icons-arrow-thin-left");//Switch the icon bubble
    }
    else if (id == "return"){
        $("#posts").attr("style", null);
        $("#creator").attr("style", "display: none");
 
        bind.setAttribute("id", "create");//Switch the bubble
        icon.setAttribute("class", "icons-plus");//Switch the icon bubble
    }
}


/**
 * Modal open o click trash button
 * @param {*} bind 
 */
function openTrasher(bind){
    modalTrasher.open();
    postId = bind.id.replace("D", "");//get id of post you want to delete
}