var swfobject = function() {
        
        var UNDEF = "undefined",
                OBJECT = "object",
                SHOCKWAVE_FLASH = "Shockwave Flash",
                SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
                FLASH_MIME_TYPE = "application/x-shockwave-flash",
                EXPRESS_INSTALL_ID = "SWFObjectExprInst",
                ON_READY_STATE_CHANGE = "onreadystatechange",
                
                win = window,
                doc = document,
                nav = navigator,
                
                plugin = false,
                domLoadFnArr = [main],
                regObjArr = [],
                objIdArr = [],
                listenersArr = [],
                storedAltContent,
                storedAltContentId,
                storedCallbackFn,
                storedCallbackObj,
                isDomLoaded = false,
                isExpressInstallActive = false,
                dynamicStylesheet,
                dynamicStylesheetMedia,
                autoHideShow = true,
        
        /* Centralized function for browser feature detection
                - User agent string detection is only used when no good alternative is possible
                - Is executed directly for optimal performance
        */      
        ua = function() {
                var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
                        u = nav.userAgent.toLowerCase(),
                        p = nav.platform.toLowerCase(),
                        windows = p ? /win/.test(p) : /win/.test(u),
                        mac = p ? /mac/.test(p) : /mac/.test(u),
                        webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                        ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                        playerVersion = [0,0,0],
                        d = null;
                if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                        d = nav.plugins[SHOCKWAVE_FLASH].description;
                        if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                                plugin = true;
                                ie = false; // cascaded feature detection for Internet Explorer
                                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                        }
                }
                else if (typeof win.ActiveXObject != UNDEF) {
                        try {
                                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                                if (a) { // a will return null when ActiveX is disabled
                                        d = a.GetVariable("$version");
                                        if (d) {
                                                ie = true; // cascaded feature detection for Internet Explorer
                                                d = d.split(" ")[1].split(",");
                                                playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                                        }
                                }
                        }
                        catch(e) {}
                }
                return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
        }(),
        
        /* Cross-browser onDomLoad
                - Will fire an event as soon as the DOM of a web page is loaded
                - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
                - Regular onload serves as fallback
        */ 
        onDomLoad = function() {
                if (!ua.w3) { return; }
                if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
                        callDomLoadFunctions();
                }
                if (!isDomLoaded) {
                        if (typeof doc.addEventListener != UNDEF) {
                                doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                        }               
                        if (ua.ie && ua.win) {
                                doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                                        if (doc.readyState == "complete") {
                                                doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                                                callDomLoadFunctions();
                                        }
                                });
                                if (win == top) { // if not inside an iframe
                                        (function(){
                                                if (isDomLoaded) { return; }
                                                try {
                                                        doc.documentElement.doScroll("left");
                                                }
                                                catch(e) {
                                                        setTimeout(arguments.callee, 0);
                                                        return;
                                                }
                                                callDomLoadFunctions();
                                        })();
                                }
                        }
                        if (ua.wk) {
                                (function(){
                                        if (isDomLoaded) { return; }
                                        if (!/loaded|complete/.test(doc.readyState)) {
                                                setTimeout(arguments.callee, 0);
                                                return;
                                        }
                                        callDomLoadFunctions();
                                })();
                        }
                        addLoadEvent(callDomLoadFunctions);
                }
        }();
        
        function callDomLoadFunctions() {
                if (isDomLoaded) { return; }
                try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
                        var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
                        t.parentNode.removeChild(t);
                }
                catch (e) { return; }
                isDomLoaded = true;
                var dl = domLoadFnArr.length;
                for (var i = 0; i < dl; i++) {
                        domLoadFnArr[i]();
                }
        }
        
        function addDomLoadEvent(fn) {
                if (isDomLoaded) {
                        fn();
                }
                else { 
                        domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
                }
        }
        
        /* Cross-browser onload
                - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
                - Will fire an event as soon as a web page including all of its assets are loaded 
         */
        function addLoadEvent(fn) {
                if (typeof win.addEventListener != UNDEF) {
                        win.addEventListener("load", fn, false);
                }
                else if (typeof doc.addEventListener != UNDEF) {
                        doc.addEventListener("load", fn, false);
                }
                else if (typeof win.attachEvent != UNDEF) {
                        addListener(win, "onload", fn);
                }
                else if (typeof win.onload == "function") {
                        var fnOld = win.onload;
                        win.onload = function() {
                                fnOld();
                                fn();
                        };
                }
                else {
                        win.onload = fn;
                }
        }
        
        /* Main function
                - Will preferably execute onDomLoad, otherwise onload (as a fallback)
        */
        function main() { 
                if (plugin) {
                        testPlayerVersion();
                }
                else {
                        matchVersions();
                }
        }
        
        /* Detect the Flash Player version for non-Internet Explorer browsers
                - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
                  a. Both release and build numbers can be detected
                  b. Avoid wrong descriptions by corrupt installers provided by Adobe
                  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
                - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
        */
        function testPlayerVersion() {
                var b = doc.getElementsByTagName("body")[0];
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                var t = b.appendChild(o);
                if (t) {
                        var counter = 0;
                        (function(){
                                if (typeof t.GetVariable != UNDEF) {
                                        var d = t.GetVariable("$version");
                                        if (d) {
                                                d = d.split(" ")[1].split(",");
                                                ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                                        }
                                }
                                else if (counter < 10) {
                                        counter++;
                                        setTimeout(arguments.callee, 10);
                                        return;
                                }
                                b.removeChild(o);
                                t = null;
                                matchVersions();
                        })();
                }
                else {
                        matchVersions();
                }
        }
        
        /* Perform Flash Player and SWF version matching; static publishing only
        */
        function matchVersions() {
                var rl = regObjArr.length;
                if (rl > 0) {
                        for (var i = 0; i < rl; i++) { // for each registered object element
                                var id = regObjArr[i].id;
                                var cb = regObjArr[i].callbackFn;
                                var cbObj = {success:false, id:id};
                                if (ua.pv[0] > 0) {
                                        var obj = getElementById(id);
                                        if (obj) {
                                                if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                                                        setVisibility(id, true);
                                                        if (cb) {
                                                                cbObj.success = true;
                                                                cbObj.ref = getObjectById(id);
                                                                cb(cbObj);
                                                        }
                                                }
                                                else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                                                        var att = {};
                                                        att.data = regObjArr[i].expressInstall;
                                                        att.width = obj.getAttribute("width") || "0";
                                                        att.height = obj.getAttribute("height") || "0";
                                                        if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
                                                        if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
                                                        // parse HTML object param element's name-value pairs
                                                        var par = {};
                                                        var p = obj.getElementsByTagName("param");
                                                        var pl = p.length;
                                                        for (var j = 0; j < pl; j++) {
                                                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                                                        par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                                                }
                                                        }
                                                        showExpressInstall(att, par, id, cb);
                                                }
                                                else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                                                        displayAltContent(obj);
                                                        if (cb) { cb(cbObj); }
                                                }
                                        }
                                }
                                else {  // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                                        setVisibility(id, true);
                                        if (cb) {
                                                var o = getObjectById(id); // test whether there is an HTML object element or not
                                                if (o && typeof o.SetVariable != UNDEF) { 
                                                        cbObj.success = true;
                                                        cbObj.ref = o;
                                                }
                                                cb(cbObj);
                                        }
                                }
                        }
                }
        }
        
        function getObjectById(objectIdStr) {
                var r = null;
                var o = getElementById(objectIdStr);
                if (o && o.nodeName == "OBJECT") {
                        if (typeof o.SetVariable != UNDEF) {
                                r = o;
                        }
                        else {
                                var n = o.getElementsByTagName(OBJECT)[0];
                                if (n) {
                                        r = n;
                                }
                        }
                }
                return r;
        }
        
        /* Requirements for Adobe Express Install
                - only one instance can be active at a time
                - fp 6.0.65 or higher
                - Win/Mac OS only
                - no Webkit engines older than version 312
        */
        function canExpressInstall() {
                return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
        }
        
        /* Show the Adobe Express Install dialog
                - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
        */
        function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
                isExpressInstallActive = true;
                storedCallbackFn = callbackFn || null;
                storedCallbackObj = {success:false, id:replaceElemIdStr};
                var obj = getElementById(replaceElemIdStr);
                if (obj) {
                        if (obj.nodeName == "OBJECT") { // static publishing
                                storedAltContent = abstractAltContent(obj);
                                storedAltContentId = null;
                        }
                        else { // dynamic publishing
                                storedAltContent = obj;
                                storedAltContentId = replaceElemIdStr;
                        }
                        att.id = EXPRESS_INSTALL_ID;
                        if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
                        if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
                        doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
                        var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                                fv = "MMredirectURL=" + encodeURI(win.location).toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
                        if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + fv;
                        }
                        else {
                                par.flashvars = fv;
                        }
                        // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
                        // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
                        if (ua.ie && ua.win && obj.readyState != 4) {
                                var newObj = createElement("div");
                                replaceElemIdStr += "SWFObjectNew";
                                newObj.setAttribute("id", replaceElemIdStr);
                                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                                obj.style.display = "none";
                                (function(){
                                        if (obj.readyState == 4) {
                                                obj.parentNode.removeChild(obj);
                                        }
                                        else {
                                                setTimeout(arguments.callee, 10);
                                        }
                                })();
                        }
                        createSWF(att, par, replaceElemIdStr);
                }
        }
        
        /* Functions to abstract and display alternative content
        */
        function displayAltContent(obj) {
                if (ua.ie && ua.win && obj.readyState != 4) {
                        // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
                        // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
                        var el = createElement("div");
                        obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
                        el.parentNode.replaceChild(abstractAltContent(obj), el);
                        obj.style.display = "none";
                        (function(){
                                if (obj.readyState == 4) {
                                        obj.parentNode.removeChild(obj);
                                }
                                else {
                                        setTimeout(arguments.callee, 10);
                                }
                        })();
                }
                else {
                        obj.parentNode.replaceChild(abstractAltContent(obj), obj);
                }
        } 

        function abstractAltContent(obj) {
                var ac = createElement("div");
                if (ua.win && ua.ie) {
                        ac.innerHTML = obj.innerHTML;
                }
                else {
                        var nestedObj = obj.getElementsByTagName(OBJECT)[0];
                        if (nestedObj) {
                                var c = nestedObj.childNodes;
                                if (c) {
                                        var cl = c.length;
                                        for (var i = 0; i < cl; i++) {
                                                if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                                                        ac.appendChild(c[i].cloneNode(true));
                                                }
                                        }
                                }
                        }
                }
                return ac;
        }
        
        /* Cross-browser dynamic SWF creation
        */
        function createSWF(attObj, parObj, id) {
                var r, el = getElementById(id);
                if (ua.wk && ua.wk < 312) { return r; }
                if (el) {
                        if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                                attObj.id = id;
                        }
                        if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                                var att = "";
                                for (var i in attObj) {
                                        if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                                                if (i.toLowerCase() == "data") {
                                                        parObj.movie = attObj[i];
                                                }
                                                else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                                                        att += ' class="' + attObj[i] + '"';
                                                }
                                                else if (i.toLowerCase() != "classid") {
                                                        att += ' ' + i + '="' + attObj[i] + '"';
                                                }
                                        }
                                }
                                var par = "";
                                for (var j in parObj) {
                                        if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                                                par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                                        }
                                }
                                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                                r = getElementById(attObj.id);  
                        }
                        else { // well-behaving browsers
                                var o = createElement(OBJECT);
                                o.setAttribute("type", FLASH_MIME_TYPE);
                                for (var m in attObj) {
                                        if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                                                if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                                                        o.setAttribute("class", attObj[m]);
                                                }
                                                else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                                                        o.setAttribute(m, attObj[m]);
                                                }
                                        }
                                }
                                for (var n in parObj) {
                                        if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                                                createObjParam(o, n, parObj[n]);
                                        }
                                }
                                el.parentNode.replaceChild(o, el);
                                r = o;
                        }
                }
                return r;
        }
        
        function createObjParam(el, pName, pValue) {
                var p = createElement("param");
                p.setAttribute("name", pName);  
                p.setAttribute("value", pValue);
                el.appendChild(p);
        }
        
        /* Cross-browser SWF removal
                - Especially needed to safely and completely remove a SWF in Internet Explorer
        */
        function removeSWF(id) {
                var obj = getElementById(id);
                if (obj && obj.nodeName == "OBJECT") {
                        if (ua.ie && ua.win) {
                                obj.style.display = "none";
                                (function(){
                                        if (obj.readyState == 4) {
                                                removeObjectInIE(id);
                                        }
                                        else {
                                                setTimeout(arguments.callee, 10);
                                        }
                                })();
                        }
                        else {
                                obj.parentNode.removeChild(obj);
                        }
                }
        }
        
        function removeObjectInIE(id) {
                var obj = getElementById(id);
                if (obj) {
                        for (var i in obj) {
                                if (typeof obj[i] == "function") {
                                        obj[i] = null;
                                }
                        }
                        obj.parentNode.removeChild(obj);
                }
        }
        
        /* Functions to optimize JavaScript compression
        */
        function getElementById(id) {
                var el = null;
                try {
                        el = doc.getElementById(id);
                }
                catch (e) {}
                return el;
        }
        
        function createElement(el) {
                return doc.createElement(el);
        }
        
        /* Updated attachEvent function for Internet Explorer
                - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
        */      
        function addListener(target, eventType, fn) {
                target.attachEvent(eventType, fn);
                listenersArr[listenersArr.length] = [target, eventType, fn];
        }
        
        /* Flash Player and SWF content version matching
        */
        function hasPlayerVersion(rv) {
                var pv = ua.pv, v = rv.split(".");
                v[0] = parseInt(v[0], 10);
                v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
                v[2] = parseInt(v[2], 10) || 0;
                return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
        }
        
        /* Cross-browser dynamic CSS creation
                - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
        */      
        function createCSS(sel, decl, media, newStyle) {
                if (ua.ie && ua.mac) { return; }
                var h = doc.getElementsByTagName("head")[0];
                if (!h) { return; } // to also support badly authored HTML pages that lack a head element
                var m = (media && typeof media == "string") ? media : "screen";
                if (newStyle) {
                        dynamicStylesheet = null;
                        dynamicStylesheetMedia = null;
                }
                if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
                        // create dynamic stylesheet + get a global reference to it
                        var s = createElement("style");
                        s.setAttribute("type", "text/css");
                        s.setAttribute("media", m);
                        dynamicStylesheet = h.appendChild(s);
                        if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
                        }
                        dynamicStylesheetMedia = m;
                }
                // add style rule
                if (ua.ie && ua.win) {
                        if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                                dynamicStylesheet.addRule(sel, decl);
                        }
                }
                else {
                        if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
                        }
                }
        }
        
        function setVisibility(id, isVisible) {
                if (!autoHideShow) { return; }
                var v = isVisible ? "visible" : "hidden";
                if (isDomLoaded && getElementById(id)) {
                        getElementById(id).style.visibility = v;
                }
                else {
                        createCSS("#" + id, "visibility:" + v);
                }
        }

        /* Filter to avoid XSS attacks
        */
        function urlEncodeIfNecessary(s) {
                var regex = /[\\\"<>\.;]/;
                var hasBadChars = regex.exec(s) != null;
                return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
        }
        
        /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
        */
        var cleanup = function() {
                if (ua.ie && ua.win) {
                        window.attachEvent("onunload", function() {
                                // remove listeners to avoid memory leaks
                                var ll = listenersArr.length;
                                for (var i = 0; i < ll; i++) {
                                        listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                                }
                                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                                var il = objIdArr.length;
                                for (var j = 0; j < il; j++) {
                                        removeSWF(objIdArr[j]);
                                }
                                // cleanup library's main closures to avoid memory leaks
                                for (var k in ua) {
                                        ua[k] = null;
                                }
                                ua = null;
                                for (var l in swfobject) {
                                        swfobject[l] = null;
                                }
                                swfobject = null;
                        });
                }
        }();
        
        return {
                /* Public API
                        - Reference: http://code.google.com/p/swfobject/wiki/documentation
                */ 
                registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
                        if (ua.w3 && objectIdStr && swfVersionStr) {
                                var regObj = {};
                                regObj.id = objectIdStr;
                                regObj.swfVersion = swfVersionStr;
                                regObj.expressInstall = xiSwfUrlStr;
                                regObj.callbackFn = callbackFn;
                                regObjArr[regObjArr.length] = regObj;
                                setVisibility(objectIdStr, false);
                        }
                        else if (callbackFn) {
                                callbackFn({success:false, id:objectIdStr});
                        }
                },
                
                getObjectById: function(objectIdStr) {
                        if (ua.w3) {
                                return getObjectById(objectIdStr);
                        }
                },
                
                embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
                        var callbackObj = {success:false, id:replaceElemIdStr};
                        if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                                setVisibility(replaceElemIdStr, false);
                                addDomLoadEvent(function() {
                                        widthStr += ""; // auto-convert to string
                                        heightStr += "";
                                        var att = {};
                                        if (attObj && typeof attObj === OBJECT) {
                                                for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                                                        att[i] = attObj[i];
                                                }
                                        }
                                        att.data = swfUrlStr;
                                        att.width = widthStr;
                                        att.height = heightStr;
                                        var par = {}; 
                                        if (parObj && typeof parObj === OBJECT) {
                                                for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                                                        par[j] = parObj[j];
                                                }
                                        }
                                        if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                                                for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                                                        if (typeof par.flashvars != UNDEF) {
                                                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                                                        }
                                                        else {
                                                                par.flashvars = k + "=" + flashvarsObj[k];
                                                        }
                                                }
                                        }
                                        if (hasPlayerVersion(swfVersionStr)) { // create SWF
                                                var obj = createSWF(att, par, replaceElemIdStr);
                                                if (att.id == replaceElemIdStr) {
                                                        setVisibility(replaceElemIdStr, true);
                                                }
                                                callbackObj.success = true;
                                                callbackObj.ref = obj;
                                        }
                                        else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                                                att.data = xiSwfUrlStr;
                                                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                                                return;
                                        }
                                        else { // show alternative content
                                                setVisibility(replaceElemIdStr, true);
                                        }
                                        if (callbackFn) { callbackFn(callbackObj); }
                                });
                        }
                        else if (callbackFn) { callbackFn(callbackObj); }
                },
                
                switchOffAutoHideShow: function() {
                        autoHideShow = false;
                },
                
                ua: ua,
                
                getFlashPlayerVersion: function() {
                        return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
                },
                
                hasFlashPlayerVersion: hasPlayerVersion,
                
                createSWF: function(attObj, parObj, replaceElemIdStr) {
                        if (ua.w3) {
                                return createSWF(attObj, parObj, replaceElemIdStr);
                        }
                        else {
                                return undefined;
                        }
                },
                
                showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
                        if (ua.w3 && canExpressInstall()) {
                                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        }
                },
                
                removeSWF: function(objElemIdStr) {
                        if (ua.w3) {
                                removeSWF(objElemIdStr);
                        }
                },
                
                createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
                        if (ua.w3) {
                                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
                        }
                },
                
                addDomLoadEvent: addDomLoadEvent,
                
                addLoadEvent: addLoadEvent,
                
                getQueryParamValue: function(param) {
                        var q = doc.location.search || doc.location.hash;
                        if (q) {
                                if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
                                if (param == null) {
                                        return urlEncodeIfNecessary(q);
                                }
                                var pairs = q.split("&");
                                for (var i = 0; i < pairs.length; i++) {
                                        if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                                                return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                                        }
                                }
                        }
                        return "";
                },
                
                // For internal usage only
                expressInstallCallback: function() {
                        if (isExpressInstallActive) {
                                var obj = getElementById(EXPRESS_INSTALL_ID);
                                if (obj && storedAltContent) {
                                        obj.parentNode.replaceChild(storedAltContent, obj);
                                        if (storedAltContentId) {
                                                setVisibility(storedAltContentId, true);
                                                if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
                                        }
                                        if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
                                }
                                isExpressInstallActive = false;
                        } 
                }
        };
}();/*!
 *
 * Event.js
 * com.neuromantic.arete.events.Event
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Event', {
		static_CHANGE : 'change',
        static_RESIZE : "resize",
		type : '',
        data: null,
		target : null,
		Event : function( type, data ) {
			this.type = type;
            this.data = data;
		}//,
	})
);
/*!
 *
 * PlayerEvent.js
 * com.grabnetworks.player.PlayerEvent
 *
 */
