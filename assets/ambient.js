/* Friendspace — the profile song that plays whether you like it or not.
 *
 * A tinny sequenced loop, synthesised rather than shipped as an asset. It exists
 * to be the setup: the site plays music at you, and the only volume control on
 * the entire website is a slingshot on the sign-up form. One joke with a setup
 * and a punchline, rather than two separate annoyances.
 *
 * The level you landed with the slingshot is stored in localStorage and honoured
 * here — the only setting on this website that is.
 */
(function (global) {
  "use strict";

  var CAP = 0.085;                 /* irritating, not harmful */
  var actx = null, master = null, timer = null, started = false, step = 0;

  /* a deliberately cheap little motif, in semitones from A3 */
  var LEAD = [0, 4, 7, 12, 7, 4, 0, -5, 0, 4, 7, 11, 7, 4, 0, 2];
  var BASS = [0, null, -5, null, -3, null, -5, null];
  var BPM  = 104, STEP = 60 / BPM / 2;      /* eighth notes */

  function hz(semi){ return 220 * Math.pow(2, semi / 12); }

  function level(){
    var v = parseInt(localStorage.getItem("fs_volume"), 10);
    if (isNaN(v)) v = 55;                    /* nobody has aimed yet */
    return CAP * (v / 100);
  }

  function blip(freq, at, dur, type, gain){
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(master);
    o.start(at); o.stop(at + dur + 0.02);
  }

  function schedule(){
    var at = actx.currentTime + 0.06;
    var lead = LEAD[step % LEAD.length];
    blip(hz(lead + 12), at, STEP * 0.85, "square", 0.5);
    var bass = BASS[step % BASS.length];
    if (bass !== null) blip(hz(bass - 12), at, STEP * 1.7, "triangle", 0.75);
    if (step % 4 === 0) blip(hz(lead + 24), at, STEP * 0.3, "square", 0.14);
    step++;
    master.gain.setTargetAtTime(level(), actx.currentTime, 0.25);
  }

  function start(){
    if (started) return;
    started = true;
    try {
      actx = new (global.AudioContext || global.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = level();
      master.connect(actx.destination);
      timer = setInterval(schedule, STEP * 1000);
      schedule();
      indicator();
    } catch (e) { /* no audio available; the site is otherwise unaffected */ }
  }

  /* A signpost, not a mute button. It tells you where the volume control is,
     which keeps the joke a toy: the control exists and is reachable. */
  function indicator(){
    if (document.getElementById("fs-nowplaying")) return;
    var s = document.createElement("style");
    s.textContent =
      "#fs-nowplaying{position:fixed;left:11px;bottom:11px;z-index:9400;background:#1a1a22;" +
      "color:#d8d8e4;border:2px outset #55556a;padding:6px 10px;font:11px Verdana,Geneva,sans-serif;" +
      "display:flex;align-items:center;gap:8px;max-width:70vw}" +
      "#fs-nowplaying b{color:#ffd34d}" +
      "#fs-nowplaying a{color:#8fb4ff}" +
      "#fs-nowplaying .eq{display:inline-flex;gap:2px;align-items:flex-end;height:12px}" +
      "#fs-nowplaying .eq i{width:3px;background:#7ab648;animation:fsEq .62s ease-in-out infinite alternate}" +
      "#fs-nowplaying .eq i:nth-child(2){animation-delay:.16s}" +
      "#fs-nowplaying .eq i:nth-child(3){animation-delay:.32s}" +
      "@keyframes fsEq{from{height:3px}to{height:12px}}";
    document.head.appendChild(s);

    var d = document.createElement("div");
    d.id = "fs-nowplaying";
    d.innerHTML =
      '<span class="eq"><i></i><i></i><i></i></span>' +
      '<span><b>Now playing:</b> profile song ' +
      '<span id="fs-vol"></span><br>' +
      '<a href="' + link() + '">Adjust volume during sign-up</a></span>';
    document.body.appendChild(d);
    refresh();
    setInterval(refresh, 900);
  }

  function link(){
    /* works both as separate pages and inside the single-file bundle */
    return document.getElementById("screen-signup") ? "#signup" : "index.html";
  }

  function refresh(){
    var el = document.getElementById("fs-vol");
    if (!el) return;
    var v = parseInt(localStorage.getItem("fs_volume"), 10);
    el.textContent = isNaN(v) ? "(volume never set)" : "(volume " + v + ")";
    if (master && actx) master.gain.setTargetAtTime(level(), actx.currentTime, 0.2);
  }

  /* browsers require a gesture before audio; the first click is the gesture */
  ["pointerdown", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, start, { once: true });
  });

  global.FS = global.FS || {};
  global.FS.Ambient = {
    stop: function () {
      clearInterval(timer);
      if (actx) { try { actx.close(); } catch (e) {} }
      var n = document.getElementById("fs-nowplaying");
      if (n) n.remove();
      started = false;
    },
    level: level
  };

})(window);
