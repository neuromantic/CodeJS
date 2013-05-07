/*!
 *
 * Media.js
 * com.neuromantic.arete.dom.elements.Media
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Media' )._extends( 'Element', {
        Media : function ( tag,  atts ){
            this._super( tag, atts );
        },
        load : function ( url ) {
            this.tag( { src : url } );
        },
        get_url : function () {
            return this._.tag.src;
        }
    })
);