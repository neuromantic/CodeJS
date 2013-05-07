/*!
 *
 * Head.js
 * com.neuromantic.arete.dom.document.Head
 *
 */
_package( 'com.neuromantic.arete.dom.document',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _class( 'Head' )._extends( 'Element', {
        static_TYPE : 'head',
        static_element : function(){
            return Document.element().find( Head )[ 0 ];
        },
        Head : function ( atts ){
            this._super( Head.TYPE, atts );
        }
    })
);