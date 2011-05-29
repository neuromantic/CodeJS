/*!
 *
 * Graphics.js
 * com.fasejs.display.Graphics
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 // _package( 'com.fasejs.display',

	_class('Graphics', {
		static_rgba : function( color, alpha ) {
// _trace( color, alpha );
			color = color.toString( 16 );
			alpha = alpha || 1;
			var rgba = 'rgba('+ parseInt( color.substring( 0, 2 ), 16 ) + ','
						  + parseInt( color.substring( 2, 4 ), 16 ) + ','
						  + parseInt( color.substring( 4, 6 ), 16 ) + ','
						  + alpha + ')';
// _trace( rgba )
			return rgba;
		},
		private_context : null,
		Graphics : function( displayObject ) {
			var canvas = document.createElement( 'canvas' );
			displayObject.element().appendChild( canvas );
			canvas.width = displayObject.width();
			canvas.height = displayObject.height;
			this._.context = canvas.getContext( '2d' );
		},
		moveTo : function( x, y ) {
			this._.context.moveTo(x, y);
		},
		lineStyle : function( lineWidth, lineColor, alpha ) {
			this._.context.strokeStyle = Graphics.rgba( lineColor.toString( 16 ), alpha );
			this._.context.lineWidth = lineWidth;
			this._.context.stroke();
		},
		drawCircle : function(x, y, rad) {
			this._.context.arc(x, y, rad, 0, Math.PI*2, false); 
		},
		beginFill : function(fillColor, alpha) {
			this._.context.fillStyle = Graphics.rgba( fillColor, alpha)
		},
		fillStyle : function(rgbString) {
			this._.context.fillStyle = rgbString;
		},
		drawRect : function(x, y, w, h) {
			this._.context.fillRect(x, y, w, h);
		},
		endFill : function() {
			this._.context.fill();
		},
		lineTo : function(x, y) {
			this._.context.lineTo(x, y);
		}, 
// XXX: Undeclared 
		// curveTo : function() {
			// this._.context.quadraticCurveTo.( xControl, yControl, xEnd, yEnd );
		// },
		quadraticCurveTo : function(xControl, yControl, xEnd, yEnd) {
			this._.context.quadraticCurveTo(xControl, yControl, xEnd, yEnd);
		},
		drawRoundedRect : function(x, y, w, h, rad) {
		    this.moveTo(x, y + rad);
		    this.lineTo(x, y + h - rad);
		    this.quadraticCurveTo(x, y + h, x + rad, y + h);
		    this.lineTo(x + w - rad, y + h);
		    this.quadraticCurveTo(x + w, y + h, x + w, y + h - rad);
		    this.lineTo(x + w, y + rad);
		    this.quadraticCurveTo(x + w, y, x + w - rad, y);
		    this.lineTo(x + rad, y);
		    this.quadraticCurveTo(x, y, x, y + rad);
		},
		clear : function() {
		    this._.context.clearRect( 0, 0, this._.context.canvas.width, this._.context.canvas.height );
		}
	});
