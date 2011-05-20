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
 _package( 'com.fasejs.display',

	_class('Graphics', {
		Graphics : function(displayObject) {
			var canvas = document.createElement('canvas');
			this._canvas = canvas;
			displayObject.element().appendChild(canvas);
			this._context = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		},
		rgba : function( color, alpha ) {
			alpha = alpha ? ',' + alpha : '';
			return 'rgba('+ parseInt( color.substring( 0, 2 ), 16 ) + ','
						  + parseInt( color.substring( 2, 4 ), 16 ) + ','
						  + parseInt( color.substring( 4, 6 ), 16 ) + ','
						  + alpha + ')';
		},
		moveTo : function( x, y ) {
			this._context.moveTo(x, y);
		},
		lineStyle : function( lineWidth, lineColor, alpha ) {
			this._context.strokeStyle = this.rgba( lineColor.toString( 16 ), alpha );
			this._context.lineWidth = lineWidth;
			this._context.stroke();
		},
		drawCircle : function(x, y, rad) {
			this._context.arc(x, y, rad, 0, Math.PI*2, false); 
		},
		beginFill : function(fillColor, alpha) {
			var hex = fillColor.toString( 16 );
			r = this.hexToR(hex);
			g = this.hexToG(hex);
			b = this.hexToB(hex);
			this._context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
		},
		fillStyle : function(rgbString) {
			this._context.fillStyle = rgbString;
		},
		drawRect : function(x, y, w, h) {
			this._context.fillRect(x, y, w, h);
		},
		endFill : function() {
			this._context.fill();
		},
		lineTo : function(x, y) {
			this._context.lineTo(x, y);
		}, 
		curveTo : function() {
			this._context.quadraticCurveTo.(xControl, yControl, xEnd, yEnd);
		},
		quadraticCurveTo : function(xControl, yControl, xEnd, yEnd) {
			this._context.quadraticCurveTo(xControl, yControl, xEnd, yEnd);
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
		    this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
		}
	}
));
