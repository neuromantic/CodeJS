/*!
 *
 * ComponentEvent.js
 * com.neuromantic.arete.events.ComponentEvent
 *
 */
  _package( 'com.neuromantic.arete.events',
 
     _import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('ComponentEvent')._extends('Event', { 
        
		static_EXEC : 'componentExec',
		static_RUN : 'componentRun',
        static_SHOW : 'componentShow',
        static_HIDE : 'componentHide',
		static_INIT : 'componentInit',
		static_START : 'componentStart',
		static_STOP : 'componentStop',
        static_RENDER : 'componentRender',
        static_DESTOY : 'componentDestroy',
		static_LAYOUT : 'componentLayout',
		static_SETUP : 'componentSetup'
	})
);