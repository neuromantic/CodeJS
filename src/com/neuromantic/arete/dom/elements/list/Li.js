/*!
 *
 * Li.js
 * com.neuromantic.arete.dom.elements.list.Li
 *
 */
_package( 'com.neuromantic.arete.dom.elements.list',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Li' )._extends( 'Element', {
        static_TYPE : 'li',
        Li : function ( atts ){
            this._super( Li.TYPE, atts );
        }
    })
);