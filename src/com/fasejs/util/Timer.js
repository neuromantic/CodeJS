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
 
_class('Timer')._extends('EventDispatcher', {
	tickTime : 0,
	remaining : 0,
	repeat : 0,
	timeout : null,
	init : function( tickTime, repeat ) {
		this.tickTime = tickTime;
		this.repeat = repeat || -1;
		this.remaining = repeat;
	},
	tick : function () {
		this.stop();
		this.remaining--;
		if( this.remaining > 0 || this.repeat == -1 ) {
			this.dispatchEvent( new TimerEvent( TimerEvent.TIMER, this ) );
		}else{
			this.dispatchEvent( new TimerEvent( TimerEvent.COMPLETE, this ) );
		};
		this.start();
	},
	reset : function () {
		this.stop();
		this.remaining = this.repeat;
		this.dispatchEvent( new TimerEvent( TimerEvent.RESET, this ) );
		this.start();
	},
	start : function () {
		if (! this.timeout ) {
			var timer = this;
			this.timeout = setTimeout( function(){ timer.tick() }, this.tickTime );
			this.dispatchEvent( new TimerEvent( TimerEvent.START, this ) );
		};
	},
	stop : function () {
		if ( this.timeout ){
			clearTimeout(this.timeout);
			this.timeout = null;
			this.dispatchEvent( new TimerEvent( TimerEvent.STOP, this ) );
		};
	}
});
	