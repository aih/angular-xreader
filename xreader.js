/**
 * xreader - generic xml reader in angularjs
 * @version v0.1.0
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
                    if(stylesheets && stylesheets.length>0){
                        readerFactory.addStylesheets(stylesheets);
                    }
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
                    elements.empty().append(divContainer);
                    $compile(divContainer)(scope);
                });
                }
        }

    };
}]);

xr.factory('readerFactory', function(){

    var readers = {};

    /** Adds stylesheets to document.head
     * Accepts an array of urls for stylesheets
     */
    //TODO deal with namespaces so the app does not have stylesheet conflicts
    var addStylesheets = function(stylesheetsList){
       var docHead = window.document.head;
       var currentLinks = docHead.getElementsByTagName('link');
       var link = document.createElement('link');
       link.setAttribute('rel','stylesheet');

       angular.forEach(stylesheetsList,function(stylesheet){
           linkClone = link.cloneNode(true);
           linkClone.setAttribute('href',stylesheet);
           //Do not add stylesheet if it is already in the head element
           var isDuplicate = false;
           for (var key in currentLinks){ if(currentLinks.hasOwnProperty(key)){ 
                isDuplicate = ((stylesheet == currentLinks[key].getAttribute('href')) || isDuplicate);
           }}
           if(!isDuplicate){
               try{
                   document.head.appendChild(linkClone);
               }catch(e){}
           }
       });
    };

    return{
        constants: {
            //TODO allow constant to be overridden in app, using a variable
            //xrconstants
            loadXML : '<div>Load Bill</div>'
        },
        currentElement: {},
        addStylesheets : addStylesheets,
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
