//Use this for doing something like:
Components.utils.import('about:ifier');

aboutifier.aboutify(
    'data:text/plain;UTF-8,bacon is delicious',
    'bacon');

// or

aboutifier.aboutify(
    'chrome://browser/content/aboutRobots.xhtml',
    'cyborgs');

// then visit about:bacon or about:cyborgs
// you now have an about: page with the flags ALLOW_SCRIPT and
// URI_SAFE_FOR_UNTRUSTED_CONTENT set.
