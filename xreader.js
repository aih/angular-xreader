/**
 * xreader - generic xml reader in angularjs
 * @version v1.0.2
 * @license MIT
 * @author Ari Hershowitz <arihershowitz@gmail.com>
 */
(function(){
    var xr = angular.module('xr', ['ng']);
    
    xr.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);
    
xr.directive("xrReader",['$parse', '$compile', 'readerFactory', function($parse, $compile, readerFactory){
    return {
        link: function(scope, elements, attributes) {
            var xmlGetter = $parse(attributes.xmlsource);
            var preProcessGetter = $parse(attributes.xrpre);
            var stylesheetsGetter = $parse(attributes.xrstylesheets);
            if(attributes.xmlsource){
                scope.$watch(attributes.xmlsource, function(){
                    var stylesheets = stylesheetsGetter(scope);
                    var xmlSource = xmlGetter(scope);
                    var xElement = jQuery.parseXML(xmlSource || readerFactory.constants.loadXML);
                    /**
                     * xrpre defines a preprocessing function that accepts
                     * a DOM structure and returns a DOM structure after
                     * processing
                     */
                    //TODO allow for multiple, chained, preprocessing functions
                   var preProcessor = preProcessGetter(scope);
                    if(preProcessor){
                        xElement = preProcessor(xElement);
                    }
                    var divContainer = document.createElement('div');
                    divContainer.appendChild(xElement.firstElementChild);
                    if(stylesheets && stylesheets.length>0){
                        var linkElement = document.createElement('link');
                        linkElement.setAttribute('property','stylesheet');
                        linkElement.setAttribute('rel','stylesheet');
                        linkElement.setAttribute('ng-href','{{stylesheet}}');
                        linkElement.setAttribute('ng-repeat','stylesheet in stylesheets');
                        divContainer.insertBefore(linkElement, divContainer.firstChild);
                    }
                    elements.empty().append(divContainer);
                    $compile(divContainer)(scope);
                });
                }
        }

    };
}]);

xr.factory('readerFactory', function(){

    var readers = {};

    return{
        constants: {
            //TODO allow constant to be overridden in app, using a variable
            //xrconstants
            loadXML : '<div>Loading Bill</div>'
        },
        currentElement: {},
        scrollToSelector :function(readerId, selector){
                var selectorElement = jQuery(selector)[0];
               // selectorElement.scrollIntoView();
                var container = document.getElementById(readerId);
                container.scrollTop = selectorElement.offsetTop - container.offsetTop;
            },
        scrollToTop :function(readerId){
                readerId = readerId || "docContainer";
                jQuery(readerId.addHash()).scrollTop(0);
            },
        scrollToBottom: function(readerId){
                readerId = readerId || "docContainer";
                var container = jQuery(readerId.addHash());
                var height = container.find(':first').height();
                container.scrollTop(height);
            },
        downloadFile : function(fileText, filename){
                var downloadFilename = filename? filename : 'document.xml';
                saveTextAs(fileText, downloadFilename);
            }
    };

});

String.prototype.addHash = function(){
    return this.replace(/^#?/,'#');
};

})();
