/*!
 *
 * Document.js
 * com.neuromantic.arete.dom.elements.Document
 *
 */
_package( 'com.neuromantic.arete.dom',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Document' )._extends( 'Element', {
        static_TYPE : 'document',
        static_url : function () { 
            return location.href;
        },
        static_element : function(){
            return new Element( document );
        },
        Document : function ( atts ){
            this._super( Document.TYPE, atts );
        }
    })
);