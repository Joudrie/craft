/* Friendspace — Design Notes
 *
 * The annotation layer. Every crime on this site is a parody of something a real
 * company actually shipped; this names the principle each one violates, what the
 * correct implementation looks like, and who got sued for it.
 *
 * The toggle is deliberately hard to find (whisper-text in the footer, or press ?).
 * Once found it is remembered. Discovering it is meant to be earned.
 *
 * This panel is the only well-designed thing on the website. That is the joke.
 */
(function (global) {
  "use strict";

  var KEY = "fs_notes_on";

  /* ==================================================================
     THE REGISTRY
     sel      — what to annotate
     crime    — what it does
     law      — the named principle it breaks
     fix      — what correct looks like
     real     — who actually shipped this, and what it cost them
     ================================================================== */
  var NOTES = [
    /* ---------------- onboarding ---------------- */
    { screen:"Sign-up", sel:"#bar",
      crime:"The progress bar shrinks as you advance, and the step count grows: 1 of 4, then 2 of 6, then 8 of 14.",
      law:"Visibility of system status — Nielsen heuristic #1 (1994). A progress indicator is a promise about remaining effort.",
      fix:"Show real progress against a fixed total. If the total genuinely can't be known, show step count without a fraction.",
      real:"Not a parody of one company so much as of every multi-step checkout that discovers new steps once you're committed." },

    { screen:"Sign-up", sel:"#phone",
      crime:"One slider spanning 1 to 100,000,000 — roughly 167,000 values per pixel, so dragging cannot land an exact number.",
      law:"Fitts's Law (1954): acquisition time depends on target size relative to distance. Here the target is a fraction of a pixel.",
      fix:"A text field. It has always been a text field.",
      real:"The genre's founding joke — the 2017 r/ProgrammerHumor contest to design the worst possible volume control." },

    { screen:"Sign-up", sel:"#sling",
      crime:"Volume is set by firing a projectile at a numbered scale and seeing where it lands.",
      law:"Fitts's Law again, plus direct manipulation: a control should map predictably onto the value it sets.",
      fix:"A slider, with the current value shown as a number.",
      real:"The 2017 volume-control contest produced a catapult, a shout-controlled slider, and one that set volume by latitude on a globe." },

    { screen:"Sign-up", sel:"#checkU",
      crime:"Every username you want is taken. After three attempts it assigns you one and invites you to accept it.",
      law:"User control and freedom — Nielsen #3. The system substitutes its choice for yours and calls it help.",
      fix:"Check availability as they type, and suggest alternatives without ever taking the decision away.",
      real:"Standard practice. The tell is that the 'suggestion' is always worse and always available immediately." },

    { screen:"Sign-up", sel:"#theCode",
      crime:"The verification code is displayed to you and rotates every 2.5 seconds. Type slowly and it expires under you.",
      law:"Doherty Threshold (IBM, 1982): interaction should complete inside ~400ms. Here the system races the user on purpose.",
      fix:"A code with a sane expiry, and a resend button that works.",
      real:"Parody of every OTP flow whose timeout is shorter than the time it takes to switch apps and read the message." },

    { screen:"Sign-up", sel:"#capPrompt",
      crime:"The CAPTCHA changes its question every time you submit, so your answer always addressed the previous prompt.",
      law:"Consistency and standards — Nielsen #4. The rules of the task must not change mid-task.",
      fix:"Ask once. Accept the answer. Better: use an invisible challenge and don't make humans prove anything.",
      real:"Parody of escalating CAPTCHA difficulty, which measurably drives abandonment while blocking almost no bots." },

    { screen:"Sign-up", sel:"#cropwrap",
      crime:"Dragging moves the crop frame rather than the photo, and moves it in the opposite direction.",
      law:"Direct manipulation and the principle of least astonishment: the thing under the cursor is the thing that should move.",
      fix:"Drag the image inside a fixed frame. Everyone has done it this way since 2008.",
      real:"Inverted-axis controls are the single most reliable way to make a competent user feel stupid." },

    { screen:"Sign-up", sel:"#termsbox",
      crime:"The consent checkbox flees the cursor.",
      law:"Fitts's Law, and WCAG 2.1 §2.5.1 — functionality must not depend on a specific pointer gesture.",
      fix:"A checkbox that stays still. It cannot flee the keyboard, which is why Tab + Space still works here.",
      real:"Consent that is hard to give is a cousin of consent that is hard to withdraw — and regulators treat both as the same defect." },

    { screen:"Sign-up", sel:"#plist",
      crime:"Twelve partners, all pre-enabled. Switching one off switches two earlier ones back on. 'Accept all' and 'Reject all' are wired to the same handler.",
      law:"Preselection and Trick Wording — two of Brignull's twelve (2010). Consent must be freely given and as easy to refuse as to grant.",
      fix:"Everything off by default. One button that rejects everything and works.",
      real:"The EU Digital Services Act and GDPR both require refusal to be as easy as acceptance. Cookie banners remain the most-fined interface pattern in Europe." },

    { screen:"Sign-up", sel:"#prev",
      crime:"The date picker opens on today and only travels backwards, one month per click. Roughly 300 clicks for an adult.",
      law:"Flexibility and efficiency of use — Nielsen #7. Frequent paths need accelerators.",
      fix:"A year dropdown. Or a text field, which was always fine.",
      real:"Every date picker that makes you click back through 25 years to enter a birthday." },

    { screen:"Sign-up", sel:"#kb",
      crime:"68 on-screen keys that reshuffle after every single press, justified as a security measure.",
      law:"Recognition rather than recall — Nielsen #6. Spatial memory is the whole point of a keyboard.",
      fix:"Let people use their keyboard. Offer a reveal toggle instead of obstructing entry.",
      real:"Shuffled PIN pads are real, and are genuinely used by some banks — with 10 keys, not 68." },

    { screen:"Sign-up", sel:"#email",
      crime:"Each character takes 700ms to 'verify'. Anything typed during the wait is discarded.",
      law:"Doherty Threshold: past ~400ms the user's attention breaks. This is nearly double, per keystroke.",
      fix:"Validate on blur, or on submit. Never per keystroke, and never destructively.",
      real:"Parody of aggressive client-side validation that fights the user mid-word." },

    { screen:"Sign-up", sel:"#receipt",
      crime:"The confirmation lists what was recorded beside a struck-through copy of what you actually entered. They never match.",
      law:"Match between system and the real world — Nielsen #2, and the integrity of feedback generally.",
      fix:"Record what the user typed. Show them that.",
      real:"The purest form of a real pattern: interfaces that collect input they never intended to use." },

    /* ---------------- feed ---------------- */
    { screen:"Feed", sel:".fs-col-mid",
      crime:"New posts insert above your scroll position and shove the page down while you read.",
      law:"Scroll anchoring. The CSS property `overflow-anchor` exists specifically to prevent this; here it is set to `none` on purpose.",
      fix:"Leave scroll anchoring alone, and buffer new content behind a 'show new posts' button.",
      real:"A genuine, widespread bug — and the crime here is that browsers already ship the fix and this page switches it off." },

    { screen:"Feed", sel:".fs-sponsored",
      crime:"Advertisements are styled identically to posts. The 'Sponsored' label is 4px, #F0F0F0 on white.",
      law:"Disguised Ads — Brignull (2010). Also WCAG 1.4.3: this measures 1.05:1 against a 4.5:1 minimum.",
      fix:"Label ads at body size, in body contrast, with a visible boundary.",
      real:"The FTC requires advertising to be identifiable as advertising. Native advertising exists to test how far that can be pushed." },

    { screen:"Feed", sel:"#notif",
      crime:"The notification badge counts down as you receive more, and goes negative.",
      law:"Visibility of system status — Nielsen #1. A count that lies is worse than no count.",
      fix:"Show the number of unread items. Let it reach zero and stay there.",
      real:"Parody of badge counts that never clear — a real engagement tactic, since an unresolved badge reliably pulls people back." },

    { screen:"Feed", sel:"#feed .fs-post .like",
      crime:"Liking requires a long press, then a confirmation warning that your reaction is permanent and shared with 24 partners. It cannot be undone.",
      law:"User control and freedom — Nielsen #3: every action needs a clearly marked exit. Also Roach Motel (Brignull).",
      fix:"One click to like. One click to unlike.",
      real:"Epic Games paid a record $245 million to the FTC in 2023, in part for interfaces that made charges easy to trigger and hard to reverse." },

    { screen:"Feed", sel:"#feed .fs-post .seemore",
      crime:"'See more' collapses the post instead of expanding it.",
      law:"Trick Wording — Brignull (2010). A control must do what its label says.",
      fix:"'See more' expands. 'See less' collapses.",
      real:"Mislabelled controls are the cheapest deceptive pattern there is, and the hardest to argue was an accident." },

    { screen:"Feed", sel:"#loader",
      crime:"Infinite scroll, with the only useful links — help, privacy, delete account — in a footer you can never reach.",
      law:"Obstruction — Brignull. Burying an exit is a recognised deceptive pattern, not a layout accident.",
      fix:"Paginate, or pin the footer links somewhere reachable.",
      real:"Ryanair's booking flow re-presents the same declined upsell with different button colours and titles on nearly every page — repetition as a statistical weapon." },

    { screen:"Feed", sel:"#search",
      crime:"Search results are sorted by ascending relevance. The worst match is first.",
      law:"Match between system and the real world — Nielsen #2.",
      fix:"Sort by relevance, descending. That is what the word means.",
      real:"Parody of search that ranks by sponsorship and calls the ordering 'relevance'." },

    /* ---------------- profiles ---------------- */
    { screen:"Profiles", sel:".t8",
      crime:"A public, ranked list of your eight closest friends, reordered nightly, with everyone notified.",
      law:"Not a usability defect — a social one. The interface manufactures conflict because conflict is engagement.",
      fix:"Don't rank people. If you must, keep it private.",
      real:"MySpace's Top 8 was real, shipped to millions, and is remembered mainly for the friendships it damaged." },

    { screen:"Profiles", sel:".wall",
      crime:"Comments are written straight into innerHTML. A comment from 2009 opened a <marquee> and never closed it; every comment since has been inside it.",
      law:"Output encoding. Unescaped user input is the root of cross-site scripting — here it only deforms the page, but the defect is identical.",
      fix:"Escape user content on output. Always.",
      real:"MySpace let users inject raw CSS and HTML into profiles. The Samy worm exploited exactly this in 2005 and spread to a million accounts in 20 hours." },

    { screen:"Profiles", sel:"#friends",
      crime:"Members paste unvalidated CSS into their own profiles, so nine of them are unreadable in nine different ways.",
      law:"Contrast (WCAG 1.4.3), among others. One profile here measures 1.10:1 against a 4.5:1 minimum.",
      fix:"Offer themes. Sanitise anything user-supplied that reaches the page.",
      real:"Historically accurate: this is precisely what MySpace shipped, and precisely what happened." },

    /* ---------------- settings ---------------- */
    { screen:"Settings", sel:"#nav",
      crime:"Ten sections and around fifty controls, every one of which commits a specific, named offence. Turn Design Notes on and each row explains itself inline.",
      law:"All of them. This screen is the study: settings are where products accumulate their worst interface decisions, because nobody demos the settings screen.",
      fix:"Read the inline notes. Each one names what went wrong and what the correct version is.",
      real:"Every complaint in here is one people actually have: search that cannot find settings, toggles nobody can interpret, 'managed by your administrator' when you are the administrator, and 'sign out of all devices' signing you out of one." },

    { screen:"Settings", sel:"#setSearch",
      crime:"Settings search returns zero results for terms that appear on this very page, then suggests three unrelated settings you did not ask for.",
      law:"Match between system and the real world — Nielsen #2. A search index built from internal keys instead of visible words cannot match what the user reads.",
      fix:"Index the words actually shown on screen, including synonyms, and deep-link to the control.",
      real:"The most common complaint about every large settings screen shipped in the last decade. The cause is nearly always the same." },

    { screen:"Settings", sel:"table.tg",
      crime:"Ten privacy settings, each negated an arbitrary number of times. 'Do not disallow non-restricted sharing.' Ticking every box leaves half of them sharing.",
      law:"Trick Questions — Brignull (2010). GDPR requires consent to be specific, informed and unambiguous.",
      fix:"One positive statement per setting. 'Share my profile publicly.' On or off.",
      real:"Double-negative consent wording is common enough that the EU wrote it into law as a defect." },

    { screen:"Settings", sel:"#savePriv",
      crime:"Saving works correctly. The confirmation message reports the inverse.",
      law:"Feedback integrity — Nielsen #1. Confirmation that contradicts system state is worse than silence.",
      fix:"Report what actually happened.",
      real:"The version of this that ships in real products is subtler: a success message that appears before the write completes." },

    { screen:"Settings", sel:".corridor",
      crime:"Account deletion runs seven gates: a survey where every answer is 'I'll be back', three escalating phrases to type, a five-second hold, an identity check, and a cooling-off period cancelled by logging in. It does not delete the account.",
      law:"Roach Motel — Brignull (2010). Easy in, hard out.",
      fix:"Cancellation should take no more steps than signing up did. This is now law in several jurisdictions.",
      real:"Amazon internally named its Prime cancellation flow the 'Iliad Flow', after Homer's epic. The FTC sued in 2023; it ended in a $2.5 billion settlement — the largest of its kind." },

    /* ---------------- site-wide ---------------- */
    { screen:"Everywhere", sel:"#fs-sb",
      crime:"The native scrollbar is replaced, and each stratum gets a different broken one: it has mass on the feed, squirts out from under the cursor in Legal, retracts like a tape measure on sign-up, lags in eight staggered segments on Profiles, is 3px wide with both arrows reversed in Settings, and sits on the wrong side of the window in Awards.",
      law:"WCAG 2.2.2 (Pause, Stop, Hide): content that moves automatically for more than five seconds needs a way to stop it. Also user control — Nielsen #3.",
      fix:"Use the platform scrollbar. It is one of the few controls every single user already knows how to operate, and rebuilding it is almost never worth it.",
      real:"No company has shipped literally this — but scroll hijacking, where a marketing site overrides your wheel to run its own animation, is extremely real and reliably the most-complained-about thing on any site that does it." },

    { screen:"Everywhere", sel:"#postBtn",
      crime:"Every button on the site has a personality, assigned by hashing its identity: it dodges your cursor once, or demands confirmation, or wants a 450ms hold, or shrinks each time you hover, or drifts around its container, or waits 700ms before acting. Roughly one in seven is honest.",
      law:"Consistency and standards — Nielsen #4. Fitts's Law for the ones that move or shrink. And the Doherty Threshold for the ones that stall.",
      fix:"A button should do its thing, once, immediately, where you clicked it.",
      real:"Each of these is real somewhere: confirm-on-everything dialogs, buttons that shift as late content loads (the single most common cause of misclicks on the web), and unresponsive controls that give no feedback while working. Assembling them onto one page is the only invention here." },

    { screen:"Everywhere", sel:"#fs-nowplaying",
      crime:"A song plays at you from the moment you interact with the page. There is no mute here. The only volume control on the entire website is a slingshot on the sign-up form.",
      law:"WCAG 1.4.2 (Audio Control): audio that plays automatically for more than three seconds must have a mechanism to pause, stop, or control its volume independently.",
      fix:"Don't autoplay audio. If you must, put the control next to the sound, not on another page.",
      real:"MySpace profile songs autoplayed and stacked when you opened several profiles in tabs. WCAG 1.4.2 exists in large part because of that era of the web." },

    /* ---------------- legal ---------------- */
    { screen:"Legal", sel:"#pane",
      crime:"28,778 words shown six lines at a time, with the scroll wheel inverted and a reset to the top every 14 seconds.",
      law:"Obstruction, plus informed consent: an agreement nobody can physically read has not been agreed to.",
      fix:"A summary at the top, the full text below, and a link that survives navigation.",
      real:"GameStation's 2010 April Fools terms claimed customers' immortal souls. The overwhelming majority accepted without reading — which was the point of the experiment." },

    { screen:"Legal", sel:"#agree",
      crime:"The agreement checkbox only unlocks at the bottom of a document engineered to be unreachable.",
      law:"Forced Action — Brignull. Consent gated behind an impossible task is not consent.",
      fix:"Let people agree without a reading test, and make the terms genuinely readable if you want them read.",
      real:"Ryanair once hid 'No Travel Insurance Required' alphabetically inside a country dropdown, between Latvia and Lithuania (2010)." }
  ];

  /* ==================================================================
     STYLES — the panel is deliberately the best-designed thing here
     ================================================================== */
  var CSS = [
    /* the marker on each annotated element */
    ".fs-note-t{outline:2px dashed #d64545!important;outline-offset:3px!important;position:relative!important}",
    ".fs-note-t::after{content:attr(data-fsnote);position:absolute;top:-11px;left:-11px;z-index:900;",
      "width:21px;height:21px;border-radius:50%;background:#d64545;color:#fff;",
      "font:700 11px/21px ui-sans-serif,system-ui,sans-serif;text-align:center;",
      "box-shadow:0 1px 4px rgba(0,0,0,.4);pointer-events:none}",
    ".fs-note-t.fs-note-hi{outline-color:#1d7a4c!important;background:rgba(29,122,76,.09)!important}",

    /* the panel */
    "#fs-notes{position:fixed;top:0;right:0;bottom:0;width:392px;max-width:92vw;z-index:10000;",
      "background:#fbfbfa;border-left:1px solid #e3e1dd;box-shadow:-14px 0 40px rgba(23,22,20,.13);",
      "font:14px/1.55 ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#22201d;",
      "display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,.35,1)}",
    "#fs-notes.open{transform:none}",
    "#fs-notes header{padding:19px 22px 15px;border-bottom:1px solid #e9e7e3;flex:none;background:#fff}",
    "#fs-notes h2{margin:0 0 3px;font-size:16px;font-weight:650;letter-spacing:-.01em}",
    "#fs-notes .sub{margin:0;font-size:12.5px;color:#78736c;line-height:1.5}",
    "#fs-notes .x{position:absolute;top:15px;right:15px;width:27px;height:27px;border:none;border-radius:6px;",
      "background:#f0eee9;color:#57524b;font-size:15px;cursor:pointer;line-height:1}",
    "#fs-notes .x:hover{background:#e5e2db}",
    "#fs-notes .modes{display:flex;gap:5px;margin-top:11px}",
    "#fs-notes .modes button{flex:1;padding:6px 9px;border:1px solid #ddd9d2;border-radius:6px;",
      "background:#fff;color:#57524b;font:600 11.5px ui-sans-serif,system-ui,sans-serif;cursor:pointer}",
    "#fs-notes .modes button.on{background:#22201d;border-color:#22201d;color:#fff}",
    "#fs-notes .modes button:focus-visible{outline:2px solid #1d7a4c;outline-offset:2px}",
    "#fs-notes article.off{opacity:.5;cursor:default}",
    "#fs-notes article.off:hover{background:none}",
    "#fs-notes .x:focus-visible{outline:2px solid #1d7a4c;outline-offset:2px}",
    "#fs-notes .list{overflow-y:auto;padding:6px 0 30px;flex:1}",
    "#fs-notes .grp{padding:15px 22px 5px;font:600 11px/1 ui-sans-serif,system-ui,sans-serif;",
      "text-transform:uppercase;letter-spacing:.075em;color:#a09a91}",
    "#fs-notes article{padding:13px 22px;border-bottom:1px solid #eeece8;cursor:pointer}",
    "#fs-notes article:hover{background:#f4f2ee}",
    "#fs-notes article.sel{background:#f0f5f1;box-shadow:inset 3px 0 0 #1d7a4c}",
    "#fs-notes .n{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;",
      "border-radius:50%;background:#d64545;color:#fff;font:700 10.5px/1 sans-serif;margin-right:8px;vertical-align:1px}",
    "#fs-notes .crime{font-size:13.5px;font-weight:550;margin:0 0 9px;letter-spacing:-.005em}",
    "#fs-notes dl{margin:0;font-size:12.5px;line-height:1.55}",
    "#fs-notes dt{font:600 10px/1 ui-sans-serif,system-ui,sans-serif;text-transform:uppercase;",
      "letter-spacing:.07em;color:#8d8781;margin:9px 0 3px}",
    "#fs-notes dd{margin:0;color:#3f3b36}",
    "#fs-notes dd.law{color:#8a4b1f}",
    "#fs-notes dd.fix{color:#1d6b45}",
    "#fs-notes dd.real{color:#413c36;background:#f2efe9;border-left:2px solid #c9c2b6;padding:7px 10px;border-radius:0 4px 4px 0}",
    "#fs-notes footer{flex:none;padding:11px 22px;border-top:1px solid #e9e7e3;background:#fff;",
      "font-size:11.5px;color:#8d8781}",

    /* the way in */
    "#fs-notes-tab{position:fixed;right:0;bottom:78px;z-index:9990;background:#22201d;color:#fff;",
      "border:none;padding:9px 13px;border-radius:7px 0 0 7px;cursor:pointer;",
      "font:600 12px ui-sans-serif,system-ui,sans-serif;box-shadow:-2px 2px 10px rgba(0,0,0,.28)}",
    "#fs-notes-tab:focus-visible{outline:2px solid #fff;outline-offset:-4px}",
    /* on a wide screen, make room rather than covering the thing being explained */
    "@media (min-width:1100px){body.fs-notes-on{padding-right:392px}}",
    "@media (prefers-reduced-motion:reduce){#fs-notes{transition:none}}"
  ].join("");

  function injectCSS(){
    if (document.getElementById("fs-notes-css")) return;
    var s = document.createElement("style");
    s.id = "fs-notes-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ==================================================================
     WIRING
     ================================================================== */
  var panel = null, on = false, found = false, mode = "here";

  function visible(el){
    return el && el.offsetParent !== null && el.getClientRects().length > 0;
  }

  function build(){
    injectCSS();
    if (panel) return panel;
    panel = document.createElement("aside");
    panel.id = "fs-notes";
    panel.innerHTML =
      '<header><h2>Design Notes</h2>' +
      '<p class="sub">Every crime on this site, the principle it breaks, and who actually shipped it.</p>' +
      '<div class="modes"><button data-mode="here" class="on">On this screen</button>' +
      '<button data-mode="all">All ' + NOTES.length + '</button></div>' +
      '<button class="x" aria-label="Close design notes">✕</button></header>' +
      '<div class="list"></div>' +
      '<footer>The only well-designed thing here is the part explaining the rest.</footer>';
    document.body.appendChild(panel);
    panel.querySelector(".x").onclick = function(){ Notes.disable(); };
    [].forEach.call(panel.querySelectorAll(".modes button"), function(btn){
      btn.onclick = function(){
        mode = btn.dataset.mode;
        [].forEach.call(panel.querySelectorAll(".modes button"), function(b){
          b.classList.toggle("on", b === btn);
        });
        clear(); render();
      };
    });
    return panel;
  }

  function render(){
    var list = panel.querySelector(".list");
    list.innerHTML = "";
    var shown = 0, group = null;

    NOTES.forEach(function(note){
      var el = document.querySelector(note.sel);
      var here = visible(el);
      if (!here && mode !== "all") return;
      shown++;
      if (here){
        el.classList.add("fs-note-t");
        el.dataset.fsnote = shown;
      }

      if (note.screen !== group){
        group = note.screen;
        var g = document.createElement("div");
        g.className = "grp";
        g.textContent = group;
        list.appendChild(g);
      }

      var a = document.createElement("article");
      a.innerHTML =
        '<p class="crime"><span class="n">' + shown + "</span>" + esc(note.crime) + "</p>" +
        "<dl><dt>Principle broken</dt><dd class='law'>" + esc(note.law) + "</dd>" +
        "<dt>What correct looks like</dt><dd class='fix'>" + esc(note.fix) + "</dd>" +
        "<dt>In the wild</dt><dd class='real'>" + esc(note.real) + "</dd></dl>";
      if (!here) a.className = "off";
      a.onclick = function(){
        [].forEach.call(list.querySelectorAll("article.sel"), function(x){ x.classList.remove("sel"); });
        [].forEach.call(document.querySelectorAll(".fs-note-hi"), function(x){ x.classList.remove("fs-note-hi"); });
        if (!here) return;
        a.classList.add("sel");
        el.classList.add("fs-note-hi");
        try { el.scrollIntoView({block:"center", behavior:"smooth"}); } catch(e){ el.scrollIntoView(); }
      };
      list.appendChild(a);
    });

    if (!shown){
      list.innerHTML = '<div class="grp">Nothing annotated on this screen</div>';
    }
    var here = document.querySelectorAll(".fs-note-t").length;
    panel.querySelector("footer").textContent = (mode === "all")
      ? "All " + NOTES.length + " notes. " + here + " are on this screen; the rest are dimmed."
      : here + " of " + NOTES.length + " notes apply to this screen. Switch to All to read the rest.";
  }

  function esc(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function clear(){
    [].forEach.call(document.querySelectorAll(".fs-note-t"), function(el){
      el.classList.remove("fs-note-t", "fs-note-hi");
      delete el.dataset.fsnote;
    });
  }

  var Notes = {
    notes: NOTES,
    isOn: function(){ return on; },

    enable: function(){
      build();
      on = true;
      render();
      document.body.classList.add("fs-notes-on");
      requestAnimationFrame(function(){ panel.classList.add("open"); });
      try { localStorage.setItem(KEY, "1"); } catch(e){}
      if (global.FS && FS.Trophies) FS.Trophies.unlock("critic");
      var tab = document.getElementById("fs-notes-tab");
      if (tab) tab.textContent = "Design Notes ✕";
    },

    disable: function(){
      on = false;
      document.body.classList.remove("fs-notes-on");
      clear();
      if (panel) panel.classList.remove("open");
      try { localStorage.removeItem(KEY); } catch(e){}
      var tab = document.getElementById("fs-notes-tab");
      if (tab) tab.textContent = "Design Notes";
    },

    toggle: function(){ on ? this.disable() : this.enable(); },

    /** Re-scan after the page changes screens. */
    refresh: function(){ if (on){ clear(); render(); } }
  };

  /* the way in: press ? anywhere, or find the whisper-text link in a footer.
     once found, a permanent tab appears — discovery is earned only once. */
  function showTab(){
    if (document.getElementById("fs-notes-tab")) return;
    injectCSS();
    var b = document.createElement("button");
    b.id = "fs-notes-tab";
    b.textContent = on ? "Design Notes ✕" : "Design Notes";
    b.onclick = function(){ Notes.toggle(); };
    document.body.appendChild(b);
  }

  document.addEventListener("keydown", function(e){
    if (e.key !== "?" ) return;
    var t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || e.target.isContentEditable) return;
    found = true;
    try { localStorage.setItem("fs_notes_found", "1"); } catch(err){}
    showTab();
    Notes.toggle();
  });

  global.FS = global.FS || {};
  global.FS.Notes = Notes;
  global.FS.revealNotes = function(){       /* called by the whisper-text link */
    found = true;
    try { localStorage.setItem("fs_notes_found", "1"); } catch(e){}
    showTab();
    Notes.enable();
  };

  function boot(){
    var wasFound = false, wasOn = false;
    try {
      wasFound = localStorage.getItem("fs_notes_found") === "1";
      wasOn = localStorage.getItem(KEY) === "1";
    } catch(e){}
    if (wasFound) showTab();
    if (wasOn) Notes.enable();
    global.addEventListener("hashchange", function(){ setTimeout(function(){ Notes.refresh(); }, 420); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})(window);
