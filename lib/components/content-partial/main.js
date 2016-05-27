"use strict";
((window, document, undefined) =>
{
    var callingDoc = document;
    class ContentPartial extends HTMLElement
    {

      constructor()
      {
        super();
      }

      createdCallback()
      {
        //Load the content
        var fullLocation = this.href;
        fullLocation = this._getAbsolutePath(fullLocation);

        this._getHtml(fullLocation, (function(target, doc){
            return function(data)
            {
                //Grab links so we can use components
                var links = data.querySelectorAll('link');

                //Add all links to the head
                for (var i = 0; i < links.length; i++) 
                {
                  //Clone so we don't mess shit up
                  var linkClone = doc.importNode(links[i], true);
                  doc.head.appendChild(linkClone);
                };

                //Replace node with the template content
                var templateContent = data.querySelector('template').content;
                var clone = doc.importNode(templateContent, true);
                var targetParent = target.parentNode;
                targetParent.replaceChild(clone, target);
            };
        })(this,callingDoc),
        (function(u){
          return function()
          {
            console.error("could not load partial document at: " + u);
          }
        })(fullLocation));
      }

      _getAbsolutePath(relativePath)
      {
          var a = callingDoc.createElement('a');

          //Use hack to get URL
          a.href = relativePath;

          var absolutePath = a.href;

          return absolutePath;
      }

      _getHtml(url, callback, errorCallback)
      {
        var request = new XMLHttpRequest();

        //Use a closure to force evaluation
        request.onload = (function(req, cb, err){
          return function()
          {
            if((req.status >= 200 && req.status < 400) || req.status === 0 )
            {
              cb(req.response);
            }
            else
            {
              err(req);
            }
          };
        })(request, callback, errorCallback);

        request.open("GET", url, true);
        request.responseType = "document";
        request.send();
      }

      get href()
      {
        return this.getAttribute("href");
      }
    }


    window.ContentPartial = callingDoc.registerElement("content-partial", ContentPartial);
})(window, document);