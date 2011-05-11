/*!
 *
 * DisplayObject.js
 * com.fasejs.display.DisplayObject
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 
_class('DisplayObject')._extends('EventDispatcher', {
	
	_addEvents : function () {
		this.element().onclick = '(dipatchEvent( new MouseEvent( MouseEvent.CLICK ) ) )()';
	},
	static_count : 0,
	init : function( contents ) {
		this.element( contents );
		this._addEvents();
	},
	element : function( value ) {
		if( value === undefined ) {
			return this._element || ( this._element = document.createElement( 'div' ) );
			
		}
		this._element = value;
		this.element().styleName = this.constructor._className;
		if( this.element().id ){
			this.name( this.element().id )
		}else if( this.name() ) {
			this.element().id = this.name();
		};
		this._addEvents();
	},
	name : function( value ) {
		if( value === undefined ) {
			return this._name || ( this._name = null );
		};
		this._name = value;
		if( this.element() ) {
			this.element().id = this.name();
		};
	},
	parent : function( value ) {
		if ( value === undefined ) {
			return this._parent || ( this._parent = null );
		};
		this._parent =  value;
		this.stage( this.parent().stage() );
	},
	init : function( name ) {
		this.name( name );
		this.id = this.name();
	},
	addChild : function( child ) {
		this.children = this.children || [];
		if( child instanceof DisplayObject ) {
			if ( child.parent() != null) {
				child.parent().removeChild( child );
			};
			this.element().appendChild( child.element() );
			child.element().style.zIndex =  this.children.length;
			child.parent( this );
			this.children.push( child );
		}else{
			_trace( child , 'is not a' , DisplayObject );
		};
	},
	removeChild : function(child) {
		this.element().removeChild( child.element() );
		this.children.splice( this.children.indexOf(child), 1 );
		child.parent( null );
	},
	_stage : null,
	stage : function( value ) {
		if ( value === undefined ) {
			return this._stage;
		};
		this._stage = value;
		if( this.children ) {
			for ( index in this.children ) {
				this.children[index].stage( this.stage() );
			};
		};
	},
	_x : 0,
	x : function( value ) {
		if ( value === undefined ){
			return this._x;
		};
		this._x = value;
		// var inheritedX = 0
		// if( this.parent() ) {
			// inheritedX = this.parent().x()
		// }
		// var x =  value + inheritedX;
		this.element().style.left = x + 'px';
		// for ( index in this.children ) {
			// var child = this.children[ index ];
			 // child.x( child._x );
		// };
	},
	_y : 0,
	y : function( value ) {
		if ( value === undefined ) {
			return this._y;
		};
		this._y = value;
		// var inheritedY = ( this.parent() ? this.parent().y() : 0 );
		// var y = value + inheritedY;
		this.element().style.top = y + 'px';
		// for ( index in this.children ) {
			// this.children[ index ].y( this.children[ index ]._y );
		// };
	},
	height : function( value ) {
		if( value == undefined ){
			return Number( this.element().offsetHeight );
		}
		this.element().offsetHeight = value;
	},
	width : function( value ) {
		if( value === undefined ){
			return Number( this.element().offsetWidth );
		}
		this.element().styleoffsetWidth = value;
	},
	alpha : function( value ) {
		if( value === undefined ) {
			return Math.round(this.element().style.opacity * 256) / 25600 ;
		}
		this.element().style.opacity = Math.round( value *256) / 256;
	}
});