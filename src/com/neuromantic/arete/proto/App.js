/*!
 *
 * App.js
 * com.neuromantic.arete.proto.App
 *
 */
_package('com.neuromantic.arete.proto', 
    _import( 'com.neuromantic.arete.proto.Component'),
    _import( 'com.neuromantic.arete.dom.Element'),
    _class( 'App')._extends( 'Component', {
        private_settings : null,
        App : function( settings, atts ){
            this._super( atts );
            var target;
            if( settings.target instanceof Element ){
                target = settings.target;
            } else if( Element.canWrap( settings.target ) ){
                target = new Element( settings.target );
            } else if( typeof settings.target === 'string' && settings.target.charAt( 0 ) === '#' ) {
                target = Element.find( settings.target );
            } else {
                var script = Script.current();
                target = script.parent();
                target.remove( script );
            }
    		this._.settings = settings || this._.settings;
            if(target){
                this.parent( target );
            }
            this.style({ 
                position: 'relative',
            });
            this.exec();
        }
    })
);