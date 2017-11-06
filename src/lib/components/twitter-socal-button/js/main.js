"use strict";
/**
  * Copyright 2016 Benjamin Blais
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. 
  */
((window, document, undefined) =>
{
    //Importing document
    var thatDoc = document;

    //Actual document
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class TwitterSocalButton extends SocalButton
    {

      constructor()
      {
        super();
      }

      createdCallback()
      {
        this._spanChild = thatDoc.createElement("span");
        this._spanChild.setAttribute("class", "socalImage");
        this.appendChild(this._spanChild);
        var shadowRoot = this._spanChild.createShadowRoot();
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);

        //Done, call the super
        super.createdCallback();
      }

      get handle()
      {
        return "@" + super.handle;
      }

      get baseHandle()
      {
        return super.handle;
      }

      get url()
      {
        return "http://twitter.com/" + this.baseHandle;
      }
    }


    window.TwitterSocalButton = thatDoc.registerElement("twitter-socal-button", TwitterSocalButton);
})(window, document);