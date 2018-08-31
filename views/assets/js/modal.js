class Modal {


    /** SMALL CONSTRUCTORS **/

    constructor(elementId){
        this.modal = document.getElementById(elementId);
    }


    /** REST **/

    /**
     * This function open the modal
     */
    open(){
        this.modal.setAttribute("class","modal is-visible")
    }


    /**
     * This function close the modal
     */
    close(){
        this.modal.setAttribute("class", "modal")
    }


    /**
     * This function register a listener when you click left the window close the modal
     */
    registerListenerOnClickLeft(){
        window.onclick = () => this.close();
    }


};