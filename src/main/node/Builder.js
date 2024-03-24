var fs = require("fs");
var path = require("path");
var MarkdownDataSource = require('./MarkdownDataSource.js');
const SsrHtmlRender = require("./SsrHtmlRender.js");

function Builder(){
  
  this.start = async (projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolder, themeLocation) => {
    var markdownDataSource = new MarkdownDataSource();
    markdownDataSource.setDatabaseLocation(databaseLocation);
    await markdownDataSource.init();
    markdownDataSource.setDocumentsBaseDir(markdownFolderAbsoluteLocation);
    markdownDataSource.excludeFolders(true);
    markdownDataSource.loadDocuments();
    await markdownDataSource.save();

    var ssrHtmlRender = new SsrHtmlRender();
    await ssrHtmlRender.start(projectBaseLocation, markdownFolderAbsoluteLocation, markdownDataSource.getDocuments().data, 
    siteFolder, themeLocation);        
  }
}

module.exports = Builder;
