/*!
 *
 * Div.js
 * com.neuromantic.arete.dom.Div
 *
 */
_package( 'com.neuromantic.arete.dom',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Div' )._extends( 'Element', {
        static_TYPE : 'div',
        Div : function ( atts ){
            this._super( Div.TYPE, atts );
        }
    })
);