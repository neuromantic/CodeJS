/*!
 *
 * Body.js
 * com.neuromantic.arete.dom.document.Body
 *
 */
_package( 'com.neuromantic.arete.dom.document',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _class( 'Body' )._extends( 'Element', {
        static_TYPE : 'body',
        static_element : function(){
            return Document.element().find( Body )[ 0 ];
        },
        Body : function ( atts ){
            this._super( Body.TYPE, atts );
        }
    })
);