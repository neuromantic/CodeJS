/*!
 *
 * Script.js
 * com.neuromantic.arete.dom.elements.Script
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Script' )._extends( 'Element', {
        static_TYPE : 'script',
        Script : function ( atts ){
            this._super( Script.TYPE, atts );
        }
    })
);