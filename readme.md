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

A simple static site generator for podcasters. Made with love

## Requirements

- Nodejs
- Markdown files
- Mp3 or wav public urls

## Demo

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

After the creationof your markdowns and settings, if you need a static site to be hosted in some server, follow these steps

Generate the static site

```
podcastjs --publish
```

By default, it creates a **site** folder. If you need a custom folder:

```
podcastjs --publish docs
```

## How it works

Only add any markdown file inside the posts folder with a content like this:

```
<!-- 

layout : post
title : ¿Cómo crear un programa que aprenda por si solo?
description : Un programa que aprenda de forma autónoma, es algo muy complejo.
category : ai
tags : series, fiction
comments : true 
author : Rich Dotcom
thumbnail_image_url: images/img_3.jpg
datetime_str: 20 September 2017
datetime : 2017-08-20
duration: 0:30:20
sound_url: http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3

-->

Here you can put your markdown

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
