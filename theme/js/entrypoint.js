function EntryPoint() {
    
    var homePodcastController = window._context["HomePodcastController"];

    this.init = async () => {
        var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
        if(context == ""){
            context = "home";
        }
        console.log("context: "+context)
        console.log("window._context", window._context)
        switch (context){
            case "home" : homePodcastController.init();
        }
        
    }

    $(document).ready(() => {
        this.init();
    });

}

if (typeof window._context === 'undefined') {
    window._context = {};
}
window._context["EntryPoint"] = new EntryPoint();