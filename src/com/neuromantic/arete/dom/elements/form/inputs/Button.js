/*!
 *
 * Button.js
 * com.browser.js.dom.form.inputs.Button
 *
 */
_package( 'com.neuromantic.arete.dom.elements.form.inputs',

	_import( 'com.neuromantic.arete.dom.elements.form.Input' ),
	
	_class('Button')._extends('Input', {
		SubmitButton : function( label ){
			this._super('button');
			if(label !== undefined){
				this.value( label );
			};
		}//,
	})
);
