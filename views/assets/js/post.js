/**
 * This function return a date formatted
 * @param {Date} date date
 * @return {String} date 
 */
function dateFormater(date){
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + date.getMonth()).slice(-2) + "/" + date.getFullYear() + " " + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2);
}

/**
 * This function return a randomColor for tag
 */
function randomColor(){
    const random = Math.floor((Math.random() * 3) + 0);
    switch (random){
        case 0:
            return "blue";
        case 1:
            return "red";
        case 2:
            return "pink";
        case 3:
            return "purple";
    }
}


$(document).ready(() => {
    /** FORMAT TEXT */
    $(".date").text(
        dateFormater(
            new Date($(".date").text())
        )
    );

    /** TAG COLORS */
    Object.keys($(".tag")).forEach(key => {
        const node = $(".tag")[key];
        const color = randomColor();

        try {
            node.setAttribute("class", "label tag label-" + color);
        } 
        catch (ignored){}
    });


});