#!/usr/bin/env node
// const Server = require("./Server.js");
// const Publisher = require("./Publisher.js");
const Builder = require("./Builder.js");
const { Command } = require('commander');
const program = new Command();

var options;

if(process.env.mode=="start"){
  options = {
    mode:"start"
  }
}else{

  program
  .name('podcast')
  .description('static site generator for podcasters')
  .version('1.0.0');

  program
  .requiredOption('-m, --mode <string>', 'start,publish,build')
  .option('-l, --logo <string>', 'a jpg or png, local file')
  program.parse();
  options = program.opts();
}

if(options.mode === 'start'){
  var server = new Server();
  server.start()
}else if(options.mode === 'build'){
  var builder= new Builder();
  var projectBaseLocation = process.env.INIT_CWD;
  var markdownFolderName = process.env.MARKDOWN_FOLDER_NAME ||  "posts";  
  builder.start(projectBaseLocation, markdownFolderName);
}else if(options.mode === 'publish'){
  var publisher= new Publisher();
  publisher.start();
}else{
  console.log("Podcast does not support this argument: "+options.mode);
}