/* Friendspace — Awards & Achievements Engine
 * "Recognising excellence since 2003."
 *
 * Shared across every page. Persists to localStorage so the Awards page can
 * display your accumulated honours. One trophy is deliberately unobtainable.
 */
(function (global) {
  "use strict";

  var KEY = "fs_awards_v1";

  /* ---- registry -------------------------------------------------------- */
  var REGISTRY = [
    // signup
    { id: "marksman",     name: "Marksman",       desc: "Land the volume slingshot on exactly 0.",            where: "Sign-up" },
    { id: "escape",       name: "Escape Artist",  desc: "Catch the fleeing checkbox.",                        where: "Sign-up" },
    { id: "completionist",name: "Completionist",  desc: "Disable every one of our valued partners.",          where: "Sign-up" },
    { id: "longway",      name: "The Long Way",   desc: "Travel 300 months into the past.",                   where: "Sign-up" },
    { id: "precision",    name: "Precision",      desc: "Zoom the number selector all the way in.",           where: "Sign-up" },
    { id: "identity",     name: "Identity",       desc: "Accept the username you were assigned.",             where: "Sign-up" },
    { id: "verified",     name: "Verified",       desc: "Type the code before it expires.",                   where: "Sign-up" },
    { id: "notarobot",    name: "Not A Robot",    desc: "Satisfy the CAPTCHA. Eventually.",                   where: "Sign-up" },
    { id: "framed",       name: "Framed",         desc: "Get your face inside the frame.",                    where: "Sign-up" },
    { id: "hydra",        name: "Hydra",          desc: "Work out which end of the partner list to start at.", where: "Sign-up" },
    // feed
    { id: "persistence",  name: "Persistence",    desc: "Successfully like a post.",                          where: "Feed" },
    { id: "regret",       name: "Regret",         desc: "Attempt to un-like a post.",                         where: "Feed" },
    { id: "spotter",      name: "Spotter",        desc: "Notice that something was sponsored.",               where: "Feed" },
    { id: "compression",  name: "Compression",    desc: "Collapse a post down to a single line.",             where: "Feed" },
    { id: "void",         name: "Into The Void",  desc: "Publish a post and watch it leave.",                 where: "Feed" },
    { id: "negative",     name: "Below Zero",     desc: "Drive your notification count beneath zero.",         where: "Feed" },
    { id: "speedrunner",  name: "Speedrunner",    desc: "Outrun the loader and reach the footer.",            where: "Feed" },
    // deeper strata
    { id: "archaeologist",name: "Archaeologist",  desc: "Reach the 2002 stratum.",                            where: "Settings" },
    { id: "readit",       name: "Actually Read It",desc: "Scroll the Privacy Policy to the very bottom.",     where: "Legal" },
    { id: "doublespeak",  name: "Doublespeak",    desc: "Decode every privacy setting to actually private.",  where: "Settings" },
    { id: "nearly",       name: "So Close",       desc: "Reach the final step of account deletion.",          where: "Settings" },
    { id: "climber",      name: "Social Climber", desc: "Reach position #1 in someone's Top 8.",              where: "Profiles" },
    { id: "rubbernecker", name: "Rubbernecker",   desc: "Visit every profile. Look at what they've done.",    where: "Profiles" },
    { id: "silence",      name: "Silence",        desc: "Stop all six profile songs at once.",               where: "Profiles" },
    // the lie
    { id: "ghost",        name: "Ghost",          desc: "Successfully delete your account.",                  where: "Settings", impossible: true }
  ];

  /* ---- persistence ----------------------------------------------------- */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  var earned = load();

  /* ---- a small celebratory noise --------------------------------------- */
  var actx = null;
  function ding() {
    try {
      actx = actx || new (global.AudioContext || global.webkitAudioContext)();
      [880, 1108.7, 1318.5].forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = "square"; o.frequency.value = f;
        var t = actx.currentTime + i * 0.07;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(actx.destination);
        o.start(t); o.stop(t + 0.25);
      });
    } catch (e) { /* no audio, no problem */ }
  }

  /* ---- styles (injected so every page gets them) ----------------------- */
  var CSS = [
    ".fs-badge{display:inline-block;width:88px;height:31px;position:relative;overflow:hidden;",
      "border:2px outset #c0c0c0;background:linear-gradient(180deg,#6a8fd8 0%,#2c4d9b 45%,#16306e 55%,#3a63b8 100%);",
      "color:#ffe680;font:bold 9px/1.05 Verdana,Geneva,sans-serif;text-align:center;",
      "text-shadow:1px 1px 0 #000,0 0 3px #ffb300;letter-spacing:.02em;",
      "display:inline-flex;align-items:center;justify-content:center;padding:0 3px;vertical-align:middle}",
    ".fs-badge.locked{background:linear-gradient(180deg,#b8b8b8,#6e6e6e);color:#3a3a3a;text-shadow:1px 1px 0 #ddd;filter:saturate(.2)}",
    ".fs-badge .shine{position:absolute;top:-40px;left:-60px;width:32px;height:120px;",
      "background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);transform:rotate(22deg);",
      "animation:fsShine 3.4s linear infinite}",
    ".fs-badge.locked .shine{display:none}",
    "@keyframes fsShine{0%{left:-60px}55%{left:130px}100%{left:130px}}",
    "#fs-toaster{position:fixed;right:14px;bottom:14px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}",
    ".fs-toast{display:flex;align-items:center;gap:10px;background:#fffbe6;border:3px ridge #ffcc00;",
      "padding:9px 13px 9px 9px;box-shadow:4px 4px 0 rgba(0,0,0,.35);font:11px Verdana,Geneva,sans-serif;color:#3a2d00;",
      "animation:fsPop .45s cubic-bezier(.2,1.6,.4,1) both;max-width:330px}",
    ".fs-toast b{display:block;font-size:12px;color:#8a6b00;margin-bottom:1px}",
    ".fs-toast .m{font-size:10px;color:#6b5a1e}",
    "@keyframes fsPop{0%{transform:translateX(120%) scale(.8)}70%{transform:translateX(-6%) scale(1.04)}100%{transform:translateX(0) scale(1)}}"
  ].join("");

  function injectCSS() {
    if (document.getElementById("fs-award-css")) return;
    var s = document.createElement("style");
    s.id = "fs-award-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---- badge markup ---------------------------------------------------- */
  function badge(t, isEarned) {
    var d = document.createElement("span");
    d.className = "fs-badge" + (isEarned ? "" : " locked");
    d.title = t.name + " — " + t.desc;
    d.innerHTML = '<span class="shine"></span>' + t.name.toUpperCase();
    return d;
  }

  /* ---- toast ----------------------------------------------------------- */
  function toast(t) {
    injectCSS();
    var host = document.getElementById("fs-toaster");
    if (!host) {
      host = document.createElement("div");
      host.id = "fs-toaster";
      document.body.appendChild(host);
    }
    var el = document.createElement("div");
    el.className = "fs-toast";
    el.appendChild(badge(t, true));
    var txt = document.createElement("div");
    txt.innerHTML = "<b>Award Unlocked!</b>" + t.name +
      '<div class="m">' + t.desc + "</div>";
    el.appendChild(txt);
    host.appendChild(el);
    ding();
    setTimeout(function () {
      el.style.transition = "opacity .5s, transform .5s";
      el.style.opacity = "0";
      el.style.transform = "translateX(40%)";
      setTimeout(function () { el.remove(); }, 520);
    }, 4200);
  }

  /* ---- api ------------------------------------------------------------- */
  var Trophies = {
    registry: REGISTRY,

    get: function (id) {
      for (var i = 0; i < REGISTRY.length; i++) if (REGISTRY[i].id === id) return REGISTRY[i];
      return null;
    },

    has: function (id) { return !!earned[id]; },

    count: function () { return Object.keys(earned).length; },

    /** Unlock a trophy. Impossible trophies silently refuse, forever. */
    unlock: function (id) {
      var t = this.get(id);
      if (!t) return false;
      if (t.impossible) return false;   // Ghost. Sorry.
      if (earned[id]) return false;
      earned[id] = Date.now();
      save(earned);
      toast(t);
      return true;
    },

    /** Wipe progress (used by the Awards page's hostile reset). */
    reset: function () { earned = {}; save(earned); },

    badge: badge,

    /** Render the full award cabinet into a container. */
    render: function (host) {
      injectCSS();
      host.innerHTML = "";
      REGISTRY.forEach(function (t) {
        var got = !!earned[t.id];
        var row = document.createElement("div");
        row.className = "award-row" + (got ? " got" : "");
        var b = badge(t, got);
        row.appendChild(b);
        var meta = document.createElement("div");
        meta.className = "award-meta";
        meta.innerHTML = "<b>" + t.name + "</b><br><span>" + t.desc + "</span>" +
          '<br><i>' + t.where + "</i>";
        row.appendChild(meta);
        var st = document.createElement("div");
        st.className = "award-state";
        st.textContent = got ? "★ AWARDED" : "not yet earned";
        row.appendChild(st);
        host.appendChild(row);
      });
    }
  };

  injectCSS();
  global.FS = global.FS || {};
  global.FS.Trophies = Trophies;

})(window);
