const express = require('express');
const path = require('path');
const app = express();
const MarkdownDataSource = require("./MarkdownDataSource.js");
const Publisher = require("./Publisher.js");


(async ()=> {

    // set the port of our application
    var port = process.env.PORT || 8080;

    //markdown to json for pagination and search
    var databaseLocation = path.join(process.cwd(), "theme", "database.json")
    var markdownDataSource = new MarkdownDataSource();
    markdownDataSource.setDatabaseLocation(databaseLocation);
    await markdownDataSource.init();
    markdownDataSource.setDocumentsBaseDir(path.join(process.cwd(), "posts"));
    markdownDataSource.excludeFolders(true);
    markdownDataSource.loadDocuments();
    await markdownDataSource.save();

    //move all to site folder
    var publisher = new Publisher();
    await publisher.start();

    // make express look in the public directory for assets (css/js/img)
    var siteFolder = path.join(process.env.INIT_CWD,"site");
    console.log("siteFolder: "+siteFolder)
    
    app.use("/", express.static(siteFolder));

    // set the home page route
    app.get('/', function(req, res) {
        res.sendFile(path.join(process.env.INIT_CWD,"site", 'index.html'));
    });

    app.listen(port, function() {
        console.log('Our app is running on ' + port);
    });

})();