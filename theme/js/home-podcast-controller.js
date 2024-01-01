function HomePodcastController(){

    var defaultPageSize = 2;

    this.apiClient = window._context["ApiClient"];
    
    this.init = async () => {
        this.loadPoscastEntries(1);
    }
  
    this.loadPoscastEntries = async(pageNumber) => {

        var data = await this.apiClient.findAllPaginated(defaultPageSize, pageNumber);
        renderPosts(data.content);
        renderPagination(data.pagination);
        
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
        var templateSource = document.getElementById('myTemplate').innerHTML;
        var template = Handlebars.compile(templateSource);
    
        // Data in json
        var data = {
            podcasts: podcasts
        };
    
        // Generate html using template and data
        var html = template(data);
    
        // Add the result to the DOM
        document.getElementById('podcasts_container').innerHTML = html;
    }   
    
    function renderPagination(paginationInfo){
        console.log(paginationInfo)
        
        var ul = document.getElementById("pagination_footer");
        //remove pre items
        ul.innerHTML = "";
        //add items        
        for(var count=0; count<paginationInfo.pagesCount; count ++){
            var li = document.createElement("li");
            var a = document.createElement('a');
            //a.setAttribute('href',"#");
            a.setAttribute("page-number", count+1);
            a.style.cursor = "pointer";
            a.innerHTML = count+1; 
            if(count==0) li.classList.add("active");
            li.appendChild(a);
            ul.appendChild(li);             
            li.addEventListener("click", onPageArrowClick)
        }
       
    }

    onPageArrowClick = (element) =>{
        var pageNumber = element.target.getAttribute("page-number");
        this.loadPoscastEntries(new Number(pageNumber));
    }    

  }
  
  if(typeof window._context === 'undefined'){
     window._context = {};
  }
  window._context["HomePodcastController"] =  new HomePodcastController();