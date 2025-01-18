const util = require("util");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const copyPromise = util.promisify(fsExtra.copy);
const markdownit = require('markdown-it');
const Handlebars = require('handlebars');
const md = markdownit({ breaks: true,html: true })
const yaml = require('js-yaml');

function SsrHtmlRender() {

  this.start = async (projectBaseLocation, markdownFolderAbsoluteLocation, markdownFilesMetadata,
    siteFolderAbsoluteLocation, themeLocationAbsoluteLocation) => {

      Handlebars.registerHelper('if_strint_eq', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('toDateString', function(arg1, options) {
      try {
          var parts = arg1.split("-");
          var date = new Date(parts[0], parts[1]-1, parts[2]);
          return date.toDateString().replace(/^\S+\s/,'')
      } catch (error) {
          console.log("Failed to evaluate helper: toDateString")
          console.log(error)
          return arg1;
      }
    });       

    var rawYamlString = await fs.promises.readFile(path.join(projectBaseLocation, "settings.yaml"), 'utf8')
    const settings = yaml.load(rawYamlString);

    await renderPosts(markdownFolderAbsoluteLocation, markdownFilesMetadata,
      siteFolderAbsoluteLocation, themeLocationAbsoluteLocation, settings);

    await renderHomePage(projectBaseLocation, markdownFolderAbsoluteLocation, markdownFilesMetadata,
      siteFolderAbsoluteLocation, themeLocationAbsoluteLocation, settings)
  }

  async function renderHomePage(projectBaseLocation, markdownFolderAbsoluteLocation, markdownFilesMetadata,
    siteFolderAbsoluteLocation, themeLocationAbsoluteLocation, settings) {

    var rawTemplate = await fs.promises.readFile(path.join(themeLocationAbsoluteLocation, "index.html"), "utf-8");
    var indexTemplate = Handlebars.compile(rawTemplate);

    console.log("Home page: ", path.join(themeLocationAbsoluteLocation, "index.html"))
    var htmlFileAbsoluteLocation = path.join(projectBaseLocation, "index.html");
    var renderedHtml = indexTemplate(settings);
    //insert the handlebar template (script) for csr usage
    var podcastListRawTemplateString =  await fs.promises.readFile(path.join(themeLocationAbsoluteLocation,
      "podcast_list.html"), "utf-8");
    renderedHtml = renderedHtml.replace("@handlebars_template_podcas_list", podcastListRawTemplateString)
    //write index page
    await fs.promises.writeFile(path.join(siteFolderAbsoluteLocation, "index.html"), renderedHtml);

  }

  async function renderPosts(markdownFolderAbsoluteLocation, markdownFilesMetadata,
    siteFolderAbsoluteLocation, themeLocationAbsoluteLocation, settings) {
    //create post folders
    var postFolderAbsoluteLocation = path.join(siteFolderAbsoluteLocation, "posts");
    var publishedPostFolderExists = false;
    try {
      await fs.promises.access(postFolderAbsoluteLocation, fs.constants.F_OK)      
      publishedPostFolderExists = true;
    } catch (e) {
      if(e.code!="ENOENT")console.log(e);
      publishedPostFolderExists = false;      
    }

    if(publishedPostFolderExists===true){
      try {
        await fs.promises.rm(postFolderAbsoluteLocation, { recursive: true });
        console.log("cleaned "+postFolderAbsoluteLocation)
      } catch (e) {
        console.log("Failed to clear the published posts folder: "+postFolderAbsoluteLocation, e);
        process.exit(1)
      }
    }
    
    await fs.promises.mkdir(postFolderAbsoluteLocation)

    var rawTemplate = await fs.promises.readFile(path.join(themeLocationAbsoluteLocation, "single-post.html"), "utf-8");
    var singlePostTemplate = Handlebars.compile(rawTemplate);

    console.log("Markdown to be built:")
    for (markdownFileInfo of markdownFilesMetadata) {
      console.log(markdownFileInfo.path)
      var htmlFileAbsoluteLocation = path.join(markdownFolderAbsoluteLocation, markdownFileInfo.path);
      var rawMarkdown = await fs.promises.readFile(htmlFileAbsoluteLocation, "utf-8");
      const result = md.render(markdownFileInfo.text);
      var data = {
        ...markdownFileInfo,
        "site_name": settings.site_name, "about_us_paragraph": settings.about_us_paragraph, "disqus_id": settings.disqus_id
      };
      var renderedHtml = singlePostTemplate(data);
      var readyHtml = renderedHtml.replace("@html", result);
      var singlePostFolder = path.dirname(markdownFileInfo.path);
      var extension = path.extname(markdownFileInfo.path);
      var markdownFileName = path.basename(markdownFileInfo.path, extension);
      //write the post 
      await fs.promises.mkdir(path.join(postFolderAbsoluteLocation, singlePostFolder), { recursive: true })
      await fs.promises.writeFile(path.join(postFolderAbsoluteLocation, singlePostFolder, markdownFileName + ".html"), readyHtml);
    }
  }
}

module.exports = SsrHtmlRender;
