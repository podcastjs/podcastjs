<!-- 

layout : post
title : ¿How to install podcastjs?
description : Just open a shell and execute.
category : ai
tags : series, fiction
comments : true 
author : Rich Dotcom
thumbnail_image_url: images/img_3.jpg
datetime_str: 24 August 2017
datetime : 2017-08-24
duration: 0:30:20
sound:
  type : vocaroo_url
  value : https://vocaroo.com/embed/1jkkNDCvZhyR?autoplay=0
  language: es    
   
-->

Make sure you have met the [minimum requirements](%base_url%/install/requirements) then install podcastjs:

**Note:** It is recommended to create a new Git repository to store your documentation files and then install podcastjs as a dependency into it. See the [example directory](https://github.com/podcastjs/podcastjs/tree/master/example) to see how this is done.

1. Switch to your existing or new project directory.
2. Add podcastjs to your project via NPM's package.json file or downloading the latest version from the [releases page](https://github.com/podcastjs/podcastjs/releases)
3. In a terminal, run `npm install` to install the node dependencies
4. To start podcastjs, run `npm start` (or `npm run start_win` on Windows)
5. Visit `http://localhost:3000` in your web browser

You can now start [creating pages](%base_url%/usage/creating-pages).

**NOTE:** See the [Production Notes](%base_url%/install/production-notes) when installing for a live site.
