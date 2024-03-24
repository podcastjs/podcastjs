function HomePodcastController(){

    var defaultPageSize = 2;

    this.apiClient = window._context["ApiClient"];
    
    this.init = async () => {
        this.loadPoscastEntries(1);
    }
  
    this.loadPoscastEntries = async(pageNumber) => {

        var data = await this.apiClient.findAllPaginated(defaultPageSize, pageNumber);
        console.log("data", data)
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

    function renderPosts(podcasts){
        console.log(document.getElementById('handlebar_template_podcast_list'))
        var templateSource = document.getElementById('handlebar_template_podcast_list').innerHTML;
        var template = Handlebars.compile(templateSource);
        
        //add post_url
        var newPodcasts = [];
        for(var podcastInfo of podcasts){
            var newPodcastInfo = podcastInfo;
            newPodcastInfo.post_url = "/posts"+podcastInfo.path.replace(".md", ".html")
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
    
    function renderPagination(paginationInfo, pageNumber){
        console.log(paginationInfo)
        
        var paginationContainer = document.getElementById("pagination_footer");
        //remove pre items
        paginationContainer.innerHTML = "";

        var ul = document.createElement('ul');

        //add left arrow
        var liLeft = document.createElement("li");
        liLeft.style.marginRight = "5px";
        var aLeft = document.createElement('a');
        aLeft.setAttribute('href',"#");
        aLeft.classList.add("icon-keyboard_arrow_left")
        liLeft.appendChild(aLeft);
        ul.appendChild(liLeft);    

        //add items        
        for(var count=0; count<paginationInfo.pagesCount; count ++){
            var li = document.createElement("li");
            li.style.marginRight = "5px";
            var a = document.createElement('a');
            //a.setAttribute('href',"#");
            a.setAttribute("page-number", count+1);
            a.style.cursor = "pointer";
            a.innerHTML = count+1; 
            if(count+1==pageNumber) li.classList.add("active");
            li.appendChild(a);
            ul.appendChild(li);             
            li.addEventListener("click", onPageNumberClick)
        }

        //add right arrow
        var liRight = document.createElement("li");
        var aRight = document.createElement('a');
        aRight.setAttribute('href',"#");
        aRight.classList.add("icon-keyboard_arrow_right")
        liRight.appendChild(aRight);
        ul.appendChild(liRight);            

        paginationContainer.appendChild(ul);
       
    }

    onPageNumberClick = (element) =>{
        var pageNumber = element.target.getAttribute("page-number");
        this.loadPoscastEntries(new Number(pageNumber));
        var paginationHeader = document.getElementById("pagination_header");
        paginationHeader.focus()
    }    

  }
  
  if(typeof window._context === 'undefined'){
     window._context = {};
  }
  window._context["HomePodcastController"] =  new HomePodcastController();