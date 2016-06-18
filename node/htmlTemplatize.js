/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
var fs = require('fs');

module.exports = {};

var commandRegex = /\{\{([a-zA-Z0-9\.\s]*)\}\}/g;

var internalCommands = {}

internalCommands.body = function(context)
{
  return context.partial;
}

//Both are strings, can do file reading later
module.exports.templatize = function(template, partial, context) 
{
  //Define the context (passed into internal commands)
  context = context || {};

  context.template = template;
  context.partial = partial;

  //Simple function handling the find and replace
  //TODO add arguments
  var result = template.replace(commandRegex, function(match, command, argumentList)
  {
    var args = [];
    //get the argument list
    if(argumentList.length > 2)
    {
      args = argumentList.substring(1,argumentList.length).split(,);
    }

    if(internalCommands[command])
    {
      return internalCommands[command](context, args);
    }
    return match;
  });

  return result;
};