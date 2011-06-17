/*!
 *
 * Timer.js
 * com.fasejs.util.Timer
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.util',

	_import( 'com.fasejs.events.EventDispatcher' ),
	_import( 'com.fasejs.events.TimerEvent' ),
	
	_class('Timer')._extends('EventDispatcher', {
		private_tickTime : 0,
		private_remaining : 0,
		private_repeat : 0,
		private_timeout : null,
		private_running : false,
		Timer : function( tickTime, repeat ) {
//_debug( this, 'Timer' );
			this._super();
			this._.tickTime = tickTime;
			this._.repeat = repeat || -1;
			this._.remaining = repeat;
			//_trace( 'new Timer', tickTime, repeat );
		},
		tick : function () {
			//_trace( 'ticking', this._.timeout);
			if( this._.remaining > 0 || this._.repeat === -1 ) {
				this._dispatchEvent( new TimerEvent( TimerEvent.TIMER, this ) );
				//_trace( 'advance');
				this.advance();
			}else{
				this._dispatchEvent( new TimerEvent( TimerEvent.COMPLETE, this ) );
				//_trace( 'stop' );
				this.stop();
			};
			this._.remaining--;
		},
		advance : function () {
			//_trace( 'advancing' );
			if( this._.running ){
				this.stop();
				this.start();
			}
		},
		reset : function () {
			//_trace( 'resetting' );
			this._dispatchEvent( new TimerEvent( TimerEvent.RESET, this ) );
			this._.remaining = this._.repeat;
			this.advance();
		},
		start : function () {
			//_trace( 'starting, my timeout is', this._.timeout );
			if (! this._.timeout ) {
				var _this = this;
				this._dispatchEvent( new TimerEvent( TimerEvent.START, this ) );
				this._.timeout = window.setTimeout( function(){ _this.tick() }, this._.tickTime );
				//_trace( 'created timeout', this._.timeout );
				this._.running = true;
			};
		},
		stop : function () {
			//_trace( 'stopping' );
			if ( this._.timeout ){
				window.clearTimeout( this._.timeout );
				this._.timeout = null;
				this._dispatchEvent( new TimerEvent( TimerEvent.STOP, this ) );
				this._.running = false;
			};
		}//,
	})
);
	