_package('com.grabnetworks.player',
    _import('com.neuromantic.arete.events.Event'),
    _class('PlayerEvent')._extends('Event', {
        static_PLAYER_READY: 'PlayerSWFReady',
        static_VIDEO_KEYFRAME: 'VideoKeyFrameUpdate',
        static_CONTENT_LOADED: 'ContentLoaded',
        static_CONTENT_ERROR: 'ContentError',
        static_VIDEO_ENDED: 'VideoPlaybackEnded',
        static_VIDEO_PAUSED: 'VideoPlaybackPaused',
        static_VIDEO_STARTED: 'VideoPlaybackStarted',
		static_VIDEO_PLAYING: 'VideoPlaybackPlayed',
		static_PREROLL_ENDED: 'PreRollPlaybackEnded',
		static_PREROLL_STARTED: 'PreRollPlaybackStarted',
		static_PREROLL_CLICKED: 'PreRollSelected'
    })
 )/*!
 *
 * Event.js
 * com.neuromantic.arete.utils.BrowserUtil
 *
 */
_package( 'com.neuromantic.arete.utils',
    _class( 'BrowserUtil', {
        static_detectMobile : function () {
            if( (navigator.userAgent||navigator.vendor||window.opera)){
                  return (function(a){return(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))})(navigator.userAgent||navigator.vendor||window.opera);
            }
            return false;
        }//,
    })
);/*!
 *
 * URIUtil.js
 * com.neuromantic.arete.utils.Event
 *
 * based on parseUri 1.2.2, (c) Steven Levithan <stevenlevithan.com> (MIT License)
 */
