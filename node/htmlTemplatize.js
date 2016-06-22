/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
"use strict";
var fs = require('fs');
var path = require('path');

module.exports = {};

var commandRegex = /\{\{([a-zA-Z0-9\.\s]*)(\([a-zA-Z0-9\\\/\-\.\s,]*\))?\}\}/g;

var internalConfig = {};

var internalCommands = {};

internalConfig.encoding = 'UTF-8';


var copyContext = function(context)
{
  var ret = {};
  var prop;
  for(prop in context)
  {
    ret[prop] = context[prop];
  }

  return ret;
}

internalCommands.body = function(context)
{
  if(!context.partial)
  {
    throw "Body can only be called in the template";
  }

  let bodyText = context.partial;

  let contextPartial = {};
  contextPartial.template = bodyText;
  contextPartial.templatePath = context.partialPath;
  contextPartial.parial = undefined;
  return templatizeInternal(contextPartial);
}

internalCommands.generateBase = function(context)
{
  //TODO For now only support in templates
  if(!context.partial)
  {
    throw "generateBase can only be called in the template";
  }

  //Get the out path
  let outputPath = path.dirname(path.normalize(context.outputPath));
  console.log(outputPath);

  //Get the output base
  let outputBase = path.normalize(context.outputBase);

  //Create the relative path and make sure the path is html friendly.
  let resultBase = path.relative(outputPath, outputBase);
  resultBase = resultBase.replace(/\\/g, "/");
  resultBase = resultBase.length > 0 ? resultBase + "/" : resultBase;

  return resultBase;

}

internalCommands.include = function(context, args)
{
  var templatePath = '',
      includePath,
      includeContent;
  //There should be only one argument, if less just return
  if(args.length < 1)
  {
    return null;
  }

  includePath = args[0].trim();
  //Try to find the directory
  if(context.templatePath)
  {
    //Get dir pathname
    templatePath = path.dirname(context.templatePath);
  }

  //If this is not a full path then append the path to the templatePath
  if(!/^([A-Za-z]:)?[\\\/]/.test(includePath))
  {
    includePath = templatePath + "/" + includePath;
  }

  //Read in the file (assume utf-8 encoding because FUCK EVERYTHING!)
  includeContent = fs.readFileSync(includePath, {encoding : internalConfig.encoding});

  //Templateize include content
  let includeContext = {};
  includeContext.template = includeContent;
  includeContext.templatePath = includePath;

  includeContent = templatizeInternal(includeContext);

  return includeContent;
};

//Both are strings, can do file reading later
var templatizeInternal = function(context) 
{
  var template = context.template;
  //Simple function handling the find and replace
  var result = template.replace(commandRegex, function(match, command, argumentList)
  {
    var args = [];
    //get the argument list
    if(argumentList && argumentList.length > 2)
    {
      args = argumentList.substring(1,argumentList.length-1).split(',');
    }

    if(internalCommands[command])
    {
      return internalCommands[command](context, args);
    }
    return match;
  });

  return result;
};

module.exports.templatize = function(arg1, arg2, output, contextArg){
  //First check to see if we are dealing with text or a path
  var context = contextArg || {};
  var partials;

  //Only run this function if both arguments are present.
  if(!arg1 || !arg2 || !output)
  {
    throw "You must include all three arguments in this function call.";
  }

  context.template = fs.readFileSync(arg1, {encoding : internalConfig.encoding});
  context.templatePath = arg1;

  //Now handle the partial(s)
  if(arg2.constructor === Array)
  {
    partials = arg2;
  }
  else
  {
    partials = [arg2];
  }

  //Loop through the partials
  partials.forEach(function(partial, index){
    var ctx = copyContext(context);
    ctx.partialPath = partial;
    if(output.constructor === Array)
    {
      ctx.outputPath = output[index];
    }
    else
    {
      ctx.outputPath = path.normalize(output + path.sep + path.basename(partial));
    }

    ((ctx_internal) => {
      fs.readFile(ctx_internal.partialPath, {encoding: internalConfig.encoding}, (err, data) =>{
        if(err)
        {
          console.error("Could not read parial file: " + ctx_internal.partialPath);
        }
        else
        {
          let outPath = ctx_internal.outputPath;
          ctx_internal.partial = data;
          let output = templatizeInternal(ctx_internal);

          fs.writeFile(outPath, output, {encoding : internalConfig.encoding}, (err) => {
            if(err) console.error("Could not write to file: " + outPath);
          });
        }
      });
    })(ctx);
  });
};