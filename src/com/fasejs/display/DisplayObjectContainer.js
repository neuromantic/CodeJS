/*
 * DisplayObjectContainer.js
 * com.fasejs.display.DisplayObjectContainer
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.display',
 
 	_import( 'com.fasejs.events.DisplayObject' ),
 	_import( 'com.fasejs.events.MouseEvent' ),
 	_import( 'com.fasejs.display.Stage' ),
 	
	_class( 'DisplayObjectContainer' )._extends( 'DisplayObject', {
			private_children : [],
			addChild : function( child ) {
	// _trace( 'adding', child, 'to', this );
			if( child !== this ){
				if( child instanceof DisplayObject ) {
					if ( child.parent() != null) {
	// _trace( 'removing', child, 'from', child.parent() );
						child.parent().removeChild( child );
					};
	// _trace( 'appending element' );
					this.element().appendChild( child.element() );
					child.element().style.zIndex =  this._.children.length;
	// _trace('parenting', this, 'to', child );
					child.parent( this );
					this._.children.push( child );
				}else{
					_trace( child , 'is not a' , DisplayObject );
				};
				this._measure();
			}else{
				throw new Error('You cannot addChild something to itself.')
			};
		},
		_measure : function ( shrunk ) {
			if( shrunk ) {
				this.width( 0 );
				this.height( 0 );
			};
			for ( var index in this._.children ){
				var child = this._.children[ index ];
				this.width( Math.max( this.width()  , child.x() + child.width() ) );
				this.height( Math.max( this.height(), child.y() + child.height() ) );
			};
		},
		stage : function( value ) {
			if ( value === undefined ) {
				return this._super.stage();
			};
			this._super.stage( value );
			for ( index in this._.children ) {
				if( this._.children[ index ] ) {
					this._.children[ index ].stage( this.stage() );
				};
			};
		},
		removeChild : function( child ) {
			this.element().removeChild( child.element() );
			this._.children.splice( this._.children.indexOf( child ), 1 );
			child.parent( null );
			this._measure();
		},
		y : function (value ){
			if( value === undefined ) {
				return this._super.y();
			};
			this._super.y(value);
			for ( index in this._.children ) {
				var child = this._.children[ index ];
				child.y( child.y() );
			};
		},
		x : function (value ){
			if( value === undefined ) {
				return this._super.x();
			};
			this._super.x(value);
			for ( index in this._.children ) {
				var child = this._.children[ index ];
				child.x( child._.x );
			};
		},
		visible : function( value ) {
			if ( value === undefined ) {
				return this._super.visible();
			};
			this._super.visible( value );
			_trace(this, 'visible', this._.children)
			for( index in this._.children ) {
				this._.children[ index ].visible( this.visible() );
			};
			
		},
	})
);