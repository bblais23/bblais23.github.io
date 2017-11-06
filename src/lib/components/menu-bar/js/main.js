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
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class MenuBar extends HTMLElement
    {
      constructor()
      {
        super();
      }

      createdCallback()
      {
        var shadowRoot = this.createShadowRoot();
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);

        //Get the content node
        this.content = shadowRoot.querySelector('.content');

        //Get the actual children of this node (do nothing for now)
        var linkChildren = this.children;

        while(linkChildren.length > 0) 
        {
          this.content.appendChild(linkChildren[0]);
        };
      }
    }

    window.MenuBar = thatDoc.registerElement('menu-bar', MenuBar);
})(window, document);