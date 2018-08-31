$(document).ready(() => {
    try {
        const text = document.getElementById("alertLoginText").textContent;
        if (text == "" || text == undefined || text == null)
            $("#alertLogin").attr("style", "display: none");
        else $("#alertLogin").attr("style", null);
    } 
    catch(ignored){}
});