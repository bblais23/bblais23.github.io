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

    class SocalButton extends HTMLElement
    {

      static get observedAttributes()
      {
        return ["handle"];
      }

      constructor()
      {
        super();
      }

      attributeChangedCallback()
      {
        //Just update all attributes, there are only two of them
        this._socalLinkNode.setAttribute("href", this.url);
        this._socalHandleNode.textContent = this.handle;
      }

      createdCallback()
      {
        var shadowRoot = this.createShadowRoot();
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);

        this._socalLinkNode = shadowRoot.querySelector('.socalLink');
        this._socalImageNode = shadowRoot.querySelector('.socalImage');
        this._socalHandleNode = shadowRoot.querySelector('.socalHandle');

        //Only one image should be allowed
        this._imageChild = this.querySelector('.socalImage');

        //Replace the socal image placeholder with the provided image
        this._socalLinkNode.replaceChild(this._imageChild, this._socalImageNode);

        this.attributeChangedCallback();
      }

      get handle()
      {
        return this.getAttribute("handle");
      }

      set handle(newValue)
      {
        this.setAttribute("handle", newValue);
      }

      get url()
      {
        return "#";
      }
    }

//Do not define the actual button, we want to extend it
    window.SocalButton = SocalButton;
})(window, document);