_package( 'com.neuromantic.util',
    _class( 'URIUtil', {
        static_parse : function( uriString ){
            var o = URIUtil.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(uriString),
            uri = {},
            i = o.key.length;
            while (i--) uri[o.key[i]] = m[i] || "";
            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });
            return uri;
        },
        static_options : {
            strictMode: false,
            key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        }//,
    })
);/*!
 *
 * Notifier.js
 * com.neuromantic.arete.events.Notifier
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Notifier', {
    	private_notify : function( event ) {
			if( this._.handlers[ event.type ] ) {
				event.target = this;
				for( var index in this._.handlers[ event.type ] ) {
					this._.handlers[ event.type ][ index ]( event );
				}
			}
		},
		Notifier : function () {
		},
		private_handlers : {},
		on : function( eventType, eventHandler ) {
			this._.handlers[ eventType ] = this._.handlers[ eventType ] || [];
			this._.handlers[ eventType ].push( eventHandler );
		},
		off : function( eventType, eventHandler ) {
			if( this._.handlers[ eventType ] ) {
                if( eventHandler === undefined ){
                    return delete this._.handlers[ eventType ];
                }
				var index = this._.handlers[ eventType ].indexOf( eventHandler);
				if( index > -1 ) {
					this._.handlers[ eventType ].splice( index, 1 );
				}
			}
		}//,
	})
);
/*!
 *
 * LoadingEvent.js
 * com.neuromantic.arete.events.LoadingEvent
 *
 */
 _package( 'com.neuromantic.arete.events',
    _import( 'com.neuromantic.arete.events.Event'),
    _class('LoadingEvent')._extends( 'Event', {
		static_LOADED : 'loaded',
        static_PROGRESS : 'progress'//,
	})
);
/*!
 *
 * JSONP.js
 * com.neuromantic.arete.net.JSONP
 *
 */
_package( 'com.neuromantic.arete.net',
    _import( 'com.neuromantic.arete.events.Notifier' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'JSONP' )._extends( 'Notifier', {
        private_padding : 'jsonp',
        private_uid : null,
        private_script : null,
        static_receivers : [],
        private_onJSONP : function ( data ){
            this._.notify( new LoadingEvent( LoadingEvent.LOADED, data ) );
            JSONP.receivers[ this._.uid ] = null ;
        },
        JSONP: function ( padding ){
            if( padding ){
                this._.padding = padding;
            }
        },
        load: function ( url ){
            this._.uid = JSONP.receivers.length;
_debug('JSONP UID:', this._.uid );
            JSONP.receivers.push(this._.onJSONP);
_debug( JSONP.receivers.length );
            var callback = 'JSONP.receivers[' + this._.uid + ']';
_debug( callback );
_debug( eval( callback ) );
            this._.script = document.createElement('script');
            var token = ( url.indexOf('?') < 0 ) ? '?' : '&';
            this._.script.src = url + token + this._.padding + '=' + callback;
            document.getElementsByTagName( 'head' )[0].appendChild( this._.script );
        }
 	})
);/*!
 *
 * Player.js
 * com.grabnetworks.player.Player
 *
 */
_package( 'com.grabnetworks.player',
    _import('swfobject'),
    _import( 'com.grabnetworks.player.PlayerEvent' ),
    _import( 'com.neuromantic.arete.utils.BrowserUtil'),
    _import( 'com.neuromantic.arete.utils.URIUtil'),
    _import( 'com.neuromantic.arete.net.JSONP'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.neuromantic.arete.events.Notifier'),
	_class( 'Player' )._extends( 'Notifier', {
		static_local: false,
        static_players : [],
        private_swf: null,
        private_video: null,
        private_settings: {
            id: 1720202,
            width: 400,
            height: 300
        },
        private_deferredCall: null,
        private_div : null,
        private_parent : null,
        private_options : null,
        private_environment : 'grabnetworks',
        private_optionsLoader : null,
        private_contentLoader : null,
        private_contentServer: 'http://content.grabnetworks.com/',
        private_defer: function( functionName, argument) {
            var _this = this;
            if( this._.swf){
                var deferredCall = function (){ _this._.swf[functionName](argument) };
                try {
                    deferredCall();
                } catch (e) {
                    this._.deferredCall = deferredCall;
                }
            }else{
                this._.deferredCall = { functionName: functionName, argument: argument };
            }
        },
        private_eventRouter: function(eventObject) {
            switch (eventObject.event) {
            case PlayerEvent.PLAYER_READY:
                if (this._.deferredCall) {
                    this._.deferredCall();
                    this._.deferredCall = null;
                }
                break;
            }
            this._.notify( new PlayerEvent( eventObject.event, eventObject.data ) );
          },
          private_playerID : '',
          private_onSWFObject : function ( swf ){
            if(swf.ref){
                this._.swf = swf.ref;
                this._.swf.style.visibility = this._.div.style.display || 'block';
                this._.swf.style.display = this._.div.style.visibility || 'visible' ;
                this.style = this._.swf.style;
            }else if( this._.div ){
                this._.contentServer = 'http://content.' + this._.environment + '.com';
                this._.loadOptions( this._.settings.id );
            }else{
                throw new Error( 'Error initializing playback engine. SWFObject did not create Flash Player, and there is no target div for a video tag.')
            }
        },
        private_loadOptions : function( id ){
            this._.optionsLoader = new JSONP( 'jsonp' );
            this._.optionsLoader.on( LoadingEvent.LOADED, this._.onOptionsLoaded);
            this._.optionsLoader.load(this._.contentServer + '/' + 'options/' + id + '.json');
        },
        private_onOptionsLoaded : function( event ){
_debug( 'Player._.onOptionsLoaded');
            var options = event.data;
			this._.options = options.grabnetworks;
			var guid = this._.settings.content || this._.options.content;
            this._.loadContent( guid );
        },
        private_loadContent : function( contentID ){
			var type;
			var guid;
			switch ( contentID.length ) {
				case 40:
					guid = contentID;
					type = 'v';
					break;
				case 41:
					guid = contentID.substr( 1 );
					type = contentID.substr( 0, 1 );
					break;
				default:
					throw new Error( 'Invalid GUID length' );
			}
            var fromPage = escape(global.location.href.toString());
            this._.contentLoader = new JSONP( 'jsonp' );
            this._.contentLoader.on( LoadingEvent.LOADED, this._.onContentLoaded );
            this._.contentLoader.load(  this._.contentServer + '/' +  type + '/' + guid + '?from=' + fromPage );
        },
        private_onContentLoaded: function ( event ){
            var content = event.data;
            content = ( content.videos ? content.videos[ 0 ] : content );// no playlists in HTML5 yet, grab first video.
            if( content.video.media.mobile ){
				if(!this._.video){
                    this._.video = document.createElement( 'video' );
                    this._.video.height = this._.settings.height;
                    this._.video.width = this._.settings.width;
                    this._.video.controls = 'controls';
                    this._.video.preload = 'auto';
                    this._.video.id = this._.playerID;
                    this._.video.style.visibility =  'block';
                    this._.video.style.display = 'visible' ;
				}
                this.style = this._.video.style;
                this._.video.autoplay =  ( this._.settings.autoPlay || this._.options.player.behavior.autoPlay ) ? 'autoplay': null;
                this._.div.appendChild( this._.video );
                this._.video.src = content.video.media.mobile.url;
            }else{
                this._.div.style.display = 'block';
                this._.div.style.textAlign = 'center';
                this._.div.style.verticalAlign = 'middle';
                this._.div.style.backgroundColor = '#a12a3d';
				this._.div.style.color= '#FFFFFF';
                this._.div.style.width = this._.settings.width + 'px';
                this._.div.style.height =  this._settings.height + 'px';
                this._.div.style.fontSize = 150 + 'px';
                this._.div.innerHTML= 'mobile?<br/>NOPE.';
            }
            if (typeof this._.onReady === 'function') {
                this._.onReady();
				delete this._.onReady;
            }
        },
        private_load : function ( guid ) {
            if(this._.video){
                this._.loadContent( guid );
            }else{
                this._swf.loadNewVideo( guid );
            }
        },
        private_play : function () {
            if(this._.video){
                this._.video.play();
            }else{
                this._swf.playVideo();
            }
        },
        private_pause : function () {
            if(this._.video){
                this._.video.pause();
            }else{
                this._swf.pauseVideo();
            }
        },
        private_stop : function () {
            if(this._.video){
                this.pauseVideo();
            } else {
                this._.swf.stopVideo();
            }
        }, 
        private_seek : function ( ms ){
            if(this._.video){
                this._.video.currentTime = ms * 0.001;
            }else{
                this._.swf.seekVideoToMS( ms );
            }
        },
        private_seekPercent : function ( pct ){
            if(this._.video){
                this._.seek( ( pct * 0.01 ) * ( this.videoTotalTime() * 0.001 ) );
            }else{
                this._.swf.seekVideoTo( pct );
            }
        },
        private_setVolume : function ( level ){
            if(this._.video){
                this._.video.volume = level * 0.01;
            }else{
                this._.swf.setVolume(level);
            }
        },
        Player : function ( settings ){
            if (settings.variant === '') {
				delete settings.variant;
			}//if
			settings = this._.settings = settings || this._.settings;
			var params = { allowScriptAccess: 'always', allowFullScreen: 'true', wmode: 'transparent', menu: 'false', bgcolor: '#000000', quality: 'high' };//params
			var env = settings.env || '';
			delete settings.env;
			var width = settings.width;
			delete settings.width;
			var height = settings.height;
			delete settings.height;
			var flashvars = settings;
			var id = settings.id;
			var namespace = 'Player.players[' + id + ']';
			var eventhandler = '_.eventRouter';
			flashvars.namespace = namespace;
			flashvars.eventhandler = eventhandler;
			this._.playerID = 'GrabPlayer' + settings.id;
            var divID = 'grabDiv' + id;
			this._.parent = settings.parent;
			var div = document.getElementById(divID );
            if( !div ){
                div = document.createElement( 'div' );
                div.id = divID;
                this._.parent.appendChild( div );
            }else{
                this._.parent = div.parentNode;   
            }
//			div.style.display = 'none';
//			div.style.visibility = 'hidden';
            this._.div = div;
            var attributes = { id: this._.playerID, name: this._.playerID };
//            if ( !settings.local && scriptInfo.host.indexOf('grabqa') > -1 ){
//                settings.tgt = settings.tgt || 'grabqa';
//                this._.environment = 'grabqa';
//            }
            var swfDir = ( settings.local ) ?  settings.local + '/'  : 'http://player.' + this._.environment + '.com/v5' + env + '/';
            swfobject.embedSWF( swfDir + 'Player.swf', this._.divID, width, height, '9.0.0', false, flashvars, params, attributes, this._.onSWFObject);
			Player.players[id] = this;
		},//Player
        hide : function () {
            this.style.display = 'none';
            this.style.visibility = 'hidden';
        },
        show : function () {
            this.style.visibility = 'visible';
            this.style.display = 'block';
        },
        loadNewVideo: function( guid ) {
            this._.defer( this._.load, guid );
        },
        toggleDebug: function() {
            this._.defer( 'toggleDebug' );
        },
        stopVideo: function() {
            this._.defer( this._.stop )
        },
        showEmbed: function() {
          this._.defer( 'showEmbed' );
        },
        hideEmbed: function() {
          this._.defer( 'hideEmbed' );
        },
        hideInfo: function() {
          this._.defer( 'hideInfo' );
        },
        showInfo: function() {
          this._.defer( 'showInfo' );
        },
        showSharing: function() {
          this._.defer( 'showSharing' );
        },
        hideSharing: function() {
          this._.defer( 'hideSharing' );
        },
        showEmail: function() {
          this._.defer( 'showEmail' );
        },
        hideEmail: function() {
          this._defer( 'hideEmail' );
        },
        pauseVideo: function() {
            this._.defer( this._.pause );
        },
        playVideo: function() {
            this._.defer( this._.play );
        },
        replayVideo: function() {
          this._.defer( 'replayVideo' );
        },
        seekVideoTo: function( percent ) {
          this._.defer( this._.seekPercent, percent );
        },
        seekVideoToMS: function( milliseconds ) {
          this._.defer( this._.seek, milliseconds );
        },
        setVolume: function(level) {
          this._.defer( this._.setVolume, level );
        },
        mute: function() {
          this._.defer( 'mute' );
        },
        skipAd: function() {
          this._.defer( 'skipAd' );
        },
        videoTotalTime: function() {
            if( this._.video){
                return this._.video.seekable.end() * 1000;
            }
            return this._.swf.videoTotalTime();
        },
        videoCurrentTime: function() {
          return this._.swf.videoCurrentTime();
        },
        videoTitleText: function() {
          return this._.swf.videoTitleText();
        },
        videoDescriptionText: function() {
          return this._.swf.videoDescriptionText();
        },
        videoSourceLogo: function() {
          return this._.swf.videoSourceLogo();
        },
        videoSourceURL: function() {
          return this._.swf.videoSourceURL();
        },
        videoInfo: function() {
          return this._.swf.videoInfo();
        }
	})
);