/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */

//Start by getting the template
if(process.argv.length > 1)
  var templateArg = process.argv[1];

if(process.argv.length > 2)
  var viewsDirArg = process.argv[2];

if(process.argv.length > 3)
  var partialsDirArg = process.argv[3];

((template, views, partials) => {

})(templateArg, viewsDirArg, partialsDirArg);