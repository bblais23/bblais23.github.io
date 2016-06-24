"use strict";
/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
((window, document, registryName, undefined) => {

  let activeView = null;

  let pendingUpdate = null;

  let switchingPromise = Proise.resolve();


  /**
   * Finds and the regular expression that provides a positive match for the item
   * in the array of regular expressions provided.
   * item - Item to be tested against regular expressions
   * arrayOfRegex - an array containing regular expressions or string representing
   *                regular expressions.
   * Returns: The first regular expression in the array that matches the provided
   *          item. Note if the 'regular expression' was a string it will be 
   *          converted into a regular expression.
   */
  window.findMatchingRegex(item, arrayOfRegex)
  {
    for(let regex of arrayOfRegex)
    {
      if(regex.test && regex.test(item))
      {
        return regex;
      }
      else if( (new RegEx(regex)).test(item))
      {
        return new RegEx(regex);
      }
      else if(regex === item)
      {
        return regex;
      }
    }
    return undefined;
  }

  var findActiveView = function(registry)
  {
    for(let key in registry)
    {
      let item = registry[key];
      if(item && item.active)
      {
        return item;
      }
    }
  }

  window.refreshEventListeners = function() {
    //First get the router registry and ensure it exists

    let registry = window[registryName] || {};
    window[registryName] = registry;

    //Get all local anchors
    let linksToCheck = document.querySelectorAll('body /deep/ a:not([href^="http"])');
    let registryKeys = Object.keys(registry);

    //Find out what the active view is 
    if(activeView === null)
    {
      activeView = findActiveView(registry);
    }

    for(let anchor of linksToCheck)
    {
      //Find the regex for this anchor
      let matchingRegex = findMatchingRegex(anchor.getAttribute("href"), registryKeys);

      //Only attach the event listener if the registry regex
      if(matchingRegex)
      {
        //Get the view we need to perform the action on
        let matchingView = registry[matchingRegex.toString()];

        //Add event listener to this item for this regular expression
        ((url, view) => {
          anchor.addEventListener('click', (e) => {
            //Prevent the page from forwarding events
            e.preventDefault();

            //Same person just update
            if(activeView === view)
            {
              view.update(view, url);
            }

            //This is where things get tricky....
            else
            {
              //Ok so we should update the view
              view.update(activeView)

              //Then handle deactivating the old view
              .then((view) =>{
                activeView.makeInactive(view).

                //Then make this view the active one
                then((oldView) => {
                  activeView = view;

                  view.makeActive().

                  //We done son
                  then( (view) => {
                    //I should probably do something here
                  });
                });
              })
            }

          }

        })(anchor.getAttribute("href"), matchingView);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', refreshEventListeners);
})(window, document, "_routerRegistry");