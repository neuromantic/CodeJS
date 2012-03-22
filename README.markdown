# CodeJS

## Welcome to CodeJS. 

 **Class / Object Development for Javascript**
 
  * CodeJS is a dialect of javascript that permits classical inheritance via any number of imported class files. Modeled after ECMAScript 4, Mozart enables powerful language features such as scoped local variables, accessor functions, static properties, simulated private properties, type checking and packages. 
  * The project aims to be truly cross-browser under the hood, so users will only need to think about their creative goals.
  * Code.js is at the core of Fase.js, a collection of classes familiar to Flash developers for creating and manipulating a DisplayList and handling Events within the DOM.
  
## Why?

  * For all the shit it takes, Adobe's Flash platform produced at least one excellent achievement in rapid application development: ActionScript 3.0. Say what you will about Flash's platform, plugin, or politics, programming in its proprietary parlance makes pure code a pure pleasure. It has all of the modern, application-class language features of Java plus the dynamic scripty goodness of JavaScript. And so does CodeJS. While modern JavaScripting techniques help you to code around JavaScript's quirks and scoping faux pas, Code transports you to a place where these problems do not even exist.

  
## What does it get me?
  * Create classes AS3-style, then import them at runtime to extend and use them in other classes.
  * Utilize a pseudo-private namespace for non-public properties to keep your code cleaner.
  * Create getter and setter properties (called like methods) in your class definitions.
  * Code Javascript like you're writing pure-code AS3 projects, and get Flash-like apps and sites in Web standards. 

## Want to Contribute?
  
  * Email `git@neuromantic.com` to be added to the git repo.
  * `git clone git@github.com:neuromantic/CodeJS.git`.
   
## What's it Like?

    _package( '',
        _import( 'com.fasejs.fs.transitions.Tween'),
        _import( 'com.fasejs.fs.transitions.Easing'),
        _import( 'com.fasejs.display.Sprite' ),
        _import( 'com.fasejs.net.URLLoader' ),
        _import( 'com.fasejs.net.URLRequest' ),
        _import( 'com.fasejs.display.Loader' ),
        _import( 'com.fasejs.text.TextField' ),
        _import( 'com.fasejs.events.Event' ),
        _import( 'com.fasejs.events.MouseEvent' ),
        _import( 'com.fasejs.events.LoadingEvent' ),
        _import( 'com.browserjs.dom.form.EmailInput' ),
        _import( 'com.browserjs.dom.form.TextArea' ),
        _import( 'com.browserjs.dom.form.SubmitButton' ),
        _import( 'com.neuromantic.proto.Site' ),
  
        _class('MyApp')._extends('Site', {
            private_title : null,
            get_title : function () {
                return this._.title;
            },
            set_title : function ( value ) {
                this._.title = value;
                document.title = value;
            },
   ... and so on.
  
 

