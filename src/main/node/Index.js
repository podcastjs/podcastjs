#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const Publisher = require("./Publisher.js");
const Builder = require("./Builder.js");
const Server = require("./Server.js");
const ExternalSite = require("./ExternalSite.js");
const { Command } = require('commander');
const finder = require('find-package-json');
const chokidar = require('chokidar');

const program = new Command();

(async () => {

    program
        .name('podcastjs')
        .description('static site generator for podcasters')
        .version('1.0.0');

    program
        .option('--new-site, --new-site <string>', 'Create a new podcastjs site')
        .option('--s, --start', 'start a local dev server')
        .option('--p, --publish', 'render all the web assets and move them to the output folder')
        .option('--o, --output <string>', 'folder name to store the web assets. Default is site', "site")

    program.parse();
    const options = program.opts();

    console.log("Shell arguments", options)

    if (typeof options.newSite !== 'undefined') {
        console.log("create new site")
        var externalSite = new ExternalSite();
        await externalSite.start(options.newSite, process.cwd(), frameworkLocation);
    } 

    if (options.start !== true && options.publish !== true){
        console.log("You should use --start or --publish")
        return;
    }

    var f = finder(__filename);
    var frameworkLocation = path.dirname(f.next().filename);
    var projectBaseLocation = process.cwd();

    var siteFolderName = options.output;

    var markdownFolderAbsoluteLocation;
    var siteFolderLocation;
    var themeLocation;

    //calling is from inside of framework
    if (frameworkLocation === projectBaseLocation) {
        markdownFolderAbsoluteLocation = path.join(frameworkLocation, "posts")
        siteFolderLocation = path.join(frameworkLocation, siteFolderName)
        themeLocation = path.join(frameworkLocation, "theme");
    }else{
        markdownFolderAbsoluteLocation = path.join(projectBaseLocation, "posts")
        siteFolderLocation = path.join(projectBaseLocation, siteFolderName)
        try {
            await fs.promises.access(path.join(projectBaseLocation, "theme"), fs.constants.F_OK)
            themeLocation = path.join(projectBaseLocation, "theme");
        } catch (e) {
            //external theme folder was not found. Default will be used
            themeLocation = path.join(__dirname, "..", "..", "..", "theme");
        }        
    }

    var port = process.env.PORT || 2708;    

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
    }
    await fs.promises.mkdir(siteFolderLocation)
    
    var databaseLocation = path.join(siteFolderLocation, "database.json")
    console.log("Folders", { projectBaseLocation, markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation })

    //move from theme to site
    var publisher = new Publisher();
    await publisher.start(themeLocation, siteFolderLocation); 

    var builder = new Builder();
    await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);   
    
    if(options.start===true){
        var server = new Server();
        await server.start(port, siteFolderLocation);

        chokidar
            .watch(projectBaseLocation, { ignoreInitial: true })
            .on('all', async (event, filename) => {
                if (filename && filename.startsWith(siteFolderLocation)) return;

                console.log("Detected change: " + filename)
                console.log("\nRebuilding")
                await publisher.start(themeLocation, siteFolderLocation);
                await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);
            })    
    }

})();