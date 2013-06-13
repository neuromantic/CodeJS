(function() {
  var g = void 0,
    i = !0,
    j = null,
    k = !1,
    r, aa = aa || {},
    s = this;

  function ba(a) {
    for (var a = a.split("."), b = s, c; c = a.shift();) {
      if (b[c] != j) {
        b = b[c]
      } else {
        return j
      }
    }
    return b
  }

  function ca() {}

  function da(a) {
    var b = typeof a;
    if ("object" == b) {
      if (a) {
        if (a instanceof Array) {
          return "array"
        }
        if (a instanceof Object) {
          return b
        }
        var c = Object.prototype.toString.call(a);
        if ("[object Window]" == c) {
          return "object"
        }
        if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
          return "array"
        }
        if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
          return "function"
        }
      } else {
        return "null"
      }
    } else {
      if ("function" == b && "undefined" == typeof a.call) {
        return "object"
      }
    }
    return b
  }

  function t(a) {
    return "array" == da(a)
  }

  function ea(a) {
    var b = da(a);
    return "array" == b || "object" == b && "number" == typeof a.length
  }

  function w(a) {
    return "string" == typeof a
  }

  function fa(a) {
    var b = typeof a;
    return "object" == b && a != j || "function" == b
  }

  function ga(a) {
    return a[ha] || (a[ha] = ++ia)
  }
  var ha = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36),
    ia = 0;

  function ja(a, b, c) {
    return a.call.apply(a.bind, arguments)
  }

  function ka(a, b, c) {
    if (!a) {
      throw Error();
    }
    if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);
      return function() {
        var c = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(c, d);
        return a.apply(b, c)
      }
    }
    return function() {
      return a.apply(b, arguments)
    }
  }

  function x(a, b, c) {
    x = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ja : ka;
    return x.apply(j, arguments)
  }
  var y = Date.now ||
  function() {
    return +new Date
  };

  function z(a, b) {
    var c = a.split("."),
      d = s;
    !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
    for (var f; c.length && (f = c.shift());) {
      !c.length && b !== g ? d[f] = b : d = d[f] ? d[f] : d[f] = {}
    }
  }

  function A(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.ta = b.prototype;
    a.prototype = new c
  };

  function la(a, b, c) {
    for (var d in a) {
      b.call(c, a[d], d, a)
    }
  }

  function ma(a) {
    var b = [],
      c = 0,
      d;
    for (d in a) {
      b[c++] = a[d]
    }
    return b
  }

  function na(a) {
    var b = [],
      c = 0,
      d;
    for (d in a) {
      b[c++] = d
    }
    return b
  }
  var oa = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");

  function pa(a, b) {
    for (var c, d, f = 1; f < arguments.length; f++) {
      d = arguments[f];
      for (c in d) {
        a[c] = d[c]
      }
      for (var e = 0; e < oa.length; e++) {
        c = oa[e], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
      }
    }
  };
  var qa = {
    Bb: "ended",
    Pb: "volumechange",
    Jb: "playing",
    ya: "pause",
    ga: "click",
    W: "error",
    wc: "stalled",
    vc: "loadeddata",
    yc: "touchstart"
  },
    ra = {
      Pb: "volumechange",
      Va: "mute",
      Ya: "unmute",
      Jb: "playing",
      Wa: "resume",
      ya: "pause",
      ga: "click",
      Bb: "ended",
      xc: "stopped",
      W: "error"
    };

  function B(a, b) {
    this.type = a;
    this.data = b || {}
  };

  function C(a, b) {
    this.errorCode = a;
    this.gb = b || ""
  };

  function sa(a) {
    this.stack = Error().stack || "";
    a && (this.message = "" + a)
  }
  A(sa, Error);
  sa.prototype.name = "CustomError";

  function ta(a, b) {
    for (var c = 1; c < arguments.length; c++) {
      var d = ("" + arguments[c]).replace(/\$/g, "$$$$"),
        a = a.replace(/\%s/, d)
    }
    return a
  }

  function D(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
  }
  var ua = /^[a-zA-Z0-9\-_.!~*'()]*$/;

  function va(a) {
    a = "" + a;
    return !ua.test(a) ? encodeURIComponent(a) : a
  }

  function wa(a) {
    if (!xa.test(a)) {
      return a
    } - 1 != a.indexOf("&") && (a = a.replace(ya, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(za, "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(Aa, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(Ba, "&quot;"));
    return a
  }
  var ya = /&/g,
    za = /</g,
    Aa = />/g,
    Ba = /\"/g,
    xa = /[&<>\"]/;

  function Ca(a, b) {
    for (var c = 0, d = D("" + a).split("."), f = D("" + b).split("."), e = Math.max(d.length, f.length), h = 0; 0 == c && h < e; h++) {
      var l = d[h] || "",
        n = f[h] || "",
        o = RegExp("(\\d*)(\\D*)", "g"),
        I = RegExp("(\\d*)(\\D*)", "g");
      do {
        var m = o.exec(l) || ["", "", ""],
          p = I.exec(n) || ["", "", ""];
        if (0 == m[0].length && 0 == p[0].length) {
          break
        }
        c = ((0 == m[1].length ? 0 : parseInt(m[1], 10)) < (0 == p[1].length ? 0 : parseInt(p[1], 10)) ? -1 : (0 == m[1].length ? 0 : parseInt(m[1], 10)) > (0 == p[1].length ? 0 : parseInt(p[1], 10)) ? 1 : 0) || ((0 == m[2].length) < (0 == p[2].length) ? -1 : (0 == m[2].length) > (0 == p[2].length) ? 1 : 0) || (m[2] < p[2] ? -1 : m[2] > p[2] ? 1 : 0)
      } while (0 == c)
    }
    return c
  };

  function Da(a, b) {
    b.unshift(a);
    sa.call(this, ta.apply(j, b));
    b.shift()
  }
  A(Da, sa);
  Da.prototype.name = "AssertionError";

  function Ea(a, b) {
    throw new Da("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  };
  var E = Array.prototype,
    Fa = E.indexOf ?
  function(a, b, c) {
    return E.indexOf.call(a, b, c)
  } : function(a, b, c) {
    c = c == j ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (w(a)) {
      return !w(b) || 1 != b.length ? -1 : a.indexOf(b, c)
    }
    for (; c < a.length; c++) {
      if (c in a && a[c] === b) {
        return c
      }
    }
    return -1
  }, Ga = E.forEach ?
  function(a, b, c) {
    E.forEach.call(a, b, c)
  } : function(a, b, c) {
    for (var d = a.length, f = w(a) ? a.split("") : a, e = 0; e < d; e++) {
      e in f && b.call(c, f[e], e, a)
    }
  }, Ha = E.filter ?
  function(a, b, c) {
    return E.filter.call(a, b, c)
  } : function(a, b, c) {
    for (var d = a.length, f = [], e = 0, h = w(a) ? a.split("") : a, l = 0; l < d; l++) {
      if (l in h) {
        var n = h[l];
        b.call(c, n, l, a) && (f[e++] = n)
      }
    }
    return f
  };

  function Ia(a) {
    return E.concat.apply(E, arguments)
  }

  function Ja(a) {
    if (t(a)) {
      return Ia(a)
    }
    for (var b = [], c = 0, d = a.length; c < d; c++) {
      b[c] = a[c]
    }
    return b
  }

  function Ka(a, b) {
    for (var c = 1; c < arguments.length; c++) {
      var d = arguments[c],
        f;
      if (t(d) || (f = ea(d)) && d.hasOwnProperty("callee")) {
        a.push.apply(a, d)
      } else {
        if (f) {
          for (var e = a.length, h = d.length, l = 0; l < h; l++) {
            a[e + l] = d[l]
          }
        } else {
          a.push(d)
        }
      }
    }
  }

  function La(a, b, c) {
    return 2 >= arguments.length ? E.slice.call(a, b) : E.slice.call(a, b, c)
  };

  function Ma(a) {
    if ("function" == typeof a.I) {
      return a.I()
    }
    if (w(a)) {
      return a.split("")
    }
    if (ea(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++) {
        b.push(a[d])
      }
      return b
    }
    return ma(a)
  }

  function Na(a) {
    if ("function" == typeof a.Q) {
      return a.Q()
    }
    if ("function" != typeof a.I) {
      if (ea(a) || w(a)) {
        for (var b = [], a = a.length, c = 0; c < a; c++) {
          b.push(c)
        }
        return b
      }
      return na(a)
    }
  }

  function Oa(a, b, c) {
    if ("function" == typeof a.forEach) {
      a.forEach(b, c)
    } else {
      if (ea(a) || w(a)) {
        Ga(a, b, c)
      } else {
        for (var d = Na(a), f = Ma(a), e = f.length, h = 0; h < e; h++) {
          b.call(c, f[h], d && d[h], a)
        }
      }
    }
  };

  function Pa(a, b) {
    this.w = {};
    this.h = [];
    var c = arguments.length;
    if (1 < c) {
      if (c % 2) {
        throw Error("Uneven number of arguments");
      }
      for (var d = 0; d < c; d += 2) {
        this.set(arguments[d], arguments[d + 1])
      }
    } else {
      if (a) {
        a instanceof Pa ? (c = a.Q(), d = a.I()) : (c = na(a), d = ma(a));
        for (var f = 0; f < c.length; f++) {
          this.set(c[f], d[f])
        }
      }
    }
  }
  r = Pa.prototype;
  r.b = 0;
  r.I = function() {
    Qa(this);
    for (var a = [], b = 0; b < this.h.length; b++) {
      a.push(this.w[this.h[b]])
    }
    return a
  };
  r.Q = function() {
    Qa(this);
    return this.h.concat()
  };
  r.u = function(a) {
    return Ra(this.w, a)
  };
  r.remove = function(a) {
    return Ra(this.w, a) ? (delete this.w[a], this.b--, this.h.length > 2 * this.b && Qa(this), i) : k
  };

  function Qa(a) {
    if (a.b != a.h.length) {
      for (var b = 0, c = 0; b < a.h.length;) {
        var d = a.h[b];
        Ra(a.w, d) && (a.h[c++] = d);
        b++
      }
      a.h.length = c
    }
    if (a.b != a.h.length) {
      for (var f = {}, c = b = 0; b < a.h.length;) {
        d = a.h[b], Ra(f, d) || (a.h[c++] = d, f[d] = 1), b++
      }
      a.h.length = c
    }
  }
  r.get = function(a, b) {
    return Ra(this.w, a) ? this.w[a] : b
  };
  r.set = function(a, b) {
    Ra(this.w, a) || (this.b++, this.h.push(a));
    this.w[a] = b
  };
  r.A = function() {
    return new Pa(this)
  };

  function Ra(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
  };
  var Sa, Ta, Ua, Va;

  function Wa() {
    return s.navigator ? s.navigator.userAgent : j
  }
  Va = Ua = Ta = Sa = k;
  var Xa;
  if (Xa = Wa()) {
    var Ya = s.navigator;
    Sa = 0 == Xa.indexOf("Opera");
    Ta = !Sa && -1 != Xa.indexOf("MSIE");
    Ua = !Sa && -1 != Xa.indexOf("WebKit");
    Va = !Sa && !Ua && "Gecko" == Ya.product
  }
  var Za = Sa,
    F = Ta,
    $a = Va,
    G = Ua,
    ab;
  a: {
    var bb = "",
      cb;
    if (Za && s.opera) {
      var db = s.opera.version,
        bb = "function" == typeof db ? db() : db
    } else {
      if ($a ? cb = /rv\:([^\);]+)(\)|;)/ : F ? cb = /MSIE\s+([^\);]+)(\)|;)/ : G && (cb = /WebKit\/(\S+)/), cb) {
        var eb = cb.exec(Wa()),
          bb = eb ? eb[1] : ""
      }
    }
    if (F) {
      var fb, gb = s.document;
      fb = gb ? gb.documentMode : g;
      if (fb > parseFloat(bb)) {
        ab = "" + fb;
        break a
      }
    }
    ab = bb
  }
  var hb = {};

  function H(a) {
    return hb[a] || (hb[a] = 0 <= Ca(ab, a))
  }
  var ib = {};

  function jb() {
    return ib[9] || (ib[9] = F && !! document.documentMode && 9 <= document.documentMode)
  };

  function kb(a) {
    return lb(a || arguments.callee.caller, [])
  }

  function lb(a, b) {
    var c = [];
    if (0 <= Fa(b, a)) {
      c.push("[...circular reference...]")
    } else {
      if (a && 50 > b.length) {
        c.push(mb(a) + "(");
        for (var d = a.arguments, f = 0; f < d.length; f++) {
          0 < f && c.push(", ");
          var e;
          e = d[f];
          switch (typeof e) {
          case "object":
            e = e ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            e = "" + e;
            break;
          case "boolean":
            e = e ? "true" : "false";
            break;
          case "function":
            e = (e = mb(e)) ? e : "[fn]";
            break;
          default:
            e = typeof e
          }
          40 < e.length && (e = e.substr(0, 40) + "...");
          c.push(e)
        }
        b.push(a);
        c.push(")\n");
        try {
          c.push(lb(a.caller, b))
        } catch (h) {
          c.push("[exception trying to get caller]\n")
        }
      } else {
        a ? c.push("[...long stack...]") : c.push("[end]")
      }
    }
    return c.join("")
  }

  function mb(a) {
    if (nb[a]) {
      return nb[a]
    }
    a = "" + a;
    if (!nb[a]) {
      var b = /function ([^\(]+)/.exec(a);
      nb[a] = b ? b[1] : "[Anonymous]"
    }
    return nb[a]
  }
  var nb = {};

  function ob(a, b, c, d, f) {
    this.reset(a, b, c, d, f)
  }
  ob.prototype.Ga = j;
  ob.prototype.Fa = j;
  var pb = 0;
  ob.prototype.reset = function(a, b, c, d, f) {
    "number" == typeof f || pb++;
    this.wb = d || y();
    this.K = a;
    this.mb = b;
    this.lb = c;
    delete this.Ga;
    delete this.Fa
  };
  ob.prototype.Pa = function(a) {
    this.K = a
  };

  function J(a) {
    this.ec = a
  }
  J.prototype.na = j;
  J.prototype.K = j;
  J.prototype.Da = j;
  J.prototype.$ = j;

  function K(a, b) {
    this.name = a;
    this.value = b
  }
  K.prototype.toString = function() {
    return this.name
  };
  var qb = new K("SHOUT", 1200),
    rb = new K("SEVERE", 1E3),
    sb = new K("WARNING", 900),
    tb = new K("INFO", 800),
    ub = new K("CONFIG", 700),
    vb = new K("FINE", 500),
    wb = new K("ALL", 0);
  r = J.prototype;
  r.getParent = function() {
    return this.na
  };
  r.Pa = function(a) {
    this.K = a
  };

  function xb(a) {
    if (a.K) {
      return a.K
    }
    if (a.na) {
      return xb(a.na)
    }
    Ea("Root logger has no level set.");
    return j
  }
  r.log = function(a, b, c) {
    if (a.value >= xb(this).value) {
      a = this.bc(a, b, c);
      b = "log:" + a.mb;
      s.console && (s.console.timeStamp ? s.console.timeStamp(b) : s.console.markTimeline && s.console.markTimeline(b));
      s.msWriteProfilerMark && s.msWriteProfilerMark(b);
      for (b = this; b;) {
        var c = b,
          d = a;
        if (c.$) {
          for (var f = 0, e = g; e = c.$[f]; f++) {
            e(d)
          }
        }
        b = b.getParent()
      }
    }
  };
  r.bc = function(a, b, c) {
    var d = new ob(a, "" + b, this.ec);
    if (c) {
      d.Ga = c;
      var f;
      var e = arguments.callee.caller;
      try {
        var h;
        var l = ba("window.location.href");
        if (w(c)) {
          h = {
            message: c,
            name: "Unknown error",
            lineNumber: "Not available",
            fileName: l,
            stack: "Not available"
          }
        } else {
          var n, o, I = k;
          try {
            n = c.lineNumber || c.Bc || "Not available"
          } catch (m) {
            n = "Not available", I = i
          }
          try {
            o = c.fileName || c.filename || c.sourceURL || l
          } catch (p) {
            o = "Not available", I = i
          }
          h = I || !c.lineNumber || !c.fileName || !c.stack ? {
            message: c.message,
            name: c.name,
            lineNumber: n,
            fileName: o,
            stack: c.stack || "Not available"
          } : c
        }
        f = "Message: " + wa(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + wa(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + wa(kb(e) + "-> ")
      } catch (q) {
        f = "Exception trying to expose exception! You win, we lose. " + q
      }
      d.Fa = f
    }
    return d
  };
  r.info = function(a, b) {
    this.log(tb, a, b)
  };

  function L(a, b) {
    a.log(vb, b, g)
  }
  var yb = {},
    zb = j;

  function Ab() {
    zb || (zb = new J(""), yb[""] = zb, zb.Pa(ub))
  }

  function M(a) {
    Ab();
    var b;
    if (!(b = yb[a])) {
      b = new J(a);
      var c = a.lastIndexOf("."),
        d = a.substr(c + 1),
        c = M(a.substr(0, c));
      c.Da || (c.Da = {});
      c.Da[d] = b;
      b.na = c;
      yb[a] = b
    }
    return b
  };

  function Bb() {}
  Bb.prototype.fb = k;
  Bb.prototype.p = function() {
    this.fb || (this.fb = i, this.r())
  };
  Bb.prototype.r = function() {
    this.Yb && Cb.apply(j, this.Yb)
  };

  function Cb(a) {
    for (var b = 0, c = arguments.length; b < c; ++b) {
      var d = arguments[b];
      ea(d) ? Cb.apply(j, d) : d && "function" == typeof d.p && d.p()
    }
  };
  !F || jb();
  var Db = !F || jb();
  F && H("8");
  !G || H("528");
  $a && H("1.9b") || F && H("8") || Za && H("9.5") || G && H("528");
  !$a || H("8");

  function N(a, b) {
    this.type = a;
    this.currentTarget = this.target = b
  }
  A(N, Bb);
  N.prototype.r = function() {
    delete this.type;
    delete this.target;
    delete this.currentTarget
  };
  N.prototype.R = k;
  N.prototype.pa = i;

  function Eb(a) {
    Eb[" "](a);
    return a
  }
  Eb[" "] = ca;

  function Fb(a, b) {
    a && this.init(a, b)
  }
  A(Fb, N);
  r = Fb.prototype;
  r.target = j;
  r.relatedTarget = j;
  r.offsetX = 0;
  r.offsetY = 0;
  r.clientX = 0;
  r.clientY = 0;
  r.screenX = 0;
  r.screenY = 0;
  r.button = 0;
  r.keyCode = 0;
  r.charCode = 0;
  r.ctrlKey = k;
  r.altKey = k;
  r.shiftKey = k;
  r.metaKey = k;
  r.init = function(a, b) {
    var c = this.type = a.type;
    N.call(this, c);
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    var d = a.relatedTarget;
    if (d) {
      if ($a) {
        var f;
        a: {
          try {
            Eb(d.nodeName);
            f = i;
            break a
          } catch (e) {}
          f = k
        }
        f || (d = j)
      }
    } else {
      "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
    }
    this.relatedTarget = d;
    this.offsetX = G || a.offsetX !== g ? a.offsetX : a.layerX;
    this.offsetY = G || a.offsetY !== g ? a.offsetY : a.layerY;
    this.clientX = a.clientX !== g ? a.clientX : a.pageX;
    this.clientY = a.clientY !== g ? a.clientY : a.pageY;
    this.screenX = a.screenX || 0;
    this.screenY = a.screenY || 0;
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.state = a.state;
    delete this.pa;
    delete this.R
  };
  r.r = function() {
    Fb.ta.r.call(this);
    this.relatedTarget = this.currentTarget = this.target = j
  };

  function Gb() {}
  var Hb = 0;
  r = Gb.prototype;
  r.key = 0;
  r.S = k;
  r.ab = k;
  r.init = function(a, b, c, d, f, e) {
    if ("function" == da(a)) {
      this.ib = i
    } else {
      if (a && a.handleEvent && "function" == da(a.handleEvent)) {
        this.ib = k
      } else {
        throw Error("Invalid listener argument");
      }
    }
    this.ba = a;
    this.pb = b;
    this.src = c;
    this.type = d;
    this.capture = !! f;
    this.Ia = e;
    this.ab = k;
    this.key = ++Hb;
    this.S = k
  };
  r.handleEvent = function(a) {
    return this.ib ? this.ba.call(this.Ia || this.src, a) : this.ba.handleEvent.call(this.ba, a)
  };
  var Ib = {},
    O = {},
    P = {},
    Jb = {};

  function Q(a, b, c, d, f) {
    if (b) {
      if (t(b)) {
        for (var e = 0; e < b.length; e++) {
          Q(a, b[e], c, d, f)
        }
      } else {
        var d = !! d,
          h = O;
        b in h || (h[b] = {
          b: 0,
          m: 0
        });
        h = h[b];
        d in h || (h[d] = {
          b: 0,
          m: 0
        }, h.b++);
        var h = h[d],
          l = ga(a),
          n;
        h.m++;
        if (h[l]) {
          n = h[l];
          for (e = 0; e < n.length; e++) {
            if (h = n[e], h.ba == c && h.Ia == f) {
              if (h.S) {
                break
              }
              return
            }
          }
        } else {
          n = h[l] = [], h.b++
        }
        e = Kb();
        e.src = a;
        h = new Gb;
        h.init(c, e, a, b, d, f);
        c = h.key;
        e.key = c;
        n.push(h);
        Ib[c] = h;
        P[l] || (P[l] = []);
        P[l].push(h);
        a.addEventListener ? (a == s || !a.eb) && a.addEventListener(b, e, d) : a.attachEvent(b in Jb ? Jb[b] : Jb[b] = "on" + b, e)
      }
    } else {
      throw Error("Invalid event type");
    }
  }

  function Kb() {
    var a = Lb,
      b = Db ?
    function(c) {
      return a.call(b.src, b.key, c)
    } : function(c) {
      c = a.call(b.src, b.key, c);
      if (!c) {
        return c
      }
    };
    return b
  }

  function Mb(a, b, c, d, f) {
    if (t(b)) {
      for (var e = 0; e < b.length; e++) {
        Mb(a, b[e], c, d, f)
      }
    } else {
      d = !! d;
      a: {
        e = O;
        if (b in e && (e = e[b], d in e && (e = e[d], a = ga(a), e[a]))) {
          a = e[a];
          break a
        }
        a = j
      }
      if (a) {
        for (e = 0; e < a.length; e++) {
          if (a[e].ba == c && a[e].capture == d && a[e].Ia == f) {
            Nb(a[e].key);
            break
          }
        }
      }
    }
  }

  function Nb(a) {
    if (Ib[a]) {
      var b = Ib[a];
      if (!b.S) {
        var c = b.src,
          d = b.type,
          f = b.pb,
          e = b.capture;
        c.removeEventListener ? (c == s || !c.eb) && c.removeEventListener(d, f, e) : c.detachEvent && c.detachEvent(d in Jb ? Jb[d] : Jb[d] = "on" + d, f);
        c = ga(c);
        f = O[d][e][c];
        if (P[c]) {
          var h = P[c],
            l = Fa(h, b);
          0 <= l && E.splice.call(h, l, 1);
          0 == h.length && delete P[c]
        }
        b.S = i;
        f.nb = i;
        Ob(d, e, c, f);
        delete Ib[a]
      }
    }
  }

  function Ob(a, b, c, d) {
    if (!d.ma && d.nb) {
      for (var f = 0, e = 0; f < d.length; f++) {
        d[f].S ? d[f].pb.src = j : (f != e && (d[e] = d[f]), e++)
      }
      d.length = e;
      d.nb = k;
      0 == e && (delete O[a][b][c], O[a][b].b--, 0 == O[a][b].b && (delete O[a][b], O[a].b--), 0 == O[a].b && delete O[a])
    }
  }

  function Pb(a) {
    var b, c = 0,
      d = b == j;
    b = !! b;
    if (a == j) {
      la(P, function(a) {
        for (var e = a.length - 1; 0 <= e; e--) {
          var f = a[e];
          if (d || b == f.capture) {
            Nb(f.key), c++
          }
        }
      })
    } else {
      if (a = ga(a), P[a]) {
        for (var a = P[a], f = a.length - 1; 0 <= f; f--) {
          var e = a[f];
          if (d || b == e.capture) {
            Nb(e.key), c++
          }
        }
      }
    }
  }

  function Qb(a, b, c, d, f) {
    var e = 1,
      b = ga(b);
    if (a[b]) {
      a.m--;
      a = a[b];
      a.ma ? a.ma++ : a.ma = 1;
      try {
        for (var h = a.length, l = 0; l < h; l++) {
          var n = a[l];
          n && !n.S && (e &= Rb(n, f) !== k)
        }
      } finally {
        a.ma--, Ob(c, d, b, a)
      }
    }
    return Boolean(e)
  }

  function Rb(a, b) {
    var c = a.handleEvent(b);
    a.ab && Nb(a.key);
    return c
  }

  function Lb(a, b) {
    if (!Ib[a]) {
      return i
    }
    var c = Ib[a],
      d = c.type,
      f = O;
    if (!(d in f)) {
      return i
    }
    var f = f[d],
      e, h;
    if (!Db) {
      e = b || ba("window.event");
      var l = i in f,
        n = k in f;
      if (l) {
        if (0 > e.keyCode || e.returnValue != g) {
          return i
        }
        a: {
          var o = k;
          if (0 == e.keyCode) {
            try {
              e.keyCode = -1;
              break a
            } catch (I) {
              o = i
            }
          }
          if (o || e.returnValue == g) {
            e.returnValue = i
          }
        }
      }
      o = new Fb;
      o.init(e, this);
      e = i;
      try {
        if (l) {
          for (var m = [], p = o.currentTarget; p; p = p.parentNode) {
            m.push(p)
          }
          h = f[i];
          h.m = h.b;
          for (var q = m.length - 1; !o.R && 0 <= q && h.m; q--) {
            o.currentTarget = m[q], e &= Qb(h, m[q], d, i, o)
          }
          if (n) {
            h = f[k];
            h.m = h.b;
            for (q = 0; !o.R && q < m.length && h.m; q++) {
              o.currentTarget = m[q], e &= Qb(h, m[q], d, k, o)
            }
          }
        } else {
          e = Rb(c, o)
        }
      } finally {
        m && (m.length = 0), o.p()
      }
      return e
    }
    d = new Fb(b, this);
    try {
      e = Rb(c, d)
    } finally {
      d.p()
    }
    return e
  };

  function R() {}
  A(R, Bb);
  r = R.prototype;
  r.eb = i;
  r.Oa = j;
  r.addEventListener = function(a, b, c, d) {
    Q(this, a, b, c, d)
  };
  r.removeEventListener = function(a, b, c, d) {
    Mb(this, a, b, c, d)
  };
  r.dispatchEvent = function(a) {
    var b = a.type || a,
      c = O;
    if (b in c) {
      if (w(a)) {
        a = new N(a, this)
      } else {
        if (a instanceof N) {
          a.target = a.target || this
        } else {
          var d = a,
            a = new N(b, this);
          pa(a, d)
        }
      }
      var d = 1,
        f, c = c[b],
        b = i in c,
        e;
      if (b) {
        f = [];
        for (e = this; e; e = e.Oa) {
          f.push(e)
        }
        e = c[i];
        e.m = e.b;
        for (var h = f.length - 1; !a.R && 0 <= h && e.m; h--) {
          a.currentTarget = f[h], d &= Qb(e, f[h], a.type, i, a) && a.pa != k
        }
      }
      if (k in c) {
        if (e = c[k], e.m = e.b, b) {
          for (h = 0; !a.R && h < f.length && e.m; h++) {
            a.currentTarget = f[h], d &= Qb(e, f[h], a.type, k, a) && a.pa != k
          }
        } else {
          for (f = this; !a.R && f && e.m; f = f.Oa) {
            a.currentTarget = f, d &= Qb(e, f, a.type, k, a) && a.pa != k
          }
        }
      }
      a = Boolean(d)
    } else {
      a = i
    }
    return a
  };
  r.r = function() {
    R.ta.r.call(this);
    Pb(this);
    this.Oa = j
  };
  var Sb = !F || jb(),
    Tb = !$a && !F || F && jb() || $a && H("1.9.1");
  F && H("9");
  var Ub = F || Za || G;

  function Vb(a, b) {
    var c;
    c = (c = a.className) && "function" == typeof c.split ? c.split(/\s+/) : [];
    var d = La(arguments, 1),
      f;
    f = c;
    for (var e = 0, h = 0; h < d.length; h++) {
      0 <= Fa(f, d[h]) || (f.push(d[h]), e++)
    }
    f = e == d.length;
    a.className = c.join(" ");
    return f
  };

  function Wb(a, b) {
    la(b, function(b, d) {
      "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Xb ? a.setAttribute(Xb[d], b) : 0 == d.lastIndexOf("aria-", 0) ? a.setAttribute(d, b) : a[d] = b
    })
  }
  var Xb = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    rowspan: "rowSpan",
    valign: "vAlign",
    height: "height",
    width: "width",
    usemap: "useMap",
    frameborder: "frameBorder",
    maxlength: "maxLength",
    type: "type"
  };

  function Yb(a, b, c) {
    var d = arguments,
      f = document,
      e = d[0],
      h = d[1];
    if (!Sb && h && (h.name || h.type)) {
      e = ["<", e];
      h.name && e.push(' name="', wa(h.name), '"');
      if (h.type) {
        e.push(' type="', wa(h.type), '"');
        var l = {};
        pa(l, h);
        h = l;
        delete h.type
      }
      e.push(">");
      e = e.join("")
    }
    e = f.createElement(e);
    h && (w(h) ? e.className = h : t(h) ? Vb.apply(j, [e].concat(h)) : Wb(e, h));
    2 < d.length && Zb(f, e, d);
    return e
  }

  function Zb(a, b, c) {
    function d(c) {
      c && b.appendChild(w(c) ? a.createTextNode(c) : c)
    }
    for (var f = 2; f < c.length; f++) {
      var e = c[f];
      ea(e) && !(fa(e) && 0 < e.nodeType) ? Ga($b(e) ? Ja(e) : e, d) : d(e)
    }
  }

  function ac(a) {
    a && a.parentNode && a.parentNode.removeChild(a)
  }

  function S(a) {
    return Tb && a.children != g ? a.children : Ha(a.childNodes, function(a) {
      return 1 == a.nodeType
    })
  }

  function $b(a) {
    if (a && "number" == typeof a.length) {
      if (fa(a)) {
        return "function" == typeof a.item || "string" == typeof a.item
      }
      if ("function" == da(a)) {
        return "function" == typeof a.item
      }
    }
    return k
  };
  var bc = {
    uc: "video/x-flv",
    Hb: "video/mp4",
    Qb: "video/webm",
    Ib: "video/ogg"
  },
    cc = {};
  cc.IOS = [bc.Hb, bc.Qb, bc.Ib];
  cc.android = ma(bc);
  cc.web = ma(bc);

  function dc(a, b, c) {
    this.height = b || window.innerHeight;
    this.width = a || window.innerWidth;
    this.tc = c || 1E4;
    this.muted = k
  }

  function ec(a, b, c) {
    this.error = {
      Xa: new C(400, "Unknown error"),
      Cb: new C(521, "Failed to play media files"),
      Ob: new C(522, "The video ad did not start before timed out"),
      Ua: new C(523, "Invalid ad container!")
    };
    this.ca = M("adaptv.vpaid.DomControl");
    this.xb = "ADAPTV_HTML5_MOBILEWEB_VIDEO";
    this.qa = c.videoSlot ? i : k;
    this.sb = i;
    if (this.qa) {
      this.a = c.videoSlot;
      this.$a = {};
      for (var d = 0; d < this.a.attributes.length; d++) {
        this.$a[this.a.attributes[d].name] = this.a.attributes[d].value
      }
      d = this.a;
      Ub ? d = d.parentElement : (d = d.parentNode, d = fa(d) && 1 == d.nodeType ? d : j);
      this.D = d
    } else {
      this.D = c.slot
    }
    this.Vb = c.clickThroughHtml || "<input type='button' value='click for more info' />";
    this.Xb = 1E3 * c.clickThroughTimeout || 3E3;
    this.U = new dc(a, b, 1E3 * c.videoTimeout);
    a = Wa().toLowerCase(); - 1 < a.search("iphone") ? (this.Z = "IOS", this.sb = k) : -1 < a.search("ipad") || -1 < a.search("ipod") ? this.Z = "IOS" : -1 < a.search("android") ? (this.Z = "android", this.Tb = 0 <= Ca(a.substr(a.indexOf("android"), 13).split(" ")[1], "4.1.0")) : this.Z = "web";
    this.sa = this.da = k
  }
  A(ec, R);

  function fc(a, b, c) {
    a.ra = b;
    a.Y = 0;
    a.ja = c;
    a.qa ? ((!a.a || !a.a.nodeName || "video" != a.a.nodeName.toLowerCase()) && a.dispatchEvent(new B("error", a.error.Ua)), Wb(a.a, {
      id: a.xb,
      preload: "auto",
      loop: k,
      src: a.ra[a.Y].url
    }), a.a.hasAttribute("controls") && a.a.removeAttribute("controls")) : ((!a.D || !a.D.nodeName || "div" != a.D.nodeName.toLowerCase()) && a.dispatchEvent(new B("error", a.error.Ua)), a.a = Yb("video", {
      id: a.xb,
      height: a.U.height,
      width: a.U.width,
      src: a.ra[a.Y].url
    }, document.createTextNode("HTML5 video is not supported here and hence this message!")), a.D.appendChild(a.a), a.X = Yb("a", {
      id: "clickThroughUrl"
    }), a.X.addEventListener("click", x(a.gc, a), i), a.X.innerHTML = a.Vb);
    la(qa, function(a) {
      this.a.addEventListener(a, x(this.fc, this), i)
    }, a);
    a.timeout = setTimeout(function() {
      a.dispatchEvent(new B("error", a.error.Ob))
    }, a.U.tc)
  }
  r = ec.prototype;
  r.fc = function(a) {
    switch (a.type) {
    case "stalled":
      if (this.Tb) {
        break
      };
    case "error":
      if (this.da) {
        break
      }
      this.Y++;
      this.Y < this.ra.length ? (Wb(this.a, {
        src: this.ra[this.Y].url
      }), this.a.load(), this.resume()) : this.dispatchEvent(new B("error", this.error.Cb));
      break;
    case "ended":
      this.dispatchEvent("ended");
      this.qa ? this.stop() : (ac(this.a), this.D.appendChild(this.X), this.Wb = setTimeout(x(function() {
        this.stop()
      }, this), this.Xb));
      break;
    case "volumechange":
      this.dispatchEvent("volumechange");
      this.a.muted ? (this.dispatchEvent("mute"), this.U.muted = i) : this.U.muted && (this.dispatchEvent("unmute"), this.U.muted = k);
      break;
    case "playing":
      this.da ? this.dispatchEvent("resume") : (clearTimeout(this.timeout), this.dispatchEvent("playing"), this.da = i);
      break;
    case "pause":
      this.da && !this.sa && this.dispatchEvent("pause");
      break;
    case "touchstart":
      if ("android" == this.Z) {
        break
      };
    case "click":
      this.a.paused ? this.resume() : this.da && !this.sa && this.sb && (this.pause(), this.dispatchEvent("click"), this.ja && window.open(this.ja, "_blank"))
    }
  };
  r.gc = function() {
    this.dispatchEvent("click");
    clearTimeout(this.Wb);
    ac(this.X);
    this.ja && window.open(this.ja, "_blank")
  };
  r.volume = function() {
    if (this.a) {
      return this.a.volume
    }
  };
  r.setVolume = function(a) {
    this.a && (this.a.volume = a)
  };
  r.elapsedTime = function() {
    if (this.a) {
      return this.a.currentTime
    }
  };
  r.duration = function() {
    if (this.a) {
      return this.a.duration
    }
  };
  r.pause = function() {
    this.a && this.a.pause()
  };
  r.resume = function() {
    this.a && this.a.play()
  };
  r.stop = function() {
    if (!this.sa) {
      this.sa = i;
      clearTimeout(this.timeout);
      if (this.qa) {
        try {
          this.a.removeAttribute("id"), this.a.removeAttribute("preload"), this.a.removeAttribute("loop"), this.a.removeAttribute("src"), Wb(this.a, this.$a), this.a.load(), this.a.play(), this.setVolume(1)
        } catch (a) {}
      } else {
        ac(this.a), ac(this.X)
      }
      this.dispatchEvent("stopped")
    }
  };

  function gc(a) {
    var b;
    b = document;
    b = b.querySelectorAll && b.querySelector && (!G || "CSS1Compat" == document.compatMode || H("528")) ? b.querySelectorAll("HEAD") : b.getElementsByTagName("HEAD");
    b = b[0];
    a = Yb("script", {
      type: "text/javascript",
      src: a
    });
    b.appendChild(a)
  };

  function hc(a, b) {
    this.depth = b;
    this.n = new ic;
    this.n.push(a)
  }

  function jc() {
    this.vb = "";
    this.f = [];
    this.o = []
  }

  function kc() {
    this.ua = "";
    this.f = [];
    this.o = []
  }

  function lc() {
    this.duration = 0;
    this.f = [];
    this.bb = "";
    this.Na = []
  }

  function mc() {
    this.width = this.height = this.Ba = 0;
    this.za = this.url = this.type = ""
  }

  function ic() {
    this.stack = []
  }
  ic.prototype.push = function(a) {
    this.stack.push(a)
  };
  ic.prototype.size = function() {
    return this.stack.length
  };

  function nc(a) {
    return oc(a) instanceof jc ? oc(a) : j
  }

  function oc(a) {
    a = a.stack;
    return !a || !a.length ? j : a[a.length - 1]
  }

  function pc() {
    this.f = [];
    this.F = {}
  }
  pc.prototype.add = function(a, b) {
    var c;
    a: {
      c = T;
      for (var d in c) {
        if (c[d] == a) {
          c = i;
          break a
        }
      }
      c = k
    }
    c && (this.f.push({
      zc: a,
      url: b
    }), this.F[a] = this.F[a] || [], this.F[a].push(b))
  };
  var T = {
    Ta: "impression",
    W: "error",
    Kb: "start",
    Db: "firstQuartile",
    Gb: "midpoint",
    Lb: "thirdQuartile",
    Ab: "complete",
    Va: "mute",
    Ya: "unmute",
    ya: "pause",
    Wa: "resume",
    ga: "click",
    Sa: "attempt"
  };
  var qc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");

  function rc(a, b) {
    var c;
    a instanceof rc ? (this.T(b == j ? a.s : b), sc(this, a.t), tc(this, a.N), uc(this, a.q), vc(this, a.B), wc(this, a.l), U(this, a.i.A()), xc(this, a.H)) : a && (c = ("" + a).match(qc)) ? (this.T( !! b), sc(this, c[1] || "", i), tc(this, c[2] || "", i), uc(this, c[3] || "", i), vc(this, c[4]), wc(this, c[5] || "", i), U(this, c[6] || "", i), xc(this, c[7] || "", i)) : (this.T( !! b), this.i = new yc(j, this, this.s))
  }
  r = rc.prototype;
  r.t = "";
  r.N = "";
  r.q = "";
  r.B = j;
  r.l = "";
  r.H = "";
  r.cc = k;
  r.s = k;
  r.toString = function() {
    if (this.k) {
      return this.k
    }
    var a = [];
    this.t && a.push(zc(this.t, Ac), ":");
    this.q && (a.push("//"), this.N && a.push(zc(this.N, Ac), "@"), a.push(w(this.q) ? encodeURIComponent(this.q) : j), this.B != j && a.push(":", "" + this.B));
    this.l && (this.q && "/" != this.l.charAt(0) && a.push("/"), a.push(zc(this.l, "/" == this.l.charAt(0) ? Bc : Cc)));
    var b = "" + this.i;
    b && a.push("?", b);
    this.H && a.push("#", zc(this.H, Dc));
    return this.k = a.join("")
  };
  r.oa = function(a) {
    var b = this.A(),
      c = !! a.t;
    c ? sc(b, a.t) : c = !! a.N;
    c ? tc(b, a.N) : c = !! a.q;
    c ? uc(b, a.q) : c = a.B != j;
    var d = a.l;
    if (c) {
      vc(b, a.B)
    } else {
      if (c = !! a.l) {
        if ("/" != d.charAt(0)) {
          if (this.q && !this.l) {
            d = "/" + d
          } else {
            var f = b.l.lastIndexOf("/"); - 1 != f && (d = b.l.substr(0, f + 1) + d)
          }
        }
        if (".." == d || "." == d) {
          d = ""
        } else {
          if (!(-1 == d.indexOf("./") && -1 == d.indexOf("/."))) {
            for (var f = 0 == d.lastIndexOf("/", 0), d = d.split("/"), e = [], h = 0; h < d.length;) {
              var l = d[h++];
              "." == l ? f && h == d.length && e.push("") : ".." == l ? ((1 < e.length || 1 == e.length && "" != e[0]) && e.pop(), f && h == d.length && e.push("")) : (e.push(l), f = i)
            }
            d = e.join("/")
          }
        }
      }
    }
    c ? wc(b, d) : c = "" !== a.i.toString();
    c ? (f = Ec(a), U(b, f, g)) : c = !! a.H;
    c && xc(b, a.H);
    return b
  };
  r.A = function() {
    var a = this.t,
      b = this.N,
      c = this.q,
      d = this.B,
      f = this.l,
      e = this.i.A(),
      h = this.H,
      l = new rc(j, this.s);
    a && sc(l, a);
    b && tc(l, b);
    c && uc(l, c);
    d && vc(l, d);
    f && wc(l, f);
    e && U(l, e);
    h && xc(l, h);
    return l
  };

  function sc(a, b, c) {
    V(a);
    delete a.k;
    a.t = c ? b ? decodeURIComponent(b) : "" : b;
    a.t && (a.t = a.t.replace(/:$/, ""))
  }

  function tc(a, b, c) {
    V(a);
    delete a.k;
    a.N = c ? b ? decodeURIComponent(b) : "" : b
  }

  function Fc(a) {
    return a.q
  }

  function uc(a, b, c) {
    V(a);
    delete a.k;
    a.q = c ? b ? decodeURIComponent(b) : "" : b
  }

  function vc(a, b) {
    V(a);
    delete a.k;
    if (b) {
      b = Number(b);
      if (isNaN(b) || 0 > b) {
        throw Error("Bad port number " + b);
      }
      a.B = b
    } else {
      a.B = j
    }
  }

  function wc(a, b, c) {
    V(a);
    delete a.k;
    a.l = c ? b ? decodeURIComponent(b) : "" : b
  }

  function U(a, b, c) {
    V(a);
    delete a.k;
    b instanceof yc ? (a.i = b, a.i.Qa = a, a.i.T(a.s)) : (c || (b = zc(b, Gc)), a.i = new yc(b, a, a.s))
  }

  function Ec(a) {
    a = a.i;
    a.P || (a.P = a.toString() ? decodeURIComponent(a.toString()) : "");
    return a.P
  }

  function xc(a, b, c) {
    V(a);
    delete a.k;
    a.H = c ? b ? decodeURIComponent(b) : "" : b
  }

  function V(a) {
    if (a.cc) {
      throw Error("Tried to modify a read-only Uri");
    }
  }
  r.T = function(a) {
    this.s = a;
    this.i && this.i.T(a);
    return this
  };

  function Hc(a) {
    return a instanceof rc ? a.A() : new rc(a, g)
  }
  var Ic = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;

  function zc(a, b) {
    var c = j;
    w(a) && (c = a, Ic.test(c) || (c = encodeURI(a)), 0 <= c.search(b) && (c = c.replace(b, Jc)));
    return c
  }

  function Jc(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
  }
  var Ac = /[#\/\?@]/g,
    Cc = /[\#\?:]/g,
    Bc = /[\#\?]/g,
    Gc = /[\#\?@]/g,
    Dc = /#/g;

  function yc(a, b, c) {
    this.v = a || j;
    this.Qa = b || j;
    this.s = !! c
  }

  function W(a) {
    if (!a.d && (a.d = new Pa, a.b = 0, a.v)) {
      for (var b = a.v.split("&"), c = 0; c < b.length; c++) {
        var d = b[c].indexOf("="),
          f = j,
          e = j;
        0 <= d ? (f = b[c].substring(0, d), e = b[c].substring(d + 1)) : f = b[c];
        f = decodeURIComponent(f.replace(/\+/g, " "));
        f = Kc(a, f);
        a.add(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
      }
    }
  }
  r = yc.prototype;
  r.d = j;
  r.b = j;
  r.add = function(a, b) {
    W(this);
    Lc(this);
    a = Kc(this, a);
    if (this.u(a)) {
      var c = this.d.get(a);
      t(c) ? c.push(b) : this.d.set(a, [c, b])
    } else {
      this.d.set(a, b)
    }
    this.b++;
    return this
  };
  r.remove = function(a) {
    W(this);
    a = Kc(this, a);
    if (this.d.u(a)) {
      Lc(this);
      var b = this.d.get(a);
      t(b) ? this.b -= b.length : this.b--;
      return this.d.remove(a)
    }
    return k
  };
  r.u = function(a) {
    W(this);
    a = Kc(this, a);
    return this.d.u(a)
  };
  r.Q = function() {
    W(this);
    for (var a = this.d.I(), b = this.d.Q(), c = [], d = 0; d < b.length; d++) {
      var f = a[d];
      if (t(f)) {
        for (var e = 0; e < f.length; e++) {
          c.push(b[d])
        }
      } else {
        c.push(b[d])
      }
    }
    return c
  };
  r.I = function(a) {
    W(this);
    if (a) {
      if (a = Kc(this, a), this.u(a)) {
        var b = this.d.get(a);
        if (t(b)) {
          return b
        }
        a = [];
        a.push(b)
      } else {
        a = []
      }
    } else {
      for (var b = this.d.I(), a = [], c = 0; c < b.length; c++) {
        var d = b[c];
        t(d) ? Ka(a, d) : a.push(d)
      }
    }
    return a
  };
  r.set = function(a, b) {
    W(this);
    Lc(this);
    a = Kc(this, a);
    if (this.u(a)) {
      var c = this.d.get(a);
      t(c) ? this.b -= c.length : this.b--
    }
    this.d.set(a, b);
    this.b++;
    return this
  };
  r.get = function(a, b) {
    W(this);
    a = Kc(this, a);
    if (this.u(a)) {
      var c = this.d.get(a);
      return t(c) ? c[0] : c
    }
    return b
  };
  r.toString = function() {
    if (this.v) {
      return this.v
    }
    if (!this.d) {
      return ""
    }
    for (var a = [], b = 0, c = this.d.Q(), d = 0; d < c.length; d++) {
      var f = c[d],
        e = va(f),
        f = this.d.get(f);
      if (t(f)) {
        for (var h = 0; h < f.length; h++) {
          0 < b && a.push("&"), a.push(e), "" !== f[h] && a.push("=", va(f[h])), b++
        }
      } else {
        0 < b && a.push("&"), a.push(e), "" !== f && a.push("=", va(f)), b++
      }
    }
    return this.v = a.join("")
  };

  function Lc(a) {
    delete a.P;
    delete a.v;
    a.Qa && delete a.Qa.k
  }
  r.A = function() {
    var a = new yc;
    this.P && (a.P = this.P);
    this.v && (a.v = this.v);
    this.d && (a.d = this.d.A());
    return a
  };

  function Kc(a, b) {
    var c = "" + b;
    a.s && (c = c.toLowerCase());
    return c
  }
  r.T = function(a) {
    a && !this.s && (W(this), Lc(this), Oa(this.d, function(a, c) {
      var d = c.toLowerCase();
      c != d && (this.remove(c), this.add(d, a))
    }, this));
    this.s = a
  };

  function Mc(a, b) {
    this.ca = M("adaptv.vpaid.BeaconPlugin");
    this.n = b.O[b.G].n;
    this.e = a;
    this.g = {};
    this.g.AdImpression = T.Ta;
    this.g.AdVideoStart = T.Kb;
    this.g.AdVideoFirstQuartile = T.Db;
    this.g.AdVideoMidpoint = T.Gb;
    this.g.AdVideoThirdQuartile = T.Lb;
    this.g.AdVideoComplete = T.Ab;
    this.g.AdPaused = T.ya;
    this.g.AdPlaying = T.Wa;
    this.g.AdClickThru = T.ga;
    this.g.attempt = T.Sa;
    this.g.error = T.W;
    this.g.mute = T.Va;
    this.g.unmute = T.Ya;
    Q(b, na(this.g), function(a) {
      var a = this.g[a.type],
        b = [],
        f = this.n.stack,
        e;
      for (e in f) {
        f[e] && f[e].f.F[a] && (b = b.concat(f[e].f.F[a])), f[e] && f[e].o && f[e].o[0] && f[e].o[0].f.F[a] && (b = b.concat(f[e].o[0].f.F[a]))
      }
      e = b;
      for (var h in e) {
        a = Hc(e[h]), a.i.u("playerRev") && (b = a, V(b), delete b.k, b.i.set("playerRev", "1450943")), b = Ec(a).replace(/{([\w.]*)}/g, ""), U(a, b, g), b = this.e, a = Yb("img", {
          id: "eventTrackingURL",
          src: a.toString(),
          width: 0,
          height: 0
        }), b.D.appendChild(a)
      }
    }, k, this)
  }
  A(Mc, Bb);

  function Nc(a, b) {
    this.la = a || 1;
    this.fa = b || Oc;
    this.Ca = x(this.rc, this);
    this.Ma = y()
  }
  A(Nc, R);
  Nc.prototype.enabled = k;
  var Oc = s.window;
  r = Nc.prototype;
  r.M = j;
  r.rc = function() {
    if (this.enabled) {
      var a = y() - this.Ma;
      0 < a && a < 0.8 * this.la ? this.M = this.fa.setTimeout(this.Ca, this.la - a) : (this.dispatchEvent(Pc), this.enabled && (this.M = this.fa.setTimeout(this.Ca, this.la), this.Ma = y()))
    }
  };
  r.start = function() {
    this.enabled = i;
    this.M || (this.M = this.fa.setTimeout(this.Ca, this.la), this.Ma = y())
  };
  r.stop = function() {
    this.enabled = k;
    this.M && (this.fa.clearTimeout(this.M), this.M = j)
  };
  r.r = function() {
    Nc.ta.r.call(this);
    this.stop();
    delete this.fa
  };
  var Pc = "tick";

  function Qc() {}
  Qc.prototype.ia = j;
  var Rc;

  function Sc() {}
  A(Sc, Qc);

  function Tc(a) {
    return (a = Uc(a)) ? new ActiveXObject(a) : new XMLHttpRequest
  }

  function Vc(a) {
    var b = {};
    Uc(a) && (b[0] = i, b[1] = i);
    return b
  }
  Sc.prototype.Ja = j;

  function Uc(a) {
    if (!a.Ja && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
      for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
        var d = b[c];
        try {
          return new ActiveXObject(d), a.Ja = d
        } catch (f) {}
      }
      throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }
    return a.Ja
  }
  Rc = new Sc;

  function Wc(a) {
    this.headers = new Pa;
    this.V = a || j
  }
  A(Wc, R);
  Wc.prototype.j = M("goog.net.XhrIo");
  var Xc = /^https?$/i;
  r = Wc.prototype;
  r.z = k;
  r.c = j;
  r.va = j;
  r.La = "";
  r.jb = "";
  r.aa = "";
  r.Ea = k;
  r.ka = k;
  r.Ka = k;
  r.J = k;
  r.ea = 0;
  r.L = j;
  r.rb = "";
  r.yb = k;
  r.send = function(a, b, c, d) {
    if (this.c) {
      throw Error("[goog.net.XhrIo] Object is active with another request");
    }
    b = b ? b.toUpperCase() : "GET";
    this.La = a;
    this.aa = "";
    this.jb = b;
    this.Ea = k;
    this.z = i;
    this.c = this.V ? Tc(this.V) : Tc(Rc);
    this.va = this.V ? this.V.ia || (this.V.ia = Vc(this.V)) : Rc.ia || (Rc.ia = Vc(Rc));
    this.c.onreadystatechange = x(this.ob, this);
    try {
      L(this.j, X(this, "Opening Xhr")), this.Ka = i, this.c.open(b, a, i), this.Ka = k
    } catch (f) {
      L(this.j, X(this, "Error opening Xhr: " + f.message));
      Yc(this, f);
      return
    }
    var a = c || "",
      e = this.headers.A();
    d && Oa(d, function(a, b) {
      e.set(b, a)
    });
    "POST" == b && !e.u("Content-Type") && e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    Oa(e, function(a, b) {
      this.c.setRequestHeader(b, a)
    }, this);
    this.rb && (this.c.responseType = this.rb);
    "withCredentials" in this.c && (this.c.withCredentials = this.yb);
    try {
      this.L && (Oc.clearTimeout(this.L), this.L = j), 0 < this.ea && (L(this.j, X(this, "Will abort after " + this.ea + "ms if incomplete")), this.L = Oc.setTimeout(x(this.sc, this), this.ea)), L(this.j, X(this, "Sending request")), this.ka = i, this.c.send(a), this.ka = k
    } catch (h) {
      L(this.j, X(this, "Send error: " + h.message)), Yc(this, h)
    }
  };
  r.sc = function() {
    "undefined" != typeof aa && this.c && (this.aa = "Timed out after " + this.ea + "ms, aborting", L(this.j, X(this, this.aa)), this.dispatchEvent("timeout"), this.abort(8))
  };

  function Yc(a, b) {
    a.z = k;
    a.c && (a.J = i, a.c.abort(), a.J = k);
    a.aa = b;
    Zc(a);
    $c(a)
  }

  function Zc(a) {
    a.Ea || (a.Ea = i, a.dispatchEvent("complete"), a.dispatchEvent("error"))
  }
  r.abort = function() {
    this.c && this.z && (L(this.j, X(this, "Aborting")), this.z = k, this.J = i, this.c.abort(), this.J = k, this.dispatchEvent("complete"), this.dispatchEvent("abort"), $c(this))
  };
  r.r = function() {
    this.c && (this.z && (this.z = k, this.J = i, this.c.abort(), this.J = k), $c(this, i));
    Wc.ta.r.call(this)
  };
  r.ob = function() {
    !this.Ka && !this.ka && !this.J ? this.hc() : ad(this)
  };
  r.hc = function() {
    ad(this)
  };

  function ad(a) {
    if (a.z && "undefined" != typeof aa) {
      if (a.va[1] && 4 == bd(a) && 2 == cd(a)) {
        L(a.j, X(a, "Local request error detected and ignored"))
      } else {
        if (a.ka && 4 == bd(a)) {
          Oc.setTimeout(x(a.ob, a), 0)
        } else {
          if (a.dispatchEvent("readystatechange"), 4 == bd(a)) {
            L(a.j, X(a, "Request complete"));
            a.z = k;
            var b = cd(a),
              c;
            a: {
              switch (b) {
              case 200:
                ;
              case 201:
                ;
              case 202:
                ;
              case 204:
                ;
              case 304:
                ;
              case 1223:
                c = i;
                break a;
              default:
                c = k
              }
            }
            if (!c) {
              if (b = 0 === b) {
                b = ("" + a.La).match(qc)[1] || j, !b && self.location && (b = self.location.protocol, b = b.substr(0, b.length - 1)), b = !Xc.test(b ? b.toLowerCase() : "")
              }
              c = b
            }
            if (c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            } else {
              var d;
              try {
                d = 2 < bd(a) ? a.c.statusText : ""
              } catch (f) {
                L(a.j, "Can not get status: " + f.message), d = ""
              }
              a.aa = d + " [" + cd(a) + "]";
              Zc(a)
            }
            $c(a)
          }
        }
      }
    }
  }

  function $c(a, b) {
    if (a.c) {
      var c = a.c,
        d = a.va[0] ? ca : j;
      a.c = j;
      a.va = j;
      a.L && (Oc.clearTimeout(a.L), a.L = j);
      b || a.dispatchEvent("ready");
      try {
        c.onreadystatechange = d
      } catch (f) {
        a.j.log(rb, "Problem encountered resetting onreadystatechange: " + f.message, g)
      }
    }
  }

  function bd(a) {
    return a.c ? a.c.readyState : 0
  }

  function cd(a) {
    try {
      return 2 < bd(a) ? a.c.status : -1
    } catch (b) {
      return a.j.log(sb, "Can not get status: " + b.message, g), -1
    }
  }

  function X(a, b) {
    return b + " [" + a.jb + " " + a.La + " " + cd(a) + "]"
  };
  var dd = ["ads.adap.tv", "t-ads.adap.tv", "u-ads.adap.tv"];

  function ed(a, b, c) {
    this.error = {
      Xa: new C(400, "Unknown error"),
      wa: new C(401, "Failed to get response for Ad tag request!"),
      zb: new C(402, "Invalid Ad tag response!")
    };
    this.url = a;
    this.depth = b + 1;
    this.ha = c;
    this.Ra = [];
    this.ca = M("adaptv.vpaid.Resolver")
  }
  A(ed, R);
  ed.prototype.oa = function() {
    this.C = new Wc;
    this.C.ea = Math.max(0, this.ha);
    this.C.yb = 0 <= dd.indexOf(Fc(Hc(this.url)));
    Q(this.C, ["success", "error", "timeout"], this.ic, k, this);
    var a = Hc(this.url),
      b = Ec(a).replace(/{([\w.]*)}/g, "");
    U(a, b, g);
    this.C.send(a.toString())
  };
  ed.prototype.ic = function(a) {
    switch (a.type) {
    case "success":
      var b;
      a = this.C;
      try {
        b = a.c ? a.c.responseXML : j
      } catch (c) {
        L(a.j, "Can not get responseXML: " + c.message), b = j
      }
      if (b) {
        var a = [],
          d = b.getElementsByTagName("VAST")[0];
        if (d) {
          if (b = "true" == d.getAttribute("adaptvFailover"), d = S(d), b) {
            for (b = 0; b < d.length; b++) {
              a.push(fd(d[b]))
            }
          } else {
            a.push(fd(d[0]))
          }
        }
      } else {
        a = g
      }
      this.Ra.push(a);
      this.C.p();
      !a || !a.length ? this.dispatchEvent(new B("error", this.error.wa)) : this.depth == this.Ra.length || a[0] instanceof jc ? this.dispatchEvent(new B("done", this.Ra)) : (a = a[0]) && a.ua ? (this.url = a.ua, this.oa()) : this.dispatchEvent(new B("error", this.error.wa));
      break;
    case "error":
      this.C.p();
      this.dispatchEvent(new B("error", this.error.wa));
      break;
    case "timeout":
      this.C.p(), this.dispatchEvent(new B("error", this.error.zb))
    }
  };

  function fd(a) {
    if (a) {
      for (var a = S(a), b = 0; b < a.length; b++) {
        var c = a[b];
        switch (c.nodeName) {
        case "InLine":
          if (b = c) {
            a = new jc;
            a.f = new pc;
            b = S(b);
            for (c = 0; c < b.length; c++) {
              var d = b[c];
              switch (d.nodeName) {
              case "Survey":
                a.vb = d.textContent;
                break;
              case "Error":
                a.f.add(T.W, D(d.textContent));
                break;
              case "Attempt":
                a.f.add(T.Sa, D(d.textContent));
                break;
              case "Impression":
                gd(d, a);
                break;
              case "Creatives":
                hd(d, a)
              }
            }
          } else {
            a = g
          }
          return a;
        case "Wrapper":
          if (b = c) {
            a = new kc;
            a.f = new pc;
            b = S(b);
            for (c = 0; c < b.length; c++) {
              switch (d = b[c], d.nodeName) {
              case "VASTAdTagURI":
                a.ua = d.textContent;
                break;
              case "Error":
                a.f.add(T.W, D(d.textContent));
                break;
              case "Impression":
                gd(d, a);
                break;
              case "Creatives":
                hd(d, a)
              }
            }
          } else {
            a = g
          }
          return a
        }
      }
    }
  }

  function gd(a, b) {
    if (a) {
      var c = a.textContent;
      c && (c = D(c), b.f.add(T.Ta, c))
    }
  }

  function hd(a, b) {
    if (a) {
      b.o = [];
      for (var c = S(a), d = 0; d < c.length; d++) {
        var f = c[d];
        if ("Creative" == f.nodeName) {
          var e = b.o;
          if (f) {
            for (var f = S(f), h = 0; h < f.length; h++) {
              var l = f[h];
              if ("Linear" == l.nodeName) {
                var n = l,
                  l = e;
                if (n) {
                  var o = new lc;
                  o.f = new pc;
                  for (var n = S(n), I = 0; I < n.length; I++) {
                    var m = n[I];
                    switch (m.nodeName) {
                    case "Duration":
                      o.duration = m.textContent;
                      break;
                    case "TrackingEvents":
                      var p = o;
                      if (m) {
                        for (var m = S(m), q = 0; q < m.length; q++) {
                          var u = m[q];
                          if ("Tracking" == u.nodeName) {
                            var v = u.getAttribute("event");
                            0 <= ma(T).indexOf(v) && p.f.add(v, D(u.textContent))
                          }
                        }
                      }
                      break;
                    case "VideoClicks":
                      p = o;
                      if (m) {
                        m = S(m);
                        for (q = 0; q < m.length; q++) {
                          switch (u = m[q], u.nodeName) {
                          case "ClickThrough":
                            p.bb = u.textContent;
                            break;
                          case "ClickTracking":
                            p.f.add(T.ga, D(u.textContent))
                          }
                        }
                      }
                      break;
                    case "MediaFiles":
                      if (p = o, m) {
                        p.Na = [];
                        m = S(m);
                        for (q = 0; q < m.length; q++) {
                          if (v = m[q], "MediaFile" == v.nodeName) {
                            u = new mc;
                            u.Ba = v.getAttribute("bitrate");
                            u.Ac = v.getAttribute("delivery");
                            u.width = v.getAttribute("width");
                            u.height = v.getAttribute("height");
                            u.type = v.getAttribute("type");
                            u.za = v.getAttribute("apiFramework");
                            if (v = v.textContent) {
                              v = D(v), u.url = v
                            }
                            0 == u.url.indexOf("http") && p.Na.push(u)
                          }
                        }
                      }
                    }
                  }
                  l.push(o)
                }
              }
            }
          }
        }
      }
    }
  };

  function Y() {
    this.error = {
      Xa: new C(400, "Unknown error"),
      xa: new C(411, "Invalid Ad tag response!"),
      Nb: new C(412, "The video format is not playable!"),
      Mb: new C(413, "Too many VAST wrappers to request!"),
      Fb: new C(514, "Ad slot is not defined!"),
      Eb: new C(515, "Ad-tag url or the publisherId is not passed in params!")
    };
    this.O = [];
    this.G = 0;
    this.Aa = j;
    this.ca = M("adaptv.vpaid.VPAIDAd")
  }
  A(Y, R);
  r = Y.prototype;
  r.load = function() {
    var a = this.O[this.G];
    if (a && nc(a.n) != j) {
      this.Ub = new Mc(this.e, this);
      this.dispatchEvent("attempt");
      var b = id(this, nc(a.n));
      b && b.length ? (Q(this.e, ma(ra), this.jc, k, this), fc(this.e, b, nc(a.n).o[0].bb), this.dispatchEvent("AdLoaded")) : Z(this, this.error.Nb)
    } else {
      a.depth > a.n.size() ? (b = oc(a.n), a = new ed(b ? b.ua : "", a.depth, this.ha), Q(a, ["done", "error"], function(a) {
        switch (a.type) {
        case "done":
          a = a.data;
          if (!a && !a.length) {
            Z(this, this.error.xa)
          } else {
            for (var b in a) {
              if (!a[b] || !a[b].length) {
                Z(this, this.error.xa);
                return
              }
              this.O[this.G].n.push(a[b][0])
            }
            this.load()
          }
          break;
        case "error":
          Z(this, a.data)
        }
      }, k, this), a.oa()) : Z(this, this.error.Mb)
    }
  };

  function Z(a, b) {
    a.dispatchEvent("error");
    a.ca.info(b.gb);
    a.G++;
    a.O && 500 > b.errorCode && 7 > a.G && a.G < a.O.length ? a.load() : (a.dispatchEvent(new B("AdError", {
      errorCode: b.errorCode,
      errorMessage: b.gb
    })), a.stopAd())
  }

  function id(a, b) {
    var c = [];
    if (b && b.o && b.o.length) {
      var d = b.o[0].Na;
      if (d && d.length) {
        for (var f in d) {
          d[f].type in cc[a.e.Z] || d[f].za && "vpaid" == d[f].za.toLowerCase() || c.push(d[f])
        }
      }
    }
    c.sort(function(a, b) {
      return parseInt(a.Ba, 10) - parseInt(b.Ba, 10)
    });
    return c
  }
  r.jc = function(a) {
    this.ca.info(a.type);
    switch (a.type) {
    case "playing":
      this.dispatchEvent("AdVideoStart");
      this.dispatchEvent("AdImpression");
      break;
    case "pause":
      this.dispatchEvent("AdPaused");
      break;
    case "resume":
      this.dispatchEvent("AdPlaying");
      break;
    case "click":
      this.dispatchEvent("AdClickThru");
      break;
    case "ended":
      this.dispatchEvent("AdVideoComplete");
      break;
    case "stopped":
      Pb(this.e);
      this.dispatchEvent("AdStopped");
      this.reset();
      break;
    case "error":
      Z(this, a.data);
      break;
    default:
      this.dispatchEvent(a)
    }
  };
  r.reset = function() {
    this.e.p();
    this.Ub.p();
    this.p()
  };

  function jd(a) {
    if (a.Za) {
      var b = new ed(a.Za, 0, a.ha);
      Q(b, ["done", "error"], function(a) {
        switch (a.type) {
        case "done":
          a = a.data;
          if (!a && !a.length) {
            Z(this, this.error.xa)
          } else {
            this.Aa = a[0];
            for (var b in this.Aa) {
              this.O.push(new hc(this.Aa[b], this.dc))
            }
            this.load()
          }
          break;
        case "error":
          Z(this, a.data)
        }
      }, k, a);
      b.oa()
    } else {
      Z(a, a.error.Eb)
    }
  }
  r.ac = function() {
    return this.e.volume()
  };
  r.mc = function(a) {
    this.e.setVolume(a)
  };
  r.$b = function() {
    return this.e.duration() - this.e.elapsedTime()
  };
  r.initAd = function(a, b, c, d, f, e) {
    !e.slot && !e.videoSlot || e.slot && e.videoSlot ? Z(this, this.error.Fb) : (this.ha = 1E3 * e.adTagTimeout || 1E4, this.dc = parseInt(e.maxWrapperLevels, 10) || 5, this.e = new ec(a, b, e), a = Hc(f.adTagUrl), a.i.get("cb") || (b = Math.floor(100 * Math.random()), V(a), delete a.k, a.i.set("cb", b)), this.Za = a.toString());
    jd(this)
  };
  r.startAd = function() {
    if (!this.Rb) {
      this.Rb = i;
      var a = nc(this.O[this.G].n),
        b = "";
      a && (b = a.vb);
      b && 0 <= b.indexOf(".js") && gc(b);
      this.resumeAd();
      this.dispatchEvent("AdStarted");
      var c = ["AdVideoFirstQuartile", "AdVideoMidpoint", "AdVideoThirdQuartile"],
        d = 1,
        f = new Nc(500);
      f.start();
      Q(f, Pc, function() {
        this.e.duration() && this.e.duration() == this.e.elapsedTime() ? (f.stop(), f.p(), f = j) : 4 * (this.e.elapsedTime() / this.e.duration()) > d && (this.dispatchEvent(c[d - 1]), d++)
      }, k, this)
    }
  };
  r.pauseAd = function() {
    this.e.pause()
  };
  r.resumeAd = function() {
    this.e.resume()
  };
  r.stopAd = function() {
    this.e.stop()
  };

  function kd() {
    this.qb = y()
  }
  var ld = new kd;
  kd.prototype.set = function(a) {
    this.qb = a
  };
  kd.prototype.reset = function() {
    this.set(y())
  };
  kd.prototype.get = function() {
    return this.qb
  };

  function md(a) {
    this.kc = a || "";
    this.qc = ld
  }
  r = md.prototype;
  r.tb = i;
  r.oc = i;
  r.nc = i;
  r.ub = k;
  r.pc = k;

  function nd(a) {
    return 10 > a ? "0" + a : "" + a
  }

  function od(a, b) {
    var c = (a.wb - b) / 1E3,
      d = c.toFixed(3),
      f = 0;
    if (1 > c) {
      f = 2
    } else {
      for (; 100 > c;) {
        f++, c *= 10
      }
    }
    for (; 0 < f--;) {
      d = " " + d
    }
    return d
  }

  function pd(a) {
    md.call(this, a)
  }
  A(pd, md);

  function qd() {
    this.lc = x(this.Sb, this);
    this.Ha = new pd;
    this.Ha.tb = k;
    this.hb = this.Ha.ub = k;
    this.kb = "";
    this.Zb = {}
  }
  qd.prototype.Sb = function(a) {
    if (!this.Zb[a.lb]) {
      var b;
      b = this.Ha;
      var c = [];
      c.push(b.kc, " ");
      if (b.tb) {
        var d = new Date(a.wb);
        c.push("[", nd(d.getFullYear() - 2E3) + nd(d.getMonth() + 1) + nd(d.getDate()) + " " + nd(d.getHours()) + ":" + nd(d.getMinutes()) + ":" + nd(d.getSeconds()) + "." + nd(Math.floor(d.getMilliseconds() / 10)), "] ")
      }
      b.oc && c.push("[", od(a, b.qc.get()), "s] ");
      b.nc && c.push("[", a.lb, "] ");
      b.pc && c.push("[", a.K.name, "] ");
      c.push(a.mb, "\n");
      b.ub && a.Ga && c.push(a.Fa, "\n");
      b = c.join("");
      if ($ && $.firebug) {
        switch (a.K) {
        case qb:
          $.info(b);
          break;
        case rb:
          $.error(b);
          break;
        case sb:
          $.warn(b);
          break;
        default:
          $.debug(b)
        }
      } else {
        $ ? $.log(b) : window.opera ? window.opera.postError(b) : this.kb += b
      }
    }
  };
  var $ = window.console;
  z("__adaptv__.debug.configure", function(a, b) {
    M(a).Pa(b || wb);
    var c = new qd;
    if (i != c.hb) {
      Ab();
      var d = zb,
        f = c.lc;
      d.$ || (d.$ = []);
      d.$.push(f);
      c.hb = i
    }
  });
  z("__adaptv__.debug.log", function(a) {
    M("adaptv.page").info(a)
  });
  z("__adaptv__.vpaid.VPAIDEvent", {
    AdLoaded: "AdLoaded",
    AdStarted: "AdStarted",
    AdStopped: "AdStopped",
    AdImpression: "AdImpression",
    AdVideoStart: "AdVideoStart",
    AdVideoFirstQuartile: "AdVideoFirstQuartile",
    AdVideoMidpoint: "AdVideoMidpoint",
    AdVideoThirdQuartile: "AdVideoThirdQuartile",
    AdVideoComplete: "AdVideoComplete",
    AdClickThru: "AdClickThru",
    AdPaused: "AdPaused",
    AdPlaying: "AdPlaying",
    AdError: "AdError"
  });
  z("__adaptv__.vpaid.constructAdTag", function(a, b, c) {
    var d = j;
    if (a && a.length) {
      var d = Hc(a),
        f;
      for (f in c) {
        b["ctx." + f] = c[f]
      }
      b.pet = b.pet || "preroll";
      b.creativeType = b.creativeType || "vast_video";
      b.cb = b.cb || Math.floor(100 * Math.random());
      b["a.sdk"] = "adaptv";
      b["a.sdkType"] = "js";
      b["a.vpaid"] = 0;
      a = d;
      c = Na(b);
      if ("undefined" == typeof c) {
        throw Error("Keys are undefined");
      }
      b = Ma(b);
      if (c.length != b.length) {
        throw Error("Mismatched lengths for keys/values");
      }
      f = new yc(j, g, g);
      for (var e = 0; e < c.length; e++) {
        f.add(c[e], b[e])
      }
      U(a, f)
    }
    return d ? d.toString() : d
  });
  z("__adaptv__.vpaid.VPAIDAd", Y);
  z("__adaptv__.vpaid.VPAIDAd.prototype.subscribe", Y.prototype.addEventListener);
  z("__adaptv__.vpaid.VPAIDAd.prototype.initAd", Y.prototype.initAd);
  z("__adaptv__.vpaid.VPAIDAd.prototype.startAd", Y.prototype.startAd);
  z("__adaptv__.vpaid.VPAIDAd.prototype.pauseAd", Y.prototype.pauseAd);
  z("__adaptv__.vpaid.VPAIDAd.prototype.resumeAd", Y.prototype.resumeAd);
  z("__adaptv__.vpaid.VPAIDAd.prototype.stopAd", Y.prototype.stopAd);
  z("__adaptv__.vpaid.VPAIDAd.prototype.getAdVolume", Y.prototype.ac);
  z("__adaptv__.vpaid.VPAIDAd.prototype.setAdVolume", Y.prototype.mc);
  z("__adaptv__.vpaid.VPAIDAd.prototype.getAdRemainingTime", Y.prototype.$b);
})();