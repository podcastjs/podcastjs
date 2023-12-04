var chai = require('chai');
var path = require('path');
var os = require('os');
var expect = chai.expect;
var assert = chai.assert;
const MarkdownDataSource = require("../../../main/node/MarkdownDataSource.js");

describe('Builder', function () {

  it('should read all the markdown files and sort by date', async function () {
    var markdownDataSource = new MarkdownDataSource();
    markdownDataSource.setDatabaseLocation(path.join(os.tmpdir(),"database.json"));
    await markdownDataSource.init();
    markdownDataSource.setDocumentsBaseDir(path.join(__dirname, "posts"));
    markdownDataSource.excludeFolders(true);
    markdownDataSource.loadDocuments();
    await markdownDataSource.save();
    console.log(markdownDataSource.getDocuments().data);
    console.log(markdownDataSource.getDocuments().data.map(item => {
      const container = {};
      container["path"] = item.path;
      return container;
    }))
  });

});
