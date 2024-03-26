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
        .option('--p, --publish <string>', 'parse and publish the static web to the configured folder', "site")

    program.parse();
    const options = program.opts();

    console.log("Shell arguments", options)

    var f = finder(__filename);
    var frameworkLocation = path.dirname(f.next().filename);

    if (typeof options.newSite !== 'undefined') {
        console.log("create new site")
        var externalSite = new ExternalSite();
        await externalSite.start(options.newSite, process.cwd(), frameworkLocation);
    } else if (options.start === true || typeof options.publish !== 'undefined') {
        var port = process.env.PORT || 2708;

        var projectBaseLocation = process.cwd();
        var siteFolderName = options.publish;
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

        if (frameworkLocation === projectBaseLocation) {
            //it is runing from inside of framework    
            var databaseLocation = path.join(themeLocation, "database.json")
            console.log("Folders", { projectBaseLocation, markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation })

            var publisher = new Publisher();
            await publisher.start(themeLocation, siteFolderLocation);

            var builder = new Builder();
            await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);

            if (options.start === true) {
                var server = new Server();
                await server.start(port, siteFolderLocation);
            }             
        } else {
            //it is runing from outside of framework
            console.log("Starting local server")

            var databaseLocation = path.join(siteFolderLocation, "database.json")
            console.log("Folders", { projectBaseLocation, markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation })

            var publisher = new Publisher();
            await publisher.start(themeLocation, siteFolderLocation);

            var builder = new Builder();
            await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);

            if (options.start === true) {
                var server = new Server();
                var expressInstance = await server.start(port, siteFolderLocation);
    
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
        }
    }

})();