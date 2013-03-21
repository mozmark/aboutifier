var data = require("self").data;
const {Cu} = require("chrome");

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import('resource://gre/modules/Services.jsm');

Cu.import(data.url('aboutifier.jsm'));

aboutifier.aboutify("chrome://browser/content/aboutRobots.xhtml","badgers");
aboutifier.aboutify(data.url('aboutifier.jsm'),"ifier");