 /*!
 *
 * Site.js
 * com.neuromantic.proto.Site
 * 
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.neuromantic.proto', 

	_import( 'com.neuromantic.proto.ExecSprite' ),
	_import( 'com.fasejs.display.Stage' ),
	
	_class( 'Site' )._extends( 'ExecSprite', {
		Site : function () {
			this._super( document.body );
			this.stage( new Stage( document.body ) );
			this.exec();
_debug( 'Site constructed.')
		},
		private_measure : function () {},
		_addEvents : function () {
			this._super._addEvents();
		}//,
	})
)
	
