"use strict";
((window, document, undefined) =>
{
    //Importing document
    var thatDoc = document;

    //Actual document
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class ProfileBox extends HTMLElement
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


    window.ProfileBox = thatDoc.registerElement("profile-box", ProfileBox);
})(window, document);