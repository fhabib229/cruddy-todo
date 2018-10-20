const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express');
const app = express();

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  app.post('/data', (req, res, next) => {
    var id = counter.getNextUniqueId();
    fs.writeFile(`${id}.txt`, text, (err) => {
      if(err) {
        throw err;
      } else {
        res.send('File Written!');
        callback(null, { id, text });
      }
    });
    next();
  })
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
  _.each(items, (text, id) => {
    data.push({ id, text });
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
