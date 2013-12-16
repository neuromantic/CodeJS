/*!
 *
 * Badger.js
 * com.grabnetworks.vidify.Badger
 *
 */
_package( 'com.grabnetworks.vidify',
    _import( 'com.neuromantic.arete.dom.Element'),
    _import( 'com.neuromantic.arete.dom.elements.Div'),
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    _import( 'com.neuromantic.arete.events.MouseEvent'),
    _class( 'Badger' )._extends( 'Div', {
        private_badge : null,
        private_onBadgeClicked : function ( event ){
            this._.notify( event );
        },
        Badger : function( target, badgeImg ){
            this._super();
            var width = target.width();
            var height = target.height();
            var parent = target.parent(); 
            var style = target.style();
            this.style( style );
            this.style( { overflow: 'visible', position: 'relative', display: ( style.display === 'inline' ? 'inline-block' : style.display ) } );
            this.width( width );
            this.height( height );
            target.style( { border:0, margin:0, padding: 0 } );
            parent.replace( this, target );
            this.append( target );
            this._.badge = badgeImg;
            this._.badge.on( MouseEvent.CLICK, this._.onBadgeClicked );
            this.append( this._.badge );
        },
        set_visible : function( value ) {
            this._.badge.visible( value );
            this._super().visible( value );
        }//,
    })
);
    