"use strict";
((window, document, undefined) =>
{
    //Importing document
    var thatDoc = document;

    //Actual document
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class BoxContent extends HTMLElement
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

        this._content = shadowRoot.querySelector(".content");

        this._realChildren = this.childNodes;

        while(this._realChildren.length > 0)
        {
            this._content.appendChild(this._realChildren[0]);
        };
      }
    }


    window.BoxContent = thatDoc.registerElement("box-content", BoxContent);
})(window, document);