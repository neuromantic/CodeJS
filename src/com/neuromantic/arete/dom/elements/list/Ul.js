/*!
 *
 * Ul.js
 * com.neuromantic.arete.dom.elements.list.Ul
 *
 */
_package( 'com.neuromantic.arete.dom.elements.list',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Ul' )._extends( 'Element', {
        static_TYPE : 'ul',
        Ul : function ( atts ){
            this._super( Ul.TYPE, atts );
        }
    })
);