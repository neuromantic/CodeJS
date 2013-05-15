/*!
 *
 * Ol.js
 * com.neuromantic.arete.dom.elements.list.Ol
 *
 */
_package( 'com.neuromantic.arete.dom.elements.list',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Ol' )._extends( 'Element', {
        static_TYPE : 'ol',
        Li : function ( atts ){
            this._super( Ol.TYPE, atts );
        }
    })
);