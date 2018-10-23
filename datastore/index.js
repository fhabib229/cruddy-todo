const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express');
const app = express();
const url = require('url');


// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //app.post('./data', (req, res, next) => {
    counter.getNextUniqueId((err, id) => {
      var newPath = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(newPath, text, (err) => {
      if(err) {
        throw err;
      } else {
        // res.send('File Written!');
        callback(null, { id, text });
      }
    });
    });

    //next();
  //});
  /*
    On a post request
      get next unique ID
      create a new file with uniqueID as file name using the fs module, containing only the todo text
      save to the data directory path
  */
  // var id = counter.getNextUniqueId();
  // items[id] = text;
};

exports.readAll = (callback) => {

 var data = [];
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      throw err;
    } else {
      items.forEach(item => {
        data.push({id: item.slice(0, 5), text: (item.slice(0, 5))});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
var filePath = path.join(exports.dataDir, id + '.txt');
fs.readFile(filePath, (err, item) => {
  if (err) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    console.log('item',item.toString(), 'type of', typeof item);
    callback(null, {id: id, text: item.toString()});
  }
})
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
/*
create another path
invoke read file
  write file and pass in path, text, error
*/

  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text});
        }
      })
    }
  })

};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
