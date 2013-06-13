/*!
 *
 * CloseButton.js
 * com.grabnetworks.ui.CloseButton
 *
 */
_package( 'com.grabnetworks.ui',
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    _import( 'com.grabnetworks.loading.AssetURLs'),
    
    _class( 'CloseButton' )._extends( 'Img', {
        CloseButton : function(atts) {
            this._super( atts );
            this.load( AssetURLs.CLOSE_BUTTON );
        }
    })
);