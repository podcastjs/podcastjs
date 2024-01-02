const rimraf = require("rimraf");
const util = require("util");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const copyPromise = util.promisify(fsExtra.copy);
const markdownit = require('markdown-it');
const handlebars = require('handlebars');
const md = markdownit({breaks:true})

function SsrHtmlRender(){
  
  this.start = async (aseLocation, markdownFolderAbsoluteLocation,  markdownFilesMetadata, 
      siteFolderAbsoluteLocation, themeLocationAbsoluteLocation) => {

    //create post folders
    var postFolderAbsoluteLocation = path.join(siteFolderAbsoluteLocation, "posts");

    try {
      await fs.promises.access(postFolderAbsoluteLocation, fs.constants.F_OK)
      await fs.promises.rm(postFolderAbsoluteLocation, { recursive: true });
    } catch (e) {
      console.log("posts folder was not found");
    }    

    await fs.promises.mkdir(postFolderAbsoluteLocation)

    var rawTemplate = await fs.promises.readFile(path.join(themeLocationAbsoluteLocation, "single-post.html"), "utf-8");
    var singlePostTemplate = handlebars.compile(rawTemplate);

    for(markdownFileInfo of markdownFilesMetadata){
      console.log(markdownFileInfo.path)
      var htmlFileAbsoluteLocation = path.join(markdownFolderAbsoluteLocation, markdownFileInfo.path);
      var rawMarkdown = await fs.promises.readFile(htmlFileAbsoluteLocation, "utf-8");
      const result = md.render(markdownFileInfo.text);
      var data = { "author": markdownFileInfo.author, "datetime_str": markdownFileInfo.datetime_str,
      "duration": markdownFileInfo.duration,"title": markdownFileInfo.title, sound_url: markdownFileInfo.sound_url
      };
      var renderedHtml = singlePostTemplate(data);   
      var readyHtml = renderedHtml.replace("@html", result);
      var singlePostFolder = path.dirname(markdownFileInfo.path);
      var extension = path.extname(markdownFileInfo.path);
      var markdownFileName = path.basename(markdownFileInfo.path,extension);
      //write the post 
      await fs.promises.mkdir(path.join(postFolderAbsoluteLocation, singlePostFolder), { recursive: true })
      await fs.promises.writeFile(path.join(postFolderAbsoluteLocation, singlePostFolder, markdownFileName+".html"), readyHtml);
    }

  }
}

module.exports = SsrHtmlRender;
