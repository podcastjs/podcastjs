var fs = require("fs");
var path = require("path");
var MarkdownDataSource = require('./MarkdownDataSource.js');

function Builder(){
  
  this.start = async (projectBaseLocation, markdownFolderName) => {
    console.log("Base location: "+projectBaseLocation);
    var docsLocation = path.join(projectBaseLocation, markdownFolderName);
    var customDocs = false;
    try {
      await fs.promises.access(docsLocation, fs.constants.F_OK)
      customDocs = true;
    } catch (e) {
      console.log(e);
      customDocs = false;
    }
    if(customDocs===false){
      console.log("docs folder was not found. Nothing to publish");
      return;
    }
    console.log("Markdown location: "+docsLocation);

    var databaseLocation;
    if(customDocs===true){
      databaseLocation = path.join(projectBaseLocation, "database.json")
    }else{
      databaseLocation = path.join(projectBaseLocation, "node_modules", "docs4all", "database.json")
    }

    var markdownDataSource = new MarkdownDataSource(databaseLocation);
    await markdownDataSource.safeInit();
    markdownDataSource.setDocumentsBaseDir(docsLocation);
    markdownDataSource.loadDocuments(markdownDataSource.getDocumentsBaseDir());
    await markdownDataSource.save();

    try {
      await fs.promises.access(databaseLocation, fs.constants.F_OK)
    } catch (e) {
      console.log("database.json was not found. Nothing to build");
      return;
    }

    console.log("Database location: "+databaseLocation);

    //clear filename
    var databaseAsString = await fs.promises.readFile(databaseLocation, {encoding: "utf8"});
    var newDatabaseString = databaseAsString.replace(databaseLocation, 'database.json');
    await fs.promises.writeFile(databaseLocation, newDatabaseString, 'utf8');
  }
}

module.exports = Builder;
