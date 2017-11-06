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

    class ProfileBox extends HTMLElement
    {
      static get observedAttributes()
      {
        return ["src", "title", "subtitle"];
      }
      constructor()
      {
        super();
      }

      createdCallback()
      {
        var shadowRoot = this.createShadowRoot();
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);

        this._content = shadowRoot.querySelector(".profile");
        this._profilePicNode = shadowRoot.querySelector(".profile-picture");
        this._titleNode = shadowRoot.querySelector(".title");
        this._subTitleNode = shadowRoot.querySelector(".subtitle");

        this.attributeChangedCallback();
      }

      attributeChangedCallback()
      {
        //TODO: update everything in the dom
        this._profilePicNode.setAttribute("src", this.src);
        this._titleNode.textContent = this.title;
        this._subTitleNode.textContent = this.subtitle;
      }

      get src()
      {
        return this.getAttribute("src");
      }

      set src(value)
      {
        this.setAttribute("src", value);
      }

      get title()
      {
        return this.getAttribute("title");
      }

      set title(value)
      {
        this.setAttribute("title", value);
      }

      get subtitle()
      {
        return this.getAttribute("subtitle");
      }

      set subtitle(value)
      {
        this.setAttribute("subtitle", value);
      }
    }


    window.ProfileBox = thatDoc.registerElement("profile-box", ProfileBox);
})(window, document);