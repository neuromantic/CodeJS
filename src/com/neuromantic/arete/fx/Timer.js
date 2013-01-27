/*!
 *
 * Timer.js
 * com.neuromantic.arete.fx.Timer
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.neuromantic.arete.fx',

    _import( 'com.neuromantic.arete.events.Notifier' ),
	_import( 'com.neuromantic.arete.events.TimerEvent' ),
	
	_class('Timer')._extends('Notifier', {
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
		},
		private_tick : function () {
			if( this._.remaining > 0 || this._.repeat === -1 ) {
				this._.notify( new TimerEvent( TimerEvent.TIMER ) );
				this._.advance();
			}else{
				this._.notify( new TimerEvent( TimerEvent.COMPLETE ) );
				this.stop();
			};
			this._.remaining--;
		},
		private_advance : function () {
			if( this._.running ){
				this.stop();
				this.start();
			}
		},
		reset : function () {
			this._.notify( new TimerEvent( TimerEvent.RESET ) );
			this._.remaining = this._.repeat;
			this._.advance();
		},
		start : function () {
			if (! this._.timeout ) {
				this._.notify( new TimerEvent( TimerEvent.START ) );
				this._.timeout = setTimeout( this._.tick , this._.tickTime );
				this._.running = true;
			};
		},
		stop : function () {
			if ( this._.timeout ){
				clearTimeout( this._.timeout );
				this._.timeout = null;
				this._.notify( new TimerEvent( TimerEvent.STOP ) );
				this._.running = false;
			};
		}//,
	})
);
	