/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
"use strict";
var fs = require('fs');
var path = require('path');
var htmlTemplatize = require('./htmlTemplatize');

fs.mkdirParentSync = function(dirPath, mode)
{
  //Try to find parent dir
  try
  {
    fs.mkdirSync(dirPath, mode);
  }
  catch(error)
  {
    if(error.errno && error.errno === 'ENOENT')
    {
      //Attempt to make parent folder(s)
      fs.mkdirParentSync(path.dirname(dirPath), mode);
      fs.mkdirParentSync(dirPath, mode);
    }
    else
    {
      //Rethrow error if not because dir doesn't exist
      throw error;
    }
  }

  //Parents are made, make the child
  fs.mkdirSync(dirPath, mode);
};

var partialList = [];

var outList = [];

//Start by getting the template
if(process.argv.length > 2)
  var templateArg = process.argv[2];

if(process.argv.length > 3)
  var partialPath = process.argv[3];

if(process.argv.length > 4)
  var outputDirArg = process.argv[4];

//Handle this as a stack
let stack = [partialPath];

//Get all the children of the directory itteratively
while(stack.length > 0)
{
  let value = stack.pop();

  //Check for directory
  let info = fs.lstatSync(value);

  if(info.isFile())
  {
    console.log(value);
    partialList.push(value);
  }
  else
  {
    //Get the children and add them to the stack
    let children  = fs.readdirSync(value, "UTF-8");

    for(let index in children)
    {
      let child = children[index]
      let fullPath = value + path.sep + child;
      stack.push(fullPath);
    }
  }
}



//Create the output dirs
for(let index = 0; index < partialList.length; ++index)
{
  let outputValue = partialList[index].replace(partialPath, outputDirArg);

  outList[index] = outputValue;

  //Make the dir, catching 
  console.log(path.dirname(outputValue));
  try
  {
    fs.mkdirParentSync(path.dirname(outputValue));
  }
  catch(error)
  {
    if(error.code !== 'EEXIST')
    {
      throw error;
    }
  }
}

((template, partials, output) => {
  htmlTemplatize.templatize(template, partials, output);
})(templateArg, partialList, outList);