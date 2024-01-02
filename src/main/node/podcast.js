const express = require('express');
const path = require('path');
const app = express();
const MarkdownDataSource = require("./MarkdownDataSource.js");
const Publisher = require("./Publisher.js");
const SsrHtmlRender = require("./SsrHtmlRender.js");

(async ()=> {

    // set the port of our application
    var port = process.env.PORT || 8080;
    var projectBaseLocation = process.env.PWD;
    var siteFolder = process.env.PODCAST_JS_SITE_FOLDER || "site";
    if(!siteFolder.startsWith("/")){
        siteFolder = path.join(projectBaseLocation, siteFolder);
    }
    var themeLocation = path.join(projectBaseLocation, "theme")
    var markdownFolderAbsoluteLocation = path.join(process.cwd(), "posts")

    //markdown to json for pagination and search
    var databaseLocation = path.join(process.cwd(), "theme", "database.json")
    var markdownDataSource = new MarkdownDataSource();
    markdownDataSource.setDatabaseLocation(databaseLocation);
    await markdownDataSource.init();
    markdownDataSource.setDocumentsBaseDir(markdownFolderAbsoluteLocation);
    markdownDataSource.excludeFolders(true);
    markdownDataSource.loadDocuments();
    await markdownDataSource.save();

    //move all to site folder
    var publisher = new Publisher();
    await publisher.start();

    // make express look in the public directory for assets (css/js/img)
    console.log("siteFolder: "+siteFolder)

    var ssrHtmlRender = new SsrHtmlRender();
    await ssrHtmlRender.start(projectBaseLocation, markdownFolderAbsoluteLocation, markdownDataSource.getDocuments().data, 
    siteFolder, themeLocation);
    
    app.use(express.static(siteFolder));

    // set the home page route
    app.get('/', function(req, res) {
        res.sendFile(path.join(process.env.INIT_CWD,"site", 'index.html'));
    });

    app.listen(port, function() {
        console.log('Our app is running on ' + port);
    });

})();