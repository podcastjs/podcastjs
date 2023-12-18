function HomePodcastController(){

    var defaultPageSize = 2;

    this.apiClient = window._context["ApiClient"];
    
    this.init = async () => {
        this.loadPoscastEntries();
    }
  
    this.loadPoscastEntries = () => {
        //load posts_entries
        fetch("./database.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            console.log(jsonResponse);
            console.log(jsonResponse.length);
            renderPosts(jsonResponse);
            renderPagination(jsonResponse);
        });
        
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
    
    function renderPagination(podcasts){
        console.log(`entriesCount: ${podcasts.length}`)
        console.log(`pageSize: ${defaultPageSize}`)
        var pagesCount = parseInt(podcasts.length / defaultPageSize);
        console.log(`pagesCount: ${pagesCount}`)

        var ul = document.getElementById("pagination_footer");
        //remove pre items
        ul.innerHTML = "";
        //add items        
        for(var count=0; count<pagesCount; count ++){
            var li = document.createElement("li");
            var a = document.createElement('a');
            a.setAttribute('href',"www.google.com");
            a.innerHTML = count+1; 
            if(count==0) li.classList.add("active");
            li.appendChild(a);
            ul.appendChild(li); 
        }
       
    }       

  }
  
  if(typeof window._context === 'undefined'){
     window._context = {};
  }
  window._context["HomePodcastController"] =  new HomePodcastController();