/*!
 *
 * CloseButton.js
 * com.grabnetworks.ui.CloseButton
 *
 */
_package( 'com.grabnetworks.ui',
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    
    _class( 'CloseButton' )._extends( 'Img', {
        CloseButton : function(atts) {
            this._super( atts );
            this.load( 'http://static.grab-media.com/images/ui/close.png' );
        }
    })
);