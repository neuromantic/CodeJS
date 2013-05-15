/*!
 *
 * SubmitButton.js
 * com.neuromantic.arete.dom.elements.form.inputs.buttons.SubmitButton
 *
 */
_package( 'com.neuromantic.arete.dom.elements.form.inputs.buttons',

	_import( 'com.neuromantic.arete.dom.elements.form.Input' ),
	
	_class('SubmitButton')._extends('Input', {
		SubmitButton : function( label ){
			this._super('submit');
			if(label !== undefined){
				this.value( label );
			};
		}//,
	})
);
