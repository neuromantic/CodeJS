/*!
 *
 * Div.js
 * com.neuromantic.arete.dom.elements.Div
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Div' )._extends( 'Element', {
        static_TYPE : 'div',
        Div : function ( atts ){
            this._super( Div.TYPE, atts );
        }
    })
);