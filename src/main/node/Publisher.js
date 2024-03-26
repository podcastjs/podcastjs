const util = require("util");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const copyPromise = util.promisify(fsExtra.copy);

function Publisher(){
  
  this.start = async (themeLocation, siteFolderLocation) => {
    
    var siteFolderExists = false;
    try {
      await fs.promises.access(siteFolderLocation, fs.constants.F_OK)      
      siteFolderExists = true;
    } catch (e) {
      siteFolderExists = false;
    }    

    if(siteFolderExists===true){
      try {
        await fs.promises.rm(siteFolderLocation, { recursive: true });  
        console.log("Success purge: "+siteFolderLocation)
      } catch (e) {
        console.log("Failed to clear the site folder: "+siteFolderLocation);
        console.error(e);
        process.exit(1);
      } 
    }else{
      await fs.promises.mkdir(siteFolderLocation)
    }
        
    await copyPromise(themeLocation, siteFolderLocation)

  }
}

module.exports = Publisher;
