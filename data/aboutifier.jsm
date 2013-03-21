/* vim:set ts=2 sw=2 sts=2 et tw=80:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

let EXPORTED_SYMBOLS = ["aboutifier"];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import('resource://gre/modules/Services.jsm');

var Aboutifier = function() {
    this.uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                    .getService(Components.interfaces.nsIUUIDGenerator);
};

Aboutifier.prototype.aboutify = function(resource, name) {
    var classID = Components.ID(this.uuidGenerator.generateUUID().toString());
    var contractID = "@mozilla.org/network/protocol/about;1?what="+name;
    
    function Aboutthings() { }
    Aboutthings.prototype = {
      classDescription: "about:ifier",
      contractID: contractID,
      classID: classID,
      QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIAboutModule]),
      
      getURIFlags: function(aURI) {
        dump('get flags!\n');
        dump(aURI);
        dump('\n');
        return Components.interfaces.nsIAboutModule.ALLOW_SCRIPT | Components.interfaces.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
      },
      
      newChannel: function(aURI) {
    	  dump('newChannel\n');
        var securityManager = Components.classes['@mozilla.org/scriptsecuritymanager;1']
                              .getService(Components.interfaces.nsIScriptSecurityManager);

        var ioService = Services.io;
        var uri = ioService.newURI(resource, null, null);
  
        // FF16 and below had getCodebasePrincipal, it was replaced by
        // getNoAppCodebasePrincipal (bug 758258).
        var resourcePrincipal = 'getNoAppCodebasePrincipal' in securityManager ?
                                securityManager.getNoAppCodebasePrincipal(uri) :
                                securityManager.getCodebasePrincipal(uri);

        let ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
        let channel = ios.newChannel(resource,
                                     null, null);
        channel.originalURI = aURI;
        channel.owner = resourcePrincipal;

  	  dump('newChannel done\n');
        return channel;
      }
    };
    
    var AboutthingsFactory = {
      createInstance: function (outer, iid) {
        if (outer != null) {
          throw Components.results.NS_ERROR_NO_AGGREGATION; 
        }
        return (new Aboutthings()).QueryInterface(iid);
      }
    };
    
    var registrar = Components.manager.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    registrar.registerFactory(classID, "Aboutthings",
                              contractID, AboutthingsFactory);
};
var aboutifier = new Aboutifier();