const rimraf = require("rimraf");
const util = require("util");
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
// const rimrafPromise = util.promisify(rimraf);
//const mkdirPromise = util.promisify(fs.mkdir);
const copyPromise = util.promisify(fsExtra.copy);

function Publisher(){
  var projectBaseLocation = process.env.PWD;
  var siteFolder = process.env.PODCAST_JS_SITE_FOLDER ||"site";

  this.start = async () => {
    console.log("Base location: "+projectBaseLocation);
    var themeLocation = path.join(projectBaseLocation, "theme")

    try {
      await fs.promises.access(themeLocation, fs.constants.F_OK)
      console.log("custom theme folder was found: "+themeLocation);
    } catch (e) {
      console.log("custom theme folder was not found. Default theme will be used");
      themeLocation = path.join(__dirname,"theme")
    }

    var siteFullLocation = path.join(projectBaseLocation, siteFolder);
    try {
      await fs.promises.access(siteFullLocation, fs.constants.F_OK)
      await fs.promises.rm(siteFullLocation, { recursive: true });
    } catch (e) {
      console.log("custom theme folder was not found. Default theme will be used");
    }    

    
    await fs.promises.mkdir(path.join(projectBaseLocation, siteFolder))
    await copyPromise(themeLocation, path.join(projectBaseLocation, siteFolder))

  }
}

module.exports = Publisher;
