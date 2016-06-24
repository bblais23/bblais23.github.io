"use strict";
/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */

((window, document, undefined) => {

  class RouteView extends HTMLElement
  {
    _accessMap()
    {
      return RouteView._routeMap;
    }

    _createRoute(route, element)
    {
      const routeMap = this._accessMap();

      routeMap.set(route, element);

      console.log(`Added route ${route.toString()} to element`);
    }

    createdCallback()
    {
      this._createRoute(this.routePatern, this);

      //Set this as the active view ifi it is
      if(this.active)
      {
        RouteView._setActiveView(this);
        this._lastPath = window.location.toString();
        console.log(`last location: ${this._lastPath}`);
      }
    }

    loadView(executeResult)
    {
      return Promise.resolve(this).then( view => {

        return new Promise((resolve, reject) => {
          //First generate a string
          const partialPath = executeResult[0].replace(executeResult.input, "partials/" + executeResult.input);
          console.log(`ajax path: ${partialPath}`);

          const request = new XMLHttpRequest();

          //Request the partial
          request.open('GET', partialPath, true);

          request.onload = _ => {
            if(request.status >= 200 && request.status < 400)
            {
              //Get the content and set the view with it
              view.innerHTML = request.response;
              resolve(view);
            }
            else
            {
              reject(request);
            }
          };

          request.onerror = error => {
            reject(error);
          };

          request.send();
        });
      }).then(view => {
        //Only change the view on success
        view._lastPath = executeResult[0];
        view._setLoaded(true);
        return view;
      });
    }

    //General functions
    update(arg1, ignoreHistory)
    {
      const view = this;
      return new Promise((resolve, reject) =>{
        let executeResult;
        if(arg1 instanceof Array)
        {
          executeResult = arg1;
        }
        else
        {
          //This must be a string since it is not an array
          executeResult = view.routePatern.exec(arg1);
        }

        if(!view.loaded || view._lastPath !== executeResult[0])
        {
          //Make refresh call here, getting the page content
          view.loadView(executeResult).then((arg) => {
            if(!ignoreHistory)
            {
              window.history.pushState(null, null, executeResult[0]);
            }
            resolve(arg);
          });
        }
        else
        {
          if(!ignoreHistory)
          {
            window.history.pushState(null, null, executeResult[0]);
          }
          resolve(view);
        }
      });
    }

    in(data)
    {
      return this._transitionHandle(data, true);
    }

    out(data)
    {
      //Override
      return this._transitionHandle(data, false);
    }

    _transitionHandle(data, enable)
    {
      const nextView = this;

      return new Promise( (resolve, reject) => {
        const handleTransition = _ => {
          nextView.removeEventListener('transitionend', handleTransition);
          resolve(data);
        };
        nextView.addEventListener('transitionend', handleTransition);
        nextView._setActive(enable);
        //handleTransition(); //TODO stub code
      });
    }

    _makeActive(data)
    {
      //first get the curentView
      const currentView = RouteView.FindActiveView();
      const nextView = this;

      //Diable the active view
      return currentView.out(data).then( data => {

        //View is disabled set the next view to be the active one
        RouteView._setActiveView(nextView);

        //Transition the new view in
        return nextView.in(data);
      });
    }

    handleViewSwitch(executeResult)
    {
      RouteView.switchToView(this, executeResult);
    }

    _setActive(toset)
    {
      if(toset)
      {
        this.classList.remove('closed');
      }
      else
      {
        this.classList.add('closed');
      }
    }

    _setLoaded(toset)
    {
      if(toset)
      {
        this.classList.add("loaded");
      }
      else
      {
        this.classList.remove("loaded");
      }
    }

    //Getters
    get routePatern()
    {
      //Add the 'starts with' specifyer and handle case where it has a leading slash
      return new RegExp( "^" + this.getAttribute('href') + "$");
    }

    get active()
    {
      return !this.classList.contains('closed');
    }

    get loaded()
    {
      return this.classList.contains('loaded');
    }

    get lastPath()
    {
      return this._lastPath;
    }

    //Static methods
    static FindActiveView()
    {
      return RouteView._activeView;
    }

    static _setActiveView(view)
    {
      RouteView._activeView = view;
    }

    static go(url, ignoreHistory)
    {
      const shortUrl = url.replace(/^(?:\/\/|[^\/]+)*\//, "").replace(/^\//, "");
      const routeMap = RouteView._routeMap;
      //Get the regex
      const matchingRegex = RouteView._findMatchingRegex(shortUrl, routeMap.keys());

      const matchingView = routeMap.get(matchingRegex);

      const executeResult = matchingRegex.exec(shortUrl);

      executeResult[0] = url;

      //Call switch to view
      RouteView.switchToView(matchingView, executeResult, ignoreHistory);
    }

    static switchToView(view, executeResult, ignoreHistory)
    {
      //The update should always be called
      let updatePromise = view.update(executeResult, ignoreHistory);

      //We don't transition if the view is active.
      if(!view.active)
      {
        let nextView = RouteView._getNextView();

        //If we are transitioning, set us to be the next view
        RouteView._setNextView(view);

        //If the next view is not set then the current promise is resolved,
        // (and it doesn't mater even if it isn't)
        if(!nextView)
        {
          RouteView._setNextView(view);
          RouteView._setCurrentPromise(updatePromise.then( data => {

            //Need to find way to get correct data to handler
            return RouteView._getNextView()._makeActive();
          }).then( data => {

            //next view is active and this promise is resolved
            RouteView._setNextView(null);
            return null;
          }).catch( err => {

            //Callbacks failed just allow another view to transition if need be
            RouteView._setNextView(null);
            return null;
          }));
        }
      }
    }

    static _getNextView()
    {
      return RouteView._nextView;
    }

    static _setNextView(nextView)
    {
      RouteView._nextView = nextView;
    }

    static _getCurentPromise()
    {
      return RouteView._executingPromise;
    }

    static _setCurrentPromise(promise)
    {
      RouteView._executingPromise = promise;
    }

    static _createAnchorEventHandler(executeResult, view)
    {
      return (e) => 
      {
        e.preventDefault();
        console.log(`Routing to ${executeResult[0]}`);
        view.handleViewSwitch(executeResult);
      };
    }

    static _findMatchingRegex(item, arrayOfRegex)
    {
      let regexes = Array.from(arrayOfRegex);

      return regexes.find( r => r.test(item));
    }

    static _initAnchors(anchorList)
    {
      const registry = RouteView._routeMap;
      const linksToCheck = document.querySelectorAll('body /deep/ a:not([href^="http"])');

      for(let anchor of linksToCheck)
      {
        let anchorHref = anchor.getAttribute('href');
        console.log(`Found anchor ${anchorHref}`);
        let matchingRegex = RouteView._findMatchingRegex(anchorHref, registry.keys());

        //We match, attach an event handler
        if(matchingRegex)
        {
          console.log(`Matched regex ${matchingRegex.toString()}`);
          //Get the view
          let matchingView = registry.get(matchingRegex);

          //We already know the anchor and we already know the regex, just pre-execute
          let executeResult = matchingRegex.exec(anchorHref);

          //Replace the first one with the full path
          executeResult[0] = anchor.href;

          //Create an event handle for the anchor
          anchor.addEventListener('click', RouteView._createAnchorEventHandler(executeResult, matchingView));
        }
      }
    }
  };

  //Initalize the public members
  RouteView._executingPromise = Promise.resolve(RouteView.FindActiveView());

  RouteView._routeMap = new Map();

  window.RouteView = document.registerElement('route-view', RouteView);

    //Attach the static method to the new element
  document.addEventListener('DOMContentLoaded', RouteView._initAnchors);

  window.onpopstate = event => {

    //Tell the router to go
    RouteView.go(window.location.toString(), true);
  };
})(window, document);