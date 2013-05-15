/*!
 *
 * TextArea.js
 * com.neuromantic.arete.dom.elements.form.inputs.text.TextArea
 *
 */
_package( 'com.neuromantic.arete.dom.form.inputs.text',

	_import( 'com.neuromantic.arete.dom.elements.form.inputs.TextInput' ),
	
	_class('TextArea')._extends('TextInput', {
		TextArea : function( placeholder ){
			this._super(placeholder, 'textarea');
		},
		multiline : function ( value ) {
			if (value === undefined){
				return this._.element.wrap == 'soft' || 'hard' ;
			}
			this._.element.wrap = value ? 'soft' : '';
		}
	})
);
