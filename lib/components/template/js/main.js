"use strict";
((window, document, undefined) =>
{
    //Importing document
    var thatDoc = document;

    //Actual document
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class /*TODO give class a name*/ extends HTMLElement
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

        //Todo content handling
        //e.g. this.content = shadowRoot.querySelector('#content')
        //     this.realChildren = this.querySelector("*");
        //     for(var i = 0; i < this.children.length; i++)
        //     {
        //        this.content.appendChild(this.linkChildren[i])
        //     };
      }
    }


    window./*TODO: class name here*/ = thatDoc.registerElement(/*TODO: replace with elementName*/, /* TODO: place class here*/);
})(window, document);