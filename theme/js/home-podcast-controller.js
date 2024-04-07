function HomePodcastController() {

    var defaultPageSize = 10;

    var currentPageIndex = 1;
    var pagesCount =  0;

    this.apiClient = window._context["ApiClient"];

    this.init = async () => {
        await this.apiClient.init();
        this.loadPodcastEntries(1);
    }

    this.loadPodcastEntries = async (pageNumber) => {
        var data = await this.apiClient.findAllPaginated(defaultPageSize, pageNumber);
        renderPosts(data.content);
        renderPagination(data.pagination, pageNumber);

        //instantiate mp3 player
        var mediaElements = document.querySelectorAll('video, audio'), total = mediaElements.length;

        for (var i = 0; i < total; i++) {
            new MediaElementPlayer(mediaElements[i], {
                pluginPath: 'https://cdn.jsdelivr.net/npm/mediaelement@4.2.7/build/',
                shimScriptAccess: 'always',
                success: function () {
                    var target = document.body.querySelectorAll('.player'), targetTotal = target.length;
                    for (var j = 0; j < targetTotal; j++) {
                        target[j].style.visibility = 'visible';
                    }
                }
            });
        }
    }

    function renderPosts(podcasts) {
        var templateSource = document.getElementById('handlebar_template_podcast_list').innerHTML;
        var template = Handlebars.compile(templateSource);

        //add post_url
        var newPodcasts = [];
        for (var podcastInfo of podcasts) {
            var newPodcastInfo = podcastInfo;
            newPodcastInfo.post_url = "/posts" + podcastInfo.path.replace(".md", ".html")
            newPodcasts.push(newPodcastInfo)
        }

        // Data in json
        var data = {
            podcasts: newPodcasts
        };

        // Generate html using template and data
        var html = template(data);
        // Add the result to the DOM
        document.getElementById('podcasts_container').innerHTML = html;
    }

    function renderPagination(paginationInfo, pageNumber) {
        var paginationContainer = document.getElementById("pagination_footer");
        //remove pre items
        paginationContainer.innerHTML = "";

        var ul = document.createElement('ul');

        //add left arrow
        var liLeft = document.createElement("li");
        liLeft.style.marginRight = "5px";
        var aLeft = document.createElement('a');
        aLeft.classList.add("icon-keyboard_arrow_left")
        aLeft.style.cursor = "pointer";
        liLeft.appendChild(aLeft);
        liLeft.addEventListener("click", onLeftArrowClick)
        ul.appendChild(liLeft);

        pagesCount = paginationInfo.pagesCount;
        //add items        
        for (var count = 0; count < paginationInfo.pagesCount; count++) {
            var li = document.createElement("li");
            li.style.marginRight = "5px";
            var a = document.createElement('a');
            a.setAttribute("page-number", count + 1);
            a.style.cursor = "pointer";
            a.innerHTML = count + 1;
            if (count + 1 == pageNumber) li.classList.add("active");
            li.appendChild(a);
            ul.appendChild(li);
            li.addEventListener("click", onPageNumberClick)
        }

        //add right arrow
        var liRight = document.createElement("li");
        var aRight = document.createElement('a');
        aRight.classList.add("icon-keyboard_arrow_right")
        aRight.style.cursor = "pointer";
        liRight.appendChild(aRight);
        liRight.addEventListener("click", onRigthArrowClick)
        ul.appendChild(liRight);

        paginationContainer.appendChild(ul);

        currentPageIndex = pageNumber;

    }

    onPageNumberClick = (element) => {
        var pageNumber = element.target.getAttribute("page-number");
        currentPageIndex = pageNumber;
        this.loadPodcastEntries(new Number(pageNumber));
        var paginationHeader = document.getElementById("pagination_header");
        paginationHeader.focus()
    }

    onLeftArrowClick = (element) => {
        element.stopPropagation();
        if(currentPageIndex==1) return;
        this.loadPodcastEntries(new Number(currentPageIndex-1));
        var paginationHeader = document.getElementById("pagination_header");
        paginationHeader.focus()
    }  
    
    onRigthArrowClick = async (element) => {
        element.stopPropagation();
        if(currentPageIndex === pagesCount) return;
        this.loadPodcastEntries(new Number(currentPageIndex+1));
        var paginationHeader = document.getElementById("pagination_header");
        paginationHeader.focus()
    }     

}

if (typeof window._context === 'undefined') {
    window._context = {};
}
window._context["HomePodcastController"] = new HomePodcastController();