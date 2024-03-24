#!/usr/bin/env node
const path = require('path');
const Publisher = require("./Publisher.js");
const Builder = require("./Builder.js");
const Server = require("./Server.js");
const { Command } = require('commander');
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

    console.log("Arguments", options)

    if (typeof options.new_site !== 'undefined') {
        console.log("create new site")
    } else if (options.start === true || options.publish === true) {
        var port = process.env.PORT || 2708;

        var projectBaseLocation = process.env.INIT_CWD;
        var siteFolderName = process.env.PODCAST_JS_SITE_FOLDER_NAME || "site";
        var themeLocation;
        var markdownFolderAbsoluteLocation = path.join(projectBaseLocation, "posts")
        var siteFolderLocation = path.join(projectBaseLocation, siteFolderName)

        try {
          await fs.promises.access(path.join(projectBaseLocation, "theme"), fs.constants.F_OK)     
          themeLocation = path.join(projectBaseLocation, "theme");
        } catch (e) {
          //external theme folder was not found. Default will be used
          themeLocation = path.join(__dirname,"..","..","..", "theme");
        }

        var databaseLocation = path.join(themeLocation, "database.json")

        console.log("Folders", {projectBaseLocation,markdownFolderAbsoluteLocation, siteFolderLocation, themeLocation, databaseLocation})

        //move all to site folder
        var publisher = new Publisher();
        await publisher.start(themeLocation, siteFolderLocation);

        var builder = new Builder();
        await builder.start(projectBaseLocation, markdownFolderAbsoluteLocation, databaseLocation, siteFolderLocation, themeLocation);

        if (options.start === true) {
            var server = new Server();
            await server.start(port, siteFolderLocation);
        }
    }

})();