const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const express = require('express');
const app = express();
const url = require('url');
const Promise = require('bluebird');
const promRead = Promise.promisify(fs.readFile);
const counter = Promise.promisifyAll(require('./counter'));


// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

var create = (text, callback) => {
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
};

exports.createAsync = Promise.promisify(create);

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      throw err;
    } else {
      var data = items.map(item => {
        var newPath = path.join(exports.dataDir, item);
        return promRead(newPath).then(
          (todo) => {
            return {id: item.slice(0, 5), text: todo.toString() };
          });
        });
      Promise.all(data).then(todos => {
        callback(null, todos);
      });
    }
  });
};


var readOne = (id, callback) => {
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

exports.readOneAsync = Promise.promisify(readOne);

var update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text});
        }
      });
    }
  });

};

exports.updateAsync = Promise.promisify(update);

var deleteToDo = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
      console.log('File deleted!');
    }
  });
};

exports.deleteToDoAsync = Promise.promisify(deleteToDo);

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
