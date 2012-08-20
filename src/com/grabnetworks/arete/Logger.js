/*!
 *
 * Logger.js
 * com.grabnetworks.arete.Logger
 *
 */
_package( 'com.grabnetworks.arete',
 	_import( 'com.grabnetworks.arete.Component' ),
	_class( 'Logger' )._extends( 'Component', {
		Logger : function( ) {
			console = console || {};
			console.log = console.log || function( dev ){ null };
		},
		output : function ( message ) {
			var output = '{ ';
			for( var key in message ){
				var value = message[ key ];
				output = output + ' '+  key + ' : ' + value.toString()  +  ',';
			}
			output = output.slice(0, -1);
			output = output + ' }';
			_trace( output );
		}
	})
)
		