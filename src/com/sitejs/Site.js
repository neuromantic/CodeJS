 /*!
 *
 * Site.js
 * com.sitejs.Site.js
 * 
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.sitejs', 

	_import( 'com.fasejs.display.Stage' ),
	
	_class( 'Site', {
		stage : null,
		Site : function () {
			this.stage = new Stage( document.body );
			this.setup();
			this.build();
			this.addEvents();
			this.init();
			this.layout();
			this.start();
		},
		setup : function () {},
		build : function () {},
		addEvents : function () {},
		init : function () {},
		layout : function () {},
		start : function () {}
	}
));
