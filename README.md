# angular-xreader

Angularjs directive to add xml to a webpage. Many xreaders can be on a single page, each with its own name. Additional features can be built in, like the ability to preprocess the xml, extract a table of contents, etc.

## Quickstart

* `npm install` (or copy the `xreader.js` file to a local directory)
* Add xreader.js to your page's scripts
* Add `xr` to your AngularJS app module:
 `var app = angular.module('classact', ['ng', 'xr'...]`

* Then add the directive to a div in your page:
      `<div style="cursor:auto" id="docContainer" xr-reader="" xmlsource="xView" xrpre="processDoc"></div>`

where `$scope.xView` is the stringified XML and `$scope.processDoc` is a string processing function in your app's scope.
