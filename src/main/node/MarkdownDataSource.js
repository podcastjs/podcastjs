const fs = require('fs');
const loki = require('lokijs');
const yaml = require('js-yaml');

function MarkdownDataSource() {

  this.documentsBaseDir;
  this.databaseLocation;
  this.shouldExcludeFolders = false;
  this.excludeFoldersList = [];
  var excludeRootDirInPath = true;
  var sequence = 0;
  

  this.init = async () => {
    this.database = new loki(this.databaseLocation);
    this.documents = this.database.addCollection('documents');
  };

  this.getDocuments = () => {
    return this.database.getCollection('documents');
  };

  this.save = async () => {
    this.database.saveDatabase(this.databaseLocation);
  };

  this.delete = async () => {
    this.database.deleteDatabase(this.databaseLocation);
  };

  this.setDocumentsBaseDir = (documentsBaseDir) => {
    return this.documentsBaseDir = documentsBaseDir;
  };

  this.setDatabaseLocation = (databaseLocation) => {
    return this.databaseLocation = databaseLocation;
  };

  this.excludeFolders = (excludeFoldersValue) => {
    return this.shouldExcludeFolders = excludeFoldersValue;
  };

  this.excludedList = (excludeFoldersList) => {
    return this.excludeFoldersList = excludeFoldersList;
  };  

  this.getDocumentsBaseDir = () => {
    return this.documentsBaseDir;
  };

  //@todo: should fail on mandatory fields like datetime
  this.loadDocuments = (dir, parent) => {
    if(typeof dir === 'undefined') dir = this.getDocumentsBaseDir();
    if (dir[dir.length - 1] != '/') dir = dir.concat('/')

    var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (fs.statSync(dir + file).isDirectory()) {
        //@todo : bla ck list folders
        let id = this.next();
        if(this.shouldExcludeFolders === false){
          let meta = this.getMetaForDirectoryIfExist(dir + file);
          this.getDocuments().insert({
            ...{
              "path": this.getFixedPath(this.getDocumentsBaseDir(), dir + file),
              "id": id,
              "parent": parent,
              "name": file,
              "text": this.getMarkdownContentIfExist(dir + file + "/index.md"),
              "type": "node"
            },
            ...meta
          });
        }

        this.loadDocuments(dir + file + '/', id);
      } else {

        if (file != "index.md" && file.endsWith(".md")) {
          let id = this.next();
          let meta = this.getMetaForMarkdownIfExist(dir + file);      
          this.getDocuments().insert({
            ...{
              "path": this.getFixedPath(this.getDocumentsBaseDir(), dir + file),
              "id": id,
              "parent": parent,
              "type": "child",
              "text": this.getMarkdownContentIfExist(dir + file),
              "name": file,
            },
            ...meta
          });
        }
      }
    });
  };

  //todo: delete meta and skip content
  this.findAllDeprecated = () => {
    var resources = this.getDocuments();
    return resources.chain().data({
      removeMeta: true
    });
  }

  this.findAll = (filterColumns) => {
    var resources = this.getDocuments();
    if (typeof filterColumns === 'undefined' || typeof filterColumns.length === 'undefined') {
      return resources.data;
    }
    const records = []
    for (_doc of resources.data) {
      let doc = Object.assign({}, _doc);
      for (column of filterColumns) {
        delete doc[column];
      }
      records.push(doc);
    }

    return records;
  }

  this.findByPaths = (filterColumns, paths) => {
    var resources = this.getDocuments();
    if (typeof filterColumns === 'undefined' || typeof filterColumns.length === 'undefined') {
      return resources.data;
    }
    const records = []
    for (_doc of resources.data) {
      var count = 0;
      for (path of paths) {
        if (path.startsWith(_doc.path)) {
          count++;
          break;
        }
      }
      //this path is not contained in the provided set
      if (count == 0) {
        continue;
      }

      let doc = Object.assign({}, _doc);
      for (column of filterColumns) {
        delete doc[column];
      }
      records.push(doc);
    }

    return records;
  }

  this.findByAudienceTarget = (targetAudience) => {
    var resources = this.getDocuments();
    var results = resources.find({
      $and: [{
        'targetAudience': targetAudience
      }]
    });

    return results;
  }

  this.findDocumentByAndRestrictions = (queryCollection, filterColumns) => {

    var resources = this.getDocuments();
    var results = resources.find({
      $and: queryCollection
    });
    if (typeof filterColumns === 'undefined' || typeof filterColumns.length === 'undefined') {
      return results;
    }

    const records = [];
    for (_doc of results) {
      let doc = Object.assign({}, _doc);
      for (column of filterColumns) {
        delete doc[column];
      }
      records.push(doc);
    }

    return records;
  }

  this.getTreeMenuByAudienceTargetType = (audienceTargetType) => {
    var resources = this.getDocuments();
    var results = resources.find({
      $and: [{
        'targetAudience': audienceTargetType
      }]
    });

    var treeMenu = {};
    results.forEach((menuItem) => {
      this.createInnerMenuFromSimplePaths(menuItem.path, treeMenu, null, resources);
    });
    return treeMenu;
  }

  this.searchByContent = (audienceTargetType, contentPart) => {
    var resources = this.getDocuments();
    var results = resources.find({
      $and: [{
          'targetAudience': audienceTargetType
        },
        {
          'content': {
            '$contains': contentPart
          }
        }
      ]
    });

    var foundResources = [];
    results.forEach(function(foundResource) {
      let modifiedResource = {
        ...foundResource
      }
      delete modifiedResource.meta
      delete modifiedResource.$loki
      delete modifiedResource.content
      foundResources.push(modifiedResource);
    });

    return foundResources;
  }


  this.getFixedPath = (baseDir, absolutePath) => {
    return (excludeRootDirInPath === true) ? absolutePath.replace(baseDir, "") : absolutePath
  }

  this.getMarkdownContentIfExist = (absolutePath) => {
    try {
      if (fs.existsSync(absolutePath)) {
        var contents = fs.readFileSync(absolutePath, 'utf8');
        return contents.replace(/^<!--[\s\S]*?-->/g, "");
      }
    } catch (e) {
      console.log(`meta has an error :${file}, ${e}`);
      return;
    }
  }

  this.getMetaForDirectoryIfExist = (file) => {
    try {
      if (fs.existsSync(file + "/meta.json")) {
        var contents = fs.readFileSync(file + "/meta.json", 'utf8');
        return JSON.parse(contents);
      }
    } catch (e) {
      console.log(`meta has an error :${file}, ${e}`);
      return;
    }
  }

  this.getMetaForDirectoryIfExist = (file) => {
    try {
      if (fs.existsSync(file + "/meta.json")) {
        var contents = fs.readFileSync(file + "/meta.json", 'utf8');
        return JSON.parse(contents);
      }
    } catch (e) {
      console.log(`meta has an error :${file}, ${e}`);
      return;
    }
  }

  this.getMetaForMarkdownIfExist = (file) => {
    try {
      var contents = fs.readFileSync(file, 'utf8');
      const regex = /^<!--[\s\S]*?-->/g;
      var found = contents.match(regex);
      if (typeof found !== 'undefined' && found != null) {
        var rawString = found[0].replace("<!--", "").replace("-->", "").trim();
        return yaml.load(rawString);
      }
    } catch (e) {
      console.log(`meta has an error :${file}, ${e}`);
      return;
    }
  }

  this.getMetaForMarkdownIfExistDeprecated = (file) => {
    try {
      var contents = fs.readFileSync(file, 'utf8');
      const regex = /^<!--[\s\S]*?-->/g;
      var found = contents.match(regex);
      if (typeof found !== 'undefined' && found != null) {
        var yamlString = found[0].replace("<!--", "").replace("-->", "")
        console.log(yamlString)
        console.log(yaml.load(yamlString))
        return yaml.load(yamlString)[0];
      }
    } catch (e) {
      console.log(`meta has an error :${file}, ${e}`);
      return;
    }
  }

  this.next = () => {
    if (!sequence) {
      sequence = 0;
    }
    return sequence++;
  }

  this.createInnerMenuFromSimplePaths = (path, parentNode, parentPath, collection) => {

    var nodes = path.substring(1).split("/");
    var thisPath = this.getEntirePath(0, nodes);
    var absolutePath = (parentPath) ? parentPath + thisPath : thisPath
    if (typeof parentNode[absolutePath] === 'undefined') {
      var data = collection
        .find({
          'path': absolutePath
        });

      var resource = {
        ...data[0]
      }
      delete resource.path
      delete resource.meta
      delete resource.$loki
      delete resource.content

      resource.children = {}
      parentNode[absolutePath] = resource;
    }
    var childPath = this.getNextPath(0, nodes);
    if (childPath.length > 0) {
      return this.createInnerMenuFromSimplePaths(childPath, parentNode[absolutePath].children, absolutePath, collection);
    } else {
      return parentNode;
    }
  }

  this.getEntirePath = (index, nodes) => {
    var entirePath = "";
    for (var a = 0; a < index + 1; a++) {
      entirePath += "/" + nodes[a];
    }
    return entirePath;
  }

  this.getNextPath = (index, nodes) => {
    var nextPath = "";
    for (var a = index + 1; a < nodes.length; a++) {
      nextPath += "/" + nodes[a];
    }
    return nextPath;
  }

}

module.exports = MarkdownDataSource;
