/*!
 *
 * EmailInput.js
 * com.neuromantic.arete.dom.elements.form.inputs.text.EmailInput
 *
 */
_package( 'com.neuromantic.arete.dom.elements.form.inputs.text',

	_import( 'com.neuromantic.arete.dom.elements.form.inputs.TextInput' ),
	
	_class( 'EmailInput' )._extends( 'TextInput', {
		EmailInput : function( placeholder ) {
			this._super( placeholder, 'email', /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i );
		}//,
	} )//,
);
