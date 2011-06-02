/*!
 *
 * URLLoader.js
 * com.fasejs.net.URLLoader
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.fasejs.net',
	 
 	// _import( 'com.fasejs.events.EventDispatcher' ),
 	// _import( 'com.fasejs.net.URLRequest' ),
 	
 	
	private_xmlhttp : null,
	_class('URLLoader')._extends('EventDispatcher', {
		URLLoader : function () {
// http://developer.apple.com/internet/webcontent/xmlhttpreq.html
			var request = false;
		    // branch for native XMLHttpRequest object
		    if( window.XMLHttpRequest && (! window.ActiveXObject ) ) {
		    	try {
					request = new XMLHttpRequest();
		        } catch( e ) {
					request = false;
		        }
		    // branch for IE/Windows ActiveX version
		    } else if ( window.ActiveXObject ) {
		       	try {
		        	request = new ActiveXObject( "Msxml2.XMLHTTP" );
		      	} catch( e ) {
		        	try {
		          		request = new ActiveXObject( "Microsoft.XMLHTTP" );
		        	} catch( e ) {
		          		request = false;
		        	}
				}
		    }
		    if( request ){
				this._.xmlhttp = request;
				this._.xmlhttp.onreadystatechange = ( function( o ) { return function () { o._onReadyStateChange() }} )( this );
			}
		},
	    load : function( urlRequest ) {
// _trace( 'requesting', urlRequest );
	    	this._.xmlhttp.open( urlRequest.method, urlRequest.url, true ); // +'?' + Math.random()
			if( urlRequest.method == 'POST' ){
				this._setHeaders( urlRequest );
			}
			_trace( 'sending', urlRequest.data )
			this._.xmlhttp.send( serialize( urlRequest.data ) );	
			_trace( 'sent.' );
			function serialize(obj) {
			  var str = [];
			  for(var p in obj)
			     str.push(p + "=" + encodeURIComponent(obj[p]));
			  return str.join("&");
			}

	    },
	    _setHeaders : function( urlRequest ) {
// _trace( 'adding headers, content-length :', urlRequest.data.length )
	    	this._.xmlhttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
			this._.xmlhttp.setRequestHeader( 'Content-length', urlRequest.data.length );
			this._.xmlhttp.setRequestHeader( 'Connection', 'close' );
	    },
	    _onReadyStateChange : function() {
// _trace( 'ready state changed.', this._.xmlhttp.readyState );
	    	switch( this._.xmlhttp.readyState ) {
	    		case 0 : // uninitialized
					this._dispatchEvent( LoadingEvent.UNINITIALIZED, this );
					break;
				case 1 : // loading
					this._dispatchEvent( LoadingEvent.LOADING, this );
					break;
				case 2 : // loaded
					this._dispatchEvent( LoadingEvent.LOADED, this );
					break;
				case 3 : // interactive
					this._dispatchEvent( LoadingEvent.INTERACTIVE, this );
					break;
				case 4 : // complete
					if ( this._.xmlhttp.status == 200 ) {
						this._dispatchEvent( new LoadingEvent( LoadingEvent.COMPLETE, this, this._.xmlhttp.responseText ) );
					}
	    	};
	    }//,
	} );

