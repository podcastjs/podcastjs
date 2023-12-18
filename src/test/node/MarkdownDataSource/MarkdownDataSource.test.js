const chai = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const expect = chai.expect;
const assert = chai.assert;
const MarkdownDataSource = require("../../../main/node/MarkdownDataSource.js");

describe('Builder', function () {

  it('should read all the markdown files', async function () {
    var databaseLocation = path.join(os.tmpdir(), uuidv4()+".json")
    
    var markdownDataSource = new MarkdownDataSource();
    markdownDataSource.setDatabaseLocation(databaseLocation);
    await markdownDataSource.init();
    
    markdownDataSource.setDocumentsBaseDir(path.join(__dirname, "posts"));
    markdownDataSource.excludeFolders(true);
    markdownDataSource.loadDocuments();
    console.log(markdownDataSource.getDocuments().data);
    expect(markdownDataSource.getDocuments().data.length).to.eq(8);
    expect(markdownDataSource.getDocuments().data[0].name).to.eq("contributing.md");
    expect(markdownDataSource.getDocuments().data[1].name).to.eq("installing-docs4All.md");
    expect(markdownDataSource.getDocuments().data[2].name).to.eq("production-notes.md");
    expect(markdownDataSource.getDocuments().data[3].name).to.eq("requirements.md");
    expect(markdownDataSource.getDocuments().data[4].name).to.eq("markdown-sample.md");
    expect(markdownDataSource.getDocuments().data[5].name).to.eq("root.md");
    expect(markdownDataSource.getDocuments().data[6].name).to.eq("showcase.md");
    expect(markdownDataSource.getDocuments().data[7].name).to.eq("customizing-the-template.md");

    //should export  the database
    await markdownDataSource.save();
    await new Promise(r => setTimeout(r, 1000));
    var existDatabase = false;
    const stats = await fs.promises.stat(databaseLocation); 
    assert(stats)
    await markdownDataSource.delete();
    
  });

});
