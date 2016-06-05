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
  var thisDoc = thatDoc.currentScript.ownerDocument;

  var template = thisDoc.querySelector('template').content;

  //Create class for the component
  class ArticleContent extends HTMLElement
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

      this.contentContainer = shadowRoot.querySelector('.content');
      this.articleChildren = this.children;

      while(this.articleChildren.length > 0) 
      {
        this.contentContainer.appendChild(this.articleChildren[0]);
      };
    }
  };

    window.ArticleContent = thatDoc.registerElement('article-content', ArticleContent);
})(window, document);