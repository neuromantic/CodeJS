/*!
 *
 * Event.js
 * com.fasejs.events.Event
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
 
 	_import( 'com.fasejs.events.Event' ),
 	
	_class( 'LoadingEvent' )._extends( 'Event', {
		static_UNINITIALIZED : 'uninitialized',
		static_LOADING : 'loading',
		static_LOADED : 'loaded',
		static_INTERACTIVE :  'interactive',
		static_COMPLETE :  'loadingComplete',
		data : {},
		LoadingEvent : function( type, target, data ) {
			this._super( type, target );
			this.data = data;
		}//,
	})
);