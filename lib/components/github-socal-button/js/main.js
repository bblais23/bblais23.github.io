"use strict";
((window, document, undefined) =>
{
    //Importing document
    var thatDoc = document;

    //Actual document
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    var template = thisDoc.querySelector('template').content;

    class GithubSocalButton extends SocalButton
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

      get url()
      {
        return "http://gihub.com/" + this.handle;
      }
    }


    window.GithubSocalButton = thatDoc.registerElement("github-socal-button", GithubSocalButton);
})(window, document);