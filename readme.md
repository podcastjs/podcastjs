# Podcastjs

<p float="left">
  <img src="./.coverage/branches.svg">
  <img src="./.coverage/functions.svg">
  <img src="./.coverage/lines.svg">
  <img src="./.coverage/statements.svg">
</p>

<p align="center">
  <img src="./theme/favicon.png" width=150>  
</p>

A simple static site generator for podcasters. Made with love <3

## Requirements

- Nodejs
- Markdown files
- Mp3 or wav public urls

## Demo

- http://podcastjs-demo-01.42web.io
  - Hosted anywhere
  - source: https://github.com/podcastjs/podcastjs-demo
- https://podcastjs.github.io
  - Hosted with github page
  - source: https://github.com/podcastjs/podcastjs.github.io

## Run it

Install the tool

```
npm install -g github:/podcastjs/podcastjs
```

Create new site

```
podcastjs --new-site acme
cd ./acme
```

Start as developer

```
podcastjs --start
```

Go to http://localhost:2708 and you will see something like this

<p align="center">
 <img src="https://github.com/podcastjs/podcastjs/assets/3322836/2acac298-73b0-43b5-ac02-c5d87b98694c" width=300>
</p>

## Publish

After the creation of your markdowns and settings, if you need a static site to be hosted in some server, follow these steps

Generate the static site

```
podcastjs --publish
```

By default, it creates a **site** folder. If you need a custom folder:

```
podcastjs --publish --output=docs
```

## How to add posts?

Just add markdown files inside the posts folder with a content like this:

```
<!-- 

layout : post
title : Contributing
description : To contribute, follow the nex steps
category : ai
tags : series, fiction
comments : true 
author : Rich Dotcom
thumbnail_image_url: images/img_3.jpg
datetime : "2017-08-20"
duration: 0:30:20
sound:
  type : simple_url
  value : http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3
  language: en

-->

Here you can put your markdown!!!

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

```

And podcast.js will render as

![image](https://github.com/podcastjs/podcastjs/assets/3322836/6c0c4295-5727-456e-b846-b2fab18e8f7b)

## How to host your audio files?

We suppport the following sound hosts:

**[Vocaroo](https://github.com/podcastjs/podcastjs/wiki/Vocaroo)**

Just upload your sound, get the public url and set it like this:
```
sound:
  type : vocaroo_url
  value : https://vocaroo.com/embed/1jkkNDCvZhyR?autoplay=0
  language: es   
```

**Anywhere**

Host anywhere but it should be a valid mp3 or wav and not to have the response header (`Content-Disposition: attachment`) which tells the browser to download instead direct reproducing. Samples:
  - http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3

In this case, just the public url like this

```
sound:
  type : simple_url
  value : http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3
  language: en
```

## For nodejs developers (contributors)

Clone this repository and execute

```js
npm run dev
```


## Acknowledgments

- https://themewagon.com/themes/free-bootstrap-4-html5-responsive-musical-website-template-podcast/
- https://www.flaticon.com/free-icon/voice_3178286
- <a href="https://www.flaticon.com/free-icons/voice-chat" title="voice chat icons">Voice chat icons created by Uniconlabs - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/spanish" title="spanish icons">Spanish icons created by Freepik - Flaticon</a>


## Roadmap

- Check the issues page

## Contributors

<table>
  <tbody>    
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>
  </tbody>
</table>
