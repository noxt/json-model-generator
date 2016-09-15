'use strict';


import fs from 'fs';
import parsePath from 'parse-filepath';


export default class SchemaParser {

  constructor(path) {
    this.parsedJSON = {};
    this._parseAllFiles(path);
  }

  _parseAllFiles(path) {
    fs.accessSync(path);
    let stat = fs.lstatSync(path);
    let filesContent = {};

    if (stat.isDirectory()) {
      getFiles(path)
        .filter((file) => {
          return file.endsWith('.json')
        })
        .forEach((file) => {
          this._parseFile(file);
        });
    } else if (stat.isFile() && path.endsWith('.json')) {
      this._parseFile(path);
    }
  }

  _parseFile(file) {
    var fileName = parsePath(file).name;
    console.log('> Parsing', fileName);

    try {
      var content = fs.readFileSync(file, 'utf8');
      this.parsedJSON[file] = JSON.parse(content);
    } catch (e) {
      console.log('Parsing error: ', e);
    }
  }

}

function getFiles(dir, files) {
  files = files || [];
  var dirFiles = fs.readdirSync(dir);
  for (var fileIndex in dirFiles) {
    var name = dir + '/' + dirFiles[fileIndex];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}