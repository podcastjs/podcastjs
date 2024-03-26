#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const Publisher = require("./Publisher.js");
const Builder = require("./Builder.js");
const Server = require("./Server.js");
const ExternalSite = require("./ExternalSite.js");
const { Command } = require('commander');
const finder = require('find-package-json');
const program = new Command();

(async () => {

    program
        .name('podcastjs')
        .description('static site generator for podcasters')
        .version('1.0.0');

    program
        .option('--new-site, --new-site <string>', 'Create a new podcastjs site')
        .option('--s, --start', 'start a local dev server')
        .option('--p, --publish', 'parse and publish the static web to the configured folder')

    program.parse();
    const options = program.opts();

    console.log("Shell arguments", options)

    var f = finder(__filename);
    var frameworkLocation = path.dirname(f.next().filename);

    if (typeof options.newSite !== 'undefined') {
        console.log("create new site")
        var externalSite = new ExternalSite();
        await externalSite.start(options.newSite, process.cwd(), frameworkLocation);
    } else if (options.start === true || options.publish === true) {
        var port = process.env.PORT || 2708;

        var projectBaseLocation = process.cwd();
        var siteFolderName = process.env.PODCAST_JS_SITE_FOLDER_NAME || "site";
        var themeLocation;
        var markdownFolderAbsoluteLocation = path.join(projectBaseLocation, "posts")
        var siteFolderLocation = path.join(projectBaseLocation, siteFolderName)

        try {
            await fs.promises.access(path.join(projectBaseLocation, "theme"), fs.constants.F_OK)
            themeLocation = path.join(projectBaseLocation, "theme");
        } catch (e) {
            //external theme folder was not found. Default will be used
            themeLocation = path.join(__dirname, "..", "..", "..", "theme");
        }

        if (options.start === true) {

            if (frameworkLocation === projectBaseLocation) {

                var databaseLocation = path.join(themeLocation, "database.json")
                console.log("Folders", { projectBaseLocation, markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation })
                
                //it is runing from inside of framework    
                var publisher = new Publisher();
                await publisher.start(themeLocation, siteFolderLocation);

                var builder = new Builder();
                await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);

                var server = new Server();
                await server.start(port, siteFolderLocation);
            } else {
                //it is runing from outside of framework
                console.log("Starting local server")

                var databaseLocation = path.join(siteFolderLocation, "database.json")
                console.log("Folders", { projectBaseLocation, markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation })

                var publisher = new Publisher();
                await publisher.start(themeLocation, siteFolderLocation);

                var builder = new Builder();
                await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);

                var server = new Server();
                var expressInstance = await server.start(port, siteFolderLocation);
                var watching = false;
                fs.watch(projectBaseLocation,{ recursive: true },  async function (eventType, filename) {
                    if (eventType !== 'change') return
                    if(filename && filename.startsWith("site")) return;
                    console.log("\nRebuilding")
                    await publisher.start(themeLocation, siteFolderLocation);
                    await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);
                });
            }
        }
    }

})();