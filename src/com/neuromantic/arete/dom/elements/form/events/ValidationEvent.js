/*!
 *
 * ValidationEvent.js
 * com.neuromantic.arete.dom.elements.form.events.ValidationEvent
 *
 */
  _package( 'com.neuromantic.arete.dom.elements.form.events.',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
	_class('ValidationEvent')._extends('Event', {
		static_VALID : 'valid',
		static_INVALID : 'invalid'
	})//,
);