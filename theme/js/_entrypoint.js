function EntryPoint() {

    var homePodcastController = window._context["HomePodcastController"];

    this.init = async () => {
        homePodcastController.init();
    }

    $(document).ready(() => {
        this.init();
    });

}

if (typeof window._context === 'undefined') {
    window._context = {};
}
window._context["EntryPoint"] = new EntryPoint();