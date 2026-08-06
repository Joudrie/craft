/* Friendspace — every button is bad, and each is bad in its own way.
 *
 * A personality is assigned per button by hashing its identity, so a given
 * button behaves the same way every time you meet it. Randomising per click
 * would just read as breakage; consistency makes it learnable, which is what
 * separates a toy from a wall.
 *
 * Six personalities, plus honest. Every one of them still completes its action —
 * nothing here can prevent you from doing the thing, only delay or embarrass you.
 *
 * Exempt: the Design Notes panel (the one well-designed thing here), the
 * on-screen password keyboard (68 keys, already punishment enough), and any
 * control that already carries its own hostile behaviour and would conflict.
 */
(function (global) {
  "use strict";

  var EXEMPT = [
    "#fs-notes", "#fs-notes-tab",        /* the good thing */
    ".kb",                               /* 68 shuffling keys is plenty */
    "#fs-sb-tilt", ".fs-sb-arrow",       /* scrollbar furniture */
    ".like",                             /* already a 1.2s hold + modal */
    "#hold", "#holdBtn",                 /* already hold-to-confirm */
    "#prev",                             /* auto-repeat would break */
    "#zoomIn", "#zoomOut"                /* the phone slider's escape hatch */
  ];

  var KINDS = ["flinch", "confirm", "hold", "shrink", "drift", "lag", "honest"];
  var used = {};                          /* which personalities you've beaten */

  var CSS = [
    ".fs-b{transition:transform .16s cubic-bezier(.3,1.5,.4,1)}",
    ".fs-b-hold{position:relative;overflow:hidden}",
    ".fs-b-hold::before{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--fsb,0%);",
      "background:rgba(255,255,255,.42);pointer-events:none;transition:width .05s linear}",
    ".fs-b-confirm{outline:2px solid #d64545;outline-offset:1px}"
  ].join("");

  function inject(){
    if (document.getElementById("fs-b-css")) return;
    var s = document.createElement("style");
    s.id = "fs-b-css"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function hash(str){
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
    return h;
  }

  function exempt(btn){
    for (var i = 0; i < EXEMPT.length; i++){
      if (btn.matches && btn.matches(EXEMPT[i])) return true;
      if (btn.closest && btn.closest(EXEMPT[i])) return true;
    }
    return false;
  }

  function beat(kind){
    if (used[kind]) return;
    used[kind] = 1;
    var n = KINDS.filter(function(k){ return k !== "honest" && used[k]; }).length;
    if (n >= 6 && global.FS && FS.Trophies) FS.Trophies.unlock("patience");
  }

  function apply(btn){
    if (btn.dataset.fsb || exempt(btn)) return;
    var id = (btn.id || "") + "|" + (btn.className || "") + "|" + (btn.textContent || "").trim();
    var kind = KINDS[hash(id) % KINDS.length];
    btn.dataset.fsb = kind;
    if (kind === "honest") return;         /* roughly one in seven is left alone */

    btn.classList.add("fs-b");

    /* ---- flinch: dodges once, then gives up. always catchable. ---- */
    if (kind === "flinch"){
      btn.addEventListener("pointerenter", function(){
        if (btn.dataset.fled) return;
        btn.dataset.fled = "1";
        var a = (hash(id) % 360) * Math.PI / 180;
        btn.style.transform = "translate(" + Math.cos(a)*26 + "px," + Math.sin(a)*17 + "px)";
        setTimeout(function(){ btn.style.transform = ""; }, 700);
      });
      btn.addEventListener("click", function(){ beat("flinch"); });
    }

    /* ---- confirm: asks once, then does it ---- */
    if (kind === "confirm"){
      var label = null, armed = false, t = null;
      btn.addEventListener("click", function(e){
        if (armed){ armed = false; clearTimeout(t); btn.textContent = label;
                    btn.classList.remove("fs-b-confirm"); beat("confirm"); return; }
        e.preventDefault(); e.stopImmediatePropagation();
        label = btn.textContent;
        btn.textContent = "Are you sure?";
        btn.classList.add("fs-b-confirm");
        armed = true;
        t = setTimeout(function(){
          armed = false; btn.textContent = label; btn.classList.remove("fs-b-confirm");
        }, 3200);
      }, true);
    }

    /* ---- hold: 450ms of commitment ---- */
    if (kind === "hold"){
      var raf = null, t0 = 0, done = false;
      btn.classList.add("fs-b-hold");
      btn.addEventListener("pointerdown", function(){
        done = false; t0 = performance.now();
        (function loop(){
          var p = Math.min(1, (performance.now() - t0) / 450);
          btn.style.setProperty("--fsb", (p*100) + "%");
          if (p >= 1){ done = true; btn.style.setProperty("--fsb", "0%"); beat("hold"); return; }
          raf = requestAnimationFrame(loop);
        })();
      });
      ["pointerup","pointerleave","pointercancel"].forEach(function(ev){
        btn.addEventListener(ev, function(){
          cancelAnimationFrame(raf);
          btn.style.setProperty("--fsb", "0%");
        });
      });
      btn.addEventListener("click", function(e){
        if (!done){ e.preventDefault(); e.stopImmediatePropagation(); }
      }, true);
    }

    /* ---- shrink: smaller every time you look at it, to a floor ---- */
    if (kind === "shrink"){
      var sc = 1;
      btn.addEventListener("pointerenter", function(){
        sc = Math.max(0.62, sc - 0.07);
        btn.style.transform = "scale(" + sc + ")";
      });
      btn.addEventListener("click", function(){ beat("shrink"); });
    }

    /* ---- drift: wanders, but never out of reach ---- */
    if (kind === "drift"){
      var ph = hash(id) % 628 / 100;
      setInterval(function(){
        if (!btn.isConnected) return;
        ph += 0.05;
        btn.style.transform = "translate(" + (Math.sin(ph)*11).toFixed(1) + "px," +
                                             (Math.cos(ph*0.7)*7).toFixed(1) + "px)";
      }, 90);
      btn.addEventListener("click", function(){ beat("drift"); });
    }

    /* ---- lag: it heard you, it is thinking about it ---- */
    if (kind === "lag"){
      var passing = false, txt = null;
      btn.addEventListener("click", function(e){
        if (passing){ passing = false; beat("lag"); return; }
        e.preventDefault(); e.stopImmediatePropagation();
        txt = btn.textContent;
        btn.textContent = "…";
        setTimeout(function(){
          btn.textContent = txt;
          passing = true;
          btn.click();
        }, 700);
      }, true);
    }
  }

  function sweep(root){
    var list = (root || document).querySelectorAll("button");
    [].forEach.call(list, apply);
  }

  function boot(){
    inject();
    sweep();
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        [].forEach.call(m.addedNodes, function(n){
          if (n.nodeType !== 1) return;
          if (n.tagName === "BUTTON") apply(n);
          else if (n.querySelectorAll) sweep(n);
        });
      });
    }).observe(document.body, { childList:true, subtree:true });
  }

  global.FS = global.FS || {};
  global.FS.Buttons = {
    kinds: KINDS,
    beaten: function(){ return Object.keys(used); },
    kindOf: function(sel){
      var b = document.querySelector(sel);
      return b ? (b.dataset.fsb || null) : null;
    },
    census: function(){
      var out = {};
      [].forEach.call(document.querySelectorAll("button"), function(b){
        var k = b.dataset.fsb || "exempt";
        out[k] = (out[k] || 0) + 1;
      });
      return out;
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);
