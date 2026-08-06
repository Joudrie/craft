/* Friendspace — a different broken scrollbar for every stratum.
 *
 * The native scrollbar is replaced throughout. Which replacement you get depends
 * on where you are, so the strata have their own navigation defects the way they
 * have their own type and colour.
 *
 *   gravity    feed        the thumb has mass and sags; throw it and it bounces
 *   soap       legal       it squirts out from under the cursor; drag slowly
 *   tape       sign-up     a retracting tape measure — let go and it snaps home
 *   centipede  profiles    eight segments with staggered lag; the page follows the last
 *   win95      settings    3px wide, and both arrow buttons point the wrong way
 *   wrongside  awards      on the left, in rainbow, for no reason
 *
 * The rule that keeps all of them toys: they only misbehave when you are using
 * THEM. The wheel, the keyboard and touch scrolling always work normally, and
 * gravity additionally yields for a grace period after any of those. Design
 * Notes suspends everything, because that panel is meant to be readable.
 */
(function (global) {
  "use strict";

  var GRAV = 0.055, DAMP = 0.994, BOUNCE = -0.34, MAXV = 26, GRACE = 1500;

  var mode = "gravity", vel = 0, grabbed = false, graceUntil = 0, tiltG = null;
  var track, thumb, segs = [], raf = null, flingFrom = null, slip = 0, retracting = false;

  function docMax(){
    return Math.max(0, document.documentElement.scrollHeight - global.innerHeight);
  }
  function pct(){ var m = docMax(); return m <= 0 ? 0 : global.scrollY / m; }
  function notesOpen(){ return !!(global.FS && FS.Notes && FS.Notes.isOn && FS.Notes.isOn()); }

  var CSS = [
    "html{scrollbar-width:none;-ms-overflow-style:none}",
    "html::-webkit-scrollbar{display:none}",

    "#fs-sb{position:fixed;top:0;bottom:0;right:0;width:15px;z-index:9500;",
      "background:linear-gradient(90deg,rgba(0,0,0,.05),rgba(0,0,0,.11));",
      "border-left:1px solid rgba(0,0,0,.13)}",
    "#fs-sb-thumb{position:absolute;left:2px;right:2px;border-radius:6px;",
      "background:linear-gradient(180deg,#6d84b4,#3b5998 55%,#2b4278);border:1px solid #29487d;",
      "box-shadow:inset 0 1px 0 rgba(255,255,255,.35);cursor:grab;touch-action:none}",
    "#fs-sb-thumb:active{cursor:grabbing}",
    "#fs-sb-thumb.fast{background:linear-gradient(180deg,#e8b04b,#d6772b 60%,#b8541c);border-color:#8a3d12}",

    /* soap */
    "#fs-sb.soap #fs-sb-thumb{background:linear-gradient(180deg,#bfe8ff,#7fc4e8 55%,#4c9ec4);",
      "border-color:#3d87ab;border-radius:9px}",

    /* tape measure */
    "#fs-sb.tape #fs-sb-thumb{background:linear-gradient(180deg,#ffe680,#f5c518 55%,#d9a406);",
      "border-color:#b8890b;border-radius:2px}",
    "#fs-sb.tape{background:repeating-linear-gradient(180deg,rgba(0,0,0,.13) 0 1px,transparent 1px 9px)}",

    /* centipede */
    "#fs-sb.centipede #fs-sb-thumb{display:none}",
    ".fs-sb-seg{position:absolute;left:3px;right:3px;height:9px;border-radius:5px;",
      "background:#4c69ba;border:1px solid #29487d}",

    /* 2002 */
    "#fs-sb.win95{width:16px;background:repeating-conic-gradient(#d8d8d8 0 25%,#fff 0 50%) 0 0/2px 2px;",
      "border-left:1px solid #808080}",
    "#fs-sb.win95 #fs-sb-thumb{left:1px;right:1px;border-radius:0;background:#c0c0c0;",
      "border:2px outset #fff;box-shadow:none}",
    ".fs-sb-arrow{position:absolute;left:1px;right:1px;height:16px;background:#c0c0c0;",
      "border:2px outset #fff;font:9px/12px 'MS Sans Serif',sans-serif;text-align:center;cursor:pointer;",
      "color:#000;user-select:none}",
    ".fs-sb-arrow.up{top:0}.fs-sb-arrow.dn{bottom:0}",
    ".fs-sb-arrow:active{border-style:inset}",

    /* wrong side */
    "#fs-sb.wrongside{left:0;right:auto;border-left:none;border-right:1px solid rgba(0,0,0,.2)}",
    "#fs-sb.wrongside #fs-sb-thumb{background:linear-gradient(180deg,#f00,#ff9900,#ffff00,#33cc33,#3366ff,#9933ff);",
      "border-color:#000;border-radius:7px}",

    "#fs-sb-tilt{position:fixed;right:19px;bottom:16px;z-index:9501;background:#22201d;color:#fff;",
      "border:none;border-radius:7px;padding:8px 12px;font:600 12px system-ui,sans-serif;cursor:pointer}",
    "@media (prefers-reduced-motion:reduce){#fs-sb{display:none}}"
  ].join("");

  function inject(){
    if (document.getElementById("fs-sb-css")) return;
    var s = document.createElement("style");
    s.id = "fs-sb-css"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function build(){
    inject();
    track = document.createElement("div");
    track.id = "fs-sb";
    thumb = document.createElement("div");
    thumb.id = "fs-sb-thumb";
    thumb.setAttribute("role", "scrollbar");
    thumb.setAttribute("aria-label", "Scrollbar");
    track.appendChild(thumb);
    document.body.appendChild(track);

    /* eight segments for the centipede, hidden unless that mode is on */
    for (var i = 0; i < 8; i++){
      var d = document.createElement("div");
      d.className = "fs-sb-seg";
      d.style.display = "none";
      d.dataset.p = "0";
      track.appendChild(d);
      segs.push(d);
    }

    /* 2002 arrow buttons, which point the wrong way */
    ["up","dn"].forEach(function(dir){
      var a = document.createElement("div");
      a.className = "fs-sb-arrow " + dir;
      a.textContent = dir === "up" ? "▲" : "▼";
      a.style.display = "none";
      a.onclick = function(){
        /* the up arrow scrolls down. it has always done this. */
        global.scrollBy(0, dir === "up" ? 90 : -90);
        graceUntil = Date.now() + GRACE;
      };
      track.appendChild(a);
      a.dataset.arrow = dir;
    });

    thumb.addEventListener("pointerdown", function(e){
      grabbed = true; vel = 0; slip = 0; retracting = false;
      flingFrom = pct();
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    thumb.addEventListener("pointermove", function(e){
      if (!grabbed) return;
      var r = track.getBoundingClientRect(), th = thumb.offsetHeight;
      var y = e.clientY - r.top - th / 2;

      if (mode === "soap"){
        /* the faster you move it, the further it squirts out from under you.
           move slowly and it behaves — that is the skill. */
        var last = thumb._ly == null ? y : thumb._ly;
        var speed = y - last;
        thumb._ly = y;
        slip = slip * 0.82 + speed * 1.9;
        slip = Math.max(-190, Math.min(190, slip));
        y += slip;
      }

      var p = Math.max(0, Math.min(1, y / (r.height - th)));
      var target = p * docMax();
      vel = (target - global.scrollY) * 0.42;
      global.scrollTo(0, target);
    });

    ["pointerup","pointercancel"].forEach(function(ev){
      thumb.addEventListener(ev, function(){
        if (!grabbed) return;
        grabbed = false; slip = 0; thumb._ly = null;
        vel = Math.max(-MAXV, Math.min(MAXV, vel));
        if (mode === "gravity" && flingFrom > 0.7 && vel < -6 && pct() > 0.25) watchEscape();
        if (mode === "tape"){ retracting = true; vel = 0; }
        flingFrom = null;
      });
    });

    ["wheel","keydown","touchmove"].forEach(function(ev){
      global.addEventListener(ev, function(){
        graceUntil = Date.now() + GRACE;
        retracting = false;
        if (!grabbed) vel = 0;
      }, { passive:true });
    });

    global.addEventListener("resize", layout);
    layout(); tick();
  }

  function layout(){
    if (!track) return;
    var h = track.clientHeight;
    var ratio = global.innerHeight / Math.max(1, document.documentElement.scrollHeight);
    var pad = (mode === "win95") ? 17 : 0;
    var th = Math.max(32, Math.round((h - pad*2) * Math.min(1, ratio)));
    thumb.style.height = th + "px";
    thumb.style.top = Math.round(pad + pct() * (h - pad*2 - th)) + "px";

    if (mode === "centipede"){
      var target = pct();
      segs.forEach(function(s, i){
        var lag = 0.30 - i * 0.031;                 /* each segment lazier than the last */
        var cur = parseFloat(s.dataset.p) || 0;
        cur += (target - cur) * Math.max(0.035, lag);
        s.dataset.p = cur;
        s.style.top = Math.round(cur * (h - 11)) + "px";
        s.style.opacity = (0.42 + i * 0.075).toFixed(2);
      });
    }
  }

  function watchEscape(){
    var t0 = Date.now();
    (function look(){
      if (pct() < 0.05){
        if (global.FS && FS.Trophies) FS.Trophies.unlock("escapevelocity");
        return;
      }
      if (Date.now() - t0 < 3400) requestAnimationFrame(look);
    })();
  }

  function tick(){
    var max = docMax();
    var quiet = !grabbed && Date.now() > graceUntil && !notesOpen();

    if (max > 0 && quiet && mode === "gravity"){
      var g = (tiltG === null) ? GRAV : tiltG;
      vel = Math.max(-MAXV, Math.min(MAXV, (vel + g) * DAMP));
      var next = global.scrollY + vel;
      if (next <= 0){ next = 0; vel *= BOUNCE; }
      else if (next >= max){ next = max; vel *= BOUNCE; }
      if (Math.abs(vel) > 0.05) global.scrollTo(0, next);
    }

    if (max > 0 && retracting && !grabbed && !notesOpen()){
      /* the tape measure winds itself back in */
      var y = global.scrollY * 0.88;
      if (y < 2){ y = 0; retracting = false; }
      global.scrollTo(0, y);
    }

    if (thumb){
      thumb.classList.toggle("fast", Math.abs(vel) > 9);
      layout();
    }
    raf = requestAnimationFrame(tick);
  }

  function onTilt(e){
    if (e.beta == null) return;
    tiltG = Math.sin((e.beta - 90) * Math.PI / 180) * 0.34;
  }

  function offerTilt(){
    var DOE = global.DeviceOrientationEvent;
    if (!DOE) return;
    if (typeof DOE.requestPermission === "function"){
      inject();
      var b = document.createElement("button");
      b.id = "fs-sb-tilt";
      b.textContent = "Enable tilt scrolling";
      b.onclick = function(){
        DOE.requestPermission().then(function(r){
          if (r === "granted") global.addEventListener("deviceorientation", onTilt);
          b.remove();
        }).catch(function(){ b.remove(); });
      };
      document.body.appendChild(b);
    } else global.addEventListener("deviceorientation", onTilt);
  }

  var MODES = ["gravity","soap","tape","centipede","win95","wrongside"];

  function setMode(kind){
    if (MODES.indexOf(kind) < 0) kind = "gravity";
    mode = kind;
    if (!track) return;
    track.className = kind;
    vel = 0; retracting = false;
    segs.forEach(function(s){ s.style.display = (kind === "centipede") ? "block" : "none"; });
    [].forEach.call(track.querySelectorAll(".fs-sb-arrow"), function(a){
      a.style.display = (kind === "win95") ? "block" : "none";
    });
    layout();
  }

  /* which stratum are we in? */
  function detect(){
    var on = document.querySelector(".screen.on");
    var id = on ? on.id.replace("screen-", "")
                : (location.pathname.split("/").pop() || "index").replace(".html", "");
    return ({ signup:"tape", index:"tape", feed:"gravity", profile:"centipede",
              settings:"win95", privacy:"soap", awards:"wrongside" })[id] || "gravity";
  }

  function boot(){
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    build();
    setMode(detect());
    if (matchMedia("(pointer: coarse)").matches) offerTilt();
    global.addEventListener("hashchange", function(){
      setTimeout(function(){ setMode(detect()); }, 60);
    });
  }

  global.FS = global.FS || {};
  global.FS.Scrollbar = {
    modes: MODES,
    set: setMode,
    mode: function(){ return mode; },
    velocity: function(){ return vel; },
    grace: function(ms){ graceUntil = Date.now() + (ms || GRACE); },
    stop: function(){ cancelAnimationFrame(raf); if (track) track.remove(); }
  };
  global.FS.Gravity = global.FS.Scrollbar;   /* the old name still works */

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);
