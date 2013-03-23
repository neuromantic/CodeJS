/*!
 *
 * Badger.js
 * com.grabnetworks.vidify.Badger
 *
 */
_package( 'com.grabnetworks.vidify',
    _import( 'com.grabnetworks.player.Player' ),
    _import( 'com.neuromantic.arete.dom.Div'),
    _import( 'com.neuromantic.arete.dom.Element'),
    _import( 'com.neuromantic.arete.dom.media.Img'),
    _import( 'com.neuromantic.arete.events.MouseEvent'),
    _class( 'Badger' )._extends( 'Div', {
        Badger : function( target, badgeOptions ){
            this._super();
            var width = target.width();
            var height = target.height();
            var parent = target.parent() ; 
            var style = target.style();
            this.style( style );
            this.style( { position : 'relative'});
            this.width( width );
            this.height( height );
            target.style({border:0, margin:0, padding: 0});
            parent.replace( this, target );
            this.append( target );
            var badge = new Img( badgeOptions );
            badge.style( { position:'absolute', border: 0 , zIndex : 10000 });
            badge.on( MouseEvent.CLICK, this._.badge_onClick );
            this.append(badge);
        },
        private_badge_onClick : function ( event ){
            this._.notify( event );
        }//,
    })
);
    