/* Friendspace — the scrollbar obeys gravity.
 *
 * The native scrollbar is replaced with one that has mass. Leave it alone and it
 * sags toward the bottom of the page. Grab it and fling it and it carries
 * momentum, overshoots, and bounces off the end stops. On a phone it uses
 * DeviceOrientation, so whichever way you tilt the handset is downhill.
 *
 * Kept a toy rather than a wall by one rule: gravity only acts when you are not
 * scrolling. Any wheel, key or touch scroll buys a grace period, so reading is
 * unaffected and only inattention is punished. Design Notes pauses it entirely.
 */
(function (global) {
  "use strict";

  var GRAV     = 0.055,   /* px per frame^2 — a sag, not a plummet */
      DAMP     = 0.994,
      BOUNCE   = -0.34,
      MAXV     = 26,
      GRACE    = 1500;    /* ms of stillness before gravity takes hold again */

  var vel = 0, grabbed = false, graceUntil = 0, tiltG = null;
  var track, thumb, raf = null, flingFrom = null;

  function docMax(){
    return Math.max(0, document.documentElement.scrollHeight - global.innerHeight);
  }

  var CSS = [
    /* the real one goes away */
    "html{scrollbar-width:none;-ms-overflow-style:none}",
    "html::-webkit-scrollbar{display:none}",

    "#fs-grav{position:fixed;top:0;right:0;bottom:0;width:15px;z-index:9500;",
      "background:linear-gradient(90deg,rgba(0,0,0,.05),rgba(0,0,0,.11));",
      "border-left:1px solid rgba(0,0,0,.13)}",
    "#fs-grav-thumb{position:absolute;left:2px;right:2px;border-radius:6px;",
      "background:linear-gradient(180deg,#6d84b4,#3b5998 55%,#2b4278);",
      "border:1px solid #29487d;box-shadow:inset 0 1px 0 rgba(255,255,255,.35);",
      "cursor:grab;touch-action:none}",
    "#fs-grav-thumb:active{cursor:grabbing}",
    "#fs-grav-thumb.fast{background:linear-gradient(180deg,#e8b04b,#d6772b 60%,#b8541c);border-color:#8a3d12}",
    "#fs-grav-tilt{position:fixed;right:19px;bottom:16px;z-index:9501;background:#22201d;color:#fff;",
      "border:none;border-radius:7px;padding:8px 12px;font:600 12px system-ui,sans-serif;cursor:pointer}",
    "@media (prefers-reduced-motion:reduce){#fs-grav{display:none}}"
  ].join("");

  function inject(){
    if (document.getElementById("fs-grav-css")) return;
    var s = document.createElement("style");
    s.id = "fs-grav-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function build(){
    inject();
    track = document.createElement("div");
    track.id = "fs-grav";
    thumb = document.createElement("div");
    thumb.id = "fs-grav-thumb";
    thumb.setAttribute("role", "scrollbar");
    thumb.setAttribute("aria-label", "Scrollbar (subject to gravity)");
    track.appendChild(thumb);
    document.body.appendChild(track);

    thumb.addEventListener("pointerdown", function(e){
      grabbed = true;
      vel = 0;
      flingFrom = pct();
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    thumb.addEventListener("pointermove", function(e){
      if (!grabbed) return;
      var r = track.getBoundingClientRect();
      var th = thumb.offsetHeight;
      var y  = e.clientY - r.top - th / 2;
      var p  = Math.max(0, Math.min(1, y / (r.height - th)));
      var target = p * docMax();
      vel = (target - global.scrollY) * 0.42;      /* carried into the fling */
      global.scrollTo(0, target);
    });

    ["pointerup","pointercancel"].forEach(function(ev){
      thumb.addEventListener(ev, function(){
        if (!grabbed) return;
        grabbed = false;
        vel = Math.max(-MAXV, Math.min(MAXV, vel));
        /* a throw from the bottom that reaches the top is worth something */
        if (flingFrom > 0.7 && vel < -6 && pct() > 0.25) watchEscape();
        flingFrom = null;
      });
    });

    /* ordinary scrolling buys you peace */
    ["wheel","keydown","touchmove"].forEach(function(ev){
      global.addEventListener(ev, function(){
        graceUntil = Date.now() + GRACE;
        if (!grabbed) vel = 0;
      }, { passive:true });
    });

    global.addEventListener("resize", layout);
    layout();
    tick();
  }

  function pct(){
    var m = docMax();
    return m <= 0 ? 0 : global.scrollY / m;
  }

  function layout(){
    if (!track) return;
    var h = track.clientHeight;
    var ratio = global.innerHeight / Math.max(1, document.documentElement.scrollHeight);
    var th = Math.max(32, Math.round(h * Math.min(1, ratio)));
    thumb.style.height = th + "px";
    thumb.style.top = Math.round(pct() * (h - th)) + "px";
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

  function notesOpen(){
    return !!(global.FS && FS.Notes && FS.Notes.isOn && FS.Notes.isOn());
  }

  function tick(){
    var max = docMax();
    if (max > 0 && !grabbed && Date.now() > graceUntil && !notesOpen()){
      var g = (tiltG === null) ? GRAV : tiltG;
      vel = Math.max(-MAXV, Math.min(MAXV, (vel + g) * DAMP));
      var next = global.scrollY + vel;
      if (next <= 0){ next = 0; vel *= BOUNCE; }
      else if (next >= max){ next = max; vel *= BOUNCE; }
      if (Math.abs(vel) > 0.05) global.scrollTo(0, next);
    }
    if (thumb){
      thumb.classList.toggle("fast", Math.abs(vel) > 9);
      layout();
    }
    raf = requestAnimationFrame(tick);
  }

  /* ---- phones: whichever way you tilt is downhill ---- */
  function onTilt(e){
    if (e.beta === null || e.beta === undefined) return;
    /* beta is front-to-back tilt in degrees; upright is ~90 */
    var lean = Math.sin((e.beta - 90) * Math.PI / 180);
    tiltG = lean * 0.34;
  }

  function offerTilt(){
    var DOE = global.DeviceOrientationEvent;
    if (!DOE) return;
    if (typeof DOE.requestPermission === "function"){
      /* iOS needs a gesture; offer a button rather than nagging */
      inject();
      var b = document.createElement("button");
      b.id = "fs-grav-tilt";
      b.textContent = "Enable tilt scrolling";
      b.onclick = function(){
        DOE.requestPermission().then(function(res){
          if (res === "granted") global.addEventListener("deviceorientation", onTilt);
          b.remove();
        }).catch(function(){ b.remove(); });
      };
      document.body.appendChild(b);
    } else {
      global.addEventListener("deviceorientation", onTilt);
    }
  }

  function boot(){
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    build();
    if (matchMedia("(pointer: coarse)").matches) offerTilt();
  }

  global.FS = global.FS || {};
  global.FS.Gravity = {
    stop: function(){ cancelAnimationFrame(raf); if (track) track.remove(); },
    velocity: function(){ return vel; },
    grace: function(ms){ graceUntil = Date.now() + (ms || GRACE); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);
