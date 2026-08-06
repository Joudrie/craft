/* Friendspace — the membership.
 *
 * Shared by feed.html and profile.html so that a post in the feed belongs to an
 * account you can actually go and visit. Most of these are trash by content;
 * a handful are trash by stylesheet, because their owner pasted CSS into the
 * profile editor and Friendspace does not validate it.
 */
(function (global) {
  "use strict";

  var P = [

    /* ---------- the ones who are simply people ---------- */
    {
      id:"terri", name:"Terri from HR", ini:"TH", col:"#b58f5a", friends:41, note:440,
      tag:"Human Resources Business Partner II",
      bio:"Hello! I use Friendspace to stay connected with colleagues.\n\nPlease direct all " +
          "workplace concerns to the appropriate channel and not to this profile.\n\nGo team!",
      css:"",
      posts:["Reminder that the annual potluck is either this Saturday or last Saturday.",
             "Per my last post.",
             "Just a friendly reminder that this platform is monitored."],
      comments:[{n:"Brayden Kowalczyk", d:"4h ago", t:"happy work anniversary!!"},
                {n:"Dad", d:"4h ago", t:"Is this the Terri from the thing"}]
    },
    {
      id:"dad", name:"Dad", ini:"D", col:"#6f8f6f", friends:12, note:392,
      tag:"Retired",
      bio:"body { background-color: blue; }\n" +
          "font { font-family: Arial; size: 3; }\n" +
          ".profile { width: 100%; }\n" +
          "TABLE.friendSpace { border: 1px solid; }\n" +
          "/* paste this in the box */\n" +
          "H1 { color: #000080; }\n" +
          "marquee { speed: fast; }\n\nSusan is this right",
      css:"",
      posts:["This is a test post. Please ignore.\n\nSent from my Friendspace",
             "Does anyone know a good plumber",
             "Testing 2",
             "Well, that's that."],
      comments:[{n:"Your Cousin's Wife", d:"4h ago", t:"Uncle Rick that goes in the OTHER box"},
                {n:"Dad", d:"4h ago", t:"Testing"},
                {n:"Dad", d:"4h ago", t:"Testing 2"}]
    },
    {
      id:"deb", name:"Aunt Deb", ini:"AD", col:"#b56f6f", friends:88, note:349,
      tag:"Blessed 🙏",
      bio:"Welcome to my page! I love my family, my garden, and my grandbabies.\n\n" +
          "I do not know why the page is so wide. I did not do that.",
      css:"#profile{min-width:3400px;background:linear-gradient(120deg,#cfe8c0,#f0e4b8 40%,#e8c0c0);" +
          "background-size:3400px 100%;background-repeat:no-repeat}",
      posts:["AMEN 🙏",
             "Happy birthday to my beautiful daughter who does not have a Friendspace and will never see this",
             "My condolences to the family. She was a wonderful car."],
      comments:[{n:"Dad", d:"4h ago", t:"Deb your page goes sideways"},
                {n:"Aunt Deb", d:"4h ago", t:"I know Rick"}]
    },
    {
      id:"marcus", name:"MARCUS_1987", ini:"M", col:"#5a86b5", friends:203, note:293,
      tag:"keeping it real since 1987",
      bio:"whats up friendspace. hit me up. i fixed my layout last night it looks way better now",
      css:"#profile *{display:inline!important}#profile{display:block!important;line-height:2.1}" +
          "#profile .pic,#profile .t8 .av{width:40px!important;height:22px!important;" +
          "line-height:22px!important;font-size:10px!important}",
      posts:["throwback to when this website worked",
             "why is the scrollbar doing that",
             "looks fine on my end"],
      comments:[{n:"xXx_Nightshade_xXx", d:"4h ago", t:"bro what happened"},
                {n:"MARCUS_1987", d:"4h ago", t:"looks fine on my end"}]
    },
    {
      id:"nightshade", name:"xXx_Nightshade_xXx", ini:"XN", col:"#2a2a33", friends:666, note:311,
      tag:"the darkness is my only friend",
      bio:"dont bother reading this you cant see it anyway\n\nthats the point",
      css:"#profile{background:#0a0a0e;color:#16161c}#profile a{color:#131319}" +
          "#profile *{font-family:Papyrus,fantasy!important;cursor:crosshair}" +
          "#profile .sec{border-bottom-color:#1a1a22;color:#17171e}#profile .tag{color:#141419}" +
          "#profile .wall .c{border-bottom-color:#111118}#profile .wall .c .cn{color:#181820}",
      posts:["nobody understands", "13 years ago today I posted this. Sharing it again."],
      comments:[{n:"Aunt Deb", d:"4h ago", t:"Honey I cant read any of this"},
                {n:"MARCUS_1987", d:"4h ago", t:"sick layout bro"}]
    },
    {
      id:"ashleigh", name:"★·.·´¯`·.·★ Ashleigh ★·.·´¯`·.·★", ini:"A", col:"#c47bb4", friends:1204, note:523,
      tag:"~*~ liVe LaUgH lOvE ~*~",
      bio:"hey everyone!!! welcome 2 my page!!! ♥♥♥\n\nplz sign my wall!!! ♥",
      css:"#profile{background:#ff66cc;color:#5a005a;" +
          "background-image:radial-gradient(2px 2px at 12px 18px,#fff,transparent)," +
          "radial-gradient(2px 2px at 60px 44px,#ffff66,transparent);background-size:74px 74px}" +
          "#profile *{font-family:'Comic Sans MS',cursive!important;text-shadow:2px 2px 0 #ff00ff;letter-spacing:2px}" +
          "#profile h1{transform:rotate(-3deg);color:#fff}" +
          "#profile .sec{border-bottom:3px dashed #ffff00;color:#fff}" +
          "#profile .bio{background:rgba(255,255,255,.35);padding:8px;transform:rotate(1deg)}" +
          "#profile .wall .c{border-bottom:2px dotted #ffff66}",
      posts:["plz sign my wall!!! ♥", "who keeps moving me to slot 6"],
      comments:[{n:"Brayden Kowalczyk", d:"4h ago", t:"signed ur wall ♥ sign mine back"},
                {n:"Terri from HR", d:"4h ago", t:"Ashleigh could you please make this readable for the newsletter"}]
    },

    /* ---------- the trash ---------- */
    {
      id:"dad2", name:"Dad (2)", ini:"D2", col:"#8f9f6f", friends:3, note:415,
      tag:"Retired",
      bio:"sorry everyone i got hacked this is my new account please add me\n\nthis is the real one",
      css:"",
      posts:["sorry everyone i was hacked. do not click the link i sent. also do not click this link",
             "this is the real dad",
             "add my new account"],
      comments:[{n:"Aunt Deb", d:"4h ago", t:"Rick is this you"},
                {n:"Dad", d:"4h ago", t:"That is not me"},
                {n:"Dad (2)", d:"4h ago", t:"it is me"}]
    },
    {
      id:"jessica", name:"Jessica  Williams ✔", ini:"JW", col:"#9aa8b8", friends:4, note:466,
      tag:"Model / Entrepreneur / Traveler",
      bio:"hi :) i am new here add me\n\nSee my other photos at the link\n\n" +
          "[link removed]\n[link removed]\n[link removed]",
      css:"",
      posts:["hi :) new here, add me",
             "Check out this link 🔗 [link removed]",
             "hello handsome how are you today"],
      comments:[{n:"Gen. Marcus Steele", d:"4h ago", t:"Hello Jessica. I too am new here."},
                {n:"Terri from HR", d:"4h ago", t:"Reported."}]
    },
    {
      id:"moonriver", name:"MoonRiver Wellness ✨ Ask Me How!", ini:"MW", col:"#c9a8d6", friends:2891, note:587,
      tag:"Boss Babe · Team Leader · Dream Builder",
      bio:"hey girl!! ✨\n\ni was JUST like you. tired. stuck. scrolling.\n\nthen i said yes to me.\n\n" +
          "not a scam. not an mlm. an OPPORTUNITY.\n\ndm me the word ✨MOON✨ (must be exact)",
      css:"#profile{background:linear-gradient(160deg,#fde6f4,#e6f0ff 60%,#fff4e0)}" +
          "#profile *{font-family:'Brush Script MT',cursive!important;text-transform:lowercase!important;" +
          "line-height:2.4!important;letter-spacing:1px}" +
          "#profile h1{font-size:34px}#profile .sec{border-bottom-color:#e6b8d6}",
      posts:["hey girl!! ✨ i was JUST like you. then i said yes to me.",
             "only 3 spots left on my team!! (there are always 3 spots)",
             "not an mlm. an opportunity. dm me the word ✨MOON✨ (must be exact)"],
      comments:[{n:"Terri from HR", d:"4h ago", t:"Please stop messaging colleagues about this"},
                {n:"MoonRiver Wellness ✨ Ask Me How!", d:"4h ago", t:"hey girl!! 💕 quick question"}]
    },
    {
      id:"bigsavings", name:"BIG SAVINGS DAILY!!!", ini:"BS", col:"#e05a2b", friends:41288, note:622,
      tag:"OFFICIAL PAGE ✔✔✔",
      bio:"TYPE AMEN TO WIN\n\n99% CANT SHARE THIS\n\nWE ARE GIVING AWAY 40 RVS THAT DIDNT SELL\n\n" +
          "ONLY 2 LEFT!!! (posted 2013)",
      css:"#profile{background:#fff200}#profile *{font-family:Impact,'Arial Black',sans-serif!important;" +
          "text-transform:uppercase!important;color:#c00}" +
          "#profile h1{animation:pulse .6s infinite alternate}" +
          "@keyframes pulse{from{transform:scale(1)}to{transform:scale(1.09)}}" +
          "#profile .sec{border-bottom:4px double #c00}",
      posts:["TYPE AMEN TO WIN A FREE RV. 99% OF PEOPLE CANT DO THIS.",
             "COSTCO IS GIVING AWAY $500 COUPONS TO EVERYONE WHO SHARES. THIS IS NOT A JOKE.",
             "ONLY 2 LEFT!!! (posted 2013)"],
      comments:[{n:"Aunt Deb", d:"4h ago", t:"AMEN"},
                {n:"Sharon Whitaker", d:"4h ago", t:"AMEN 🙏"},
                {n:"Dad", d:"4h ago", t:"Amen"},
                {n:"Marlene Hodge", d:"4h ago", t:"Beautiful!"}]
    },
    {
      id:"gensteele", name:"Gen. Marcus Steele", ini:"MS", col:"#5d6b52", friends:9, note:277,
      tag:"United States Army · Deployed",
      bio:"I am a widower general stationed overseas. I do not use this website often.\n\n" +
          "I am looking for genuine friendship only. I am not able to video call due to " +
          "military regulations.\n\nDo you have a moment to discuss a private matter.",
      css:"#profile .pic{filter:blur(2px)}#profile *{user-select:none}",
      posts:["Greetings. I am a widower general stationed overseas.",
             "Do you have a moment to discuss a private matter.",
             "I am unable to video call due to military regulations."],
      comments:[{n:"Terri from HR", d:"4h ago", t:"This is a scam account everyone"},
                {n:"Aunt Deb", d:"4h ago", t:"What a nice young man"}]
    },
    {
      id:"ricks", name:"Rick's Small Engine Repair", ini:"RS", col:"#7a6a4f", friends:63, note:330,
      tag:"Permanently closed · Still posting",
      bio:"SMALL ENGINE REPAIR — MOWERS, TRIMMERS, GENERATORS\n\nCLOSED SINCE 2011\n\n" +
          "WE ARE STILL CLOSED\n\nPlease stop calling the house",
      css:"#profile{text-align:center}#profile *{letter-spacing:-2px!important;" +
          "font-family:'Arial Narrow',Arial,sans-serif!important}" +
          "#profile .pic{width:230px!important;height:60px!important;line-height:60px!important}",
      posts:["WE ARE CLOSED",
             "STILL CLOSED",
             "Please stop calling the house"],
      comments:[{n:"Guy You Met At A Wedding In 2011", d:"4h ago", t:"are you open"},
                {n:"Rick's Small Engine Repair", d:"4h ago", t:"NO"}]
    },
    {
      id:"crypto", name:"Braydon | Financial Freedom 📈", ini:"BF", col:"#3f7d5a", friends:5107, note:494,
      tag:"6 figures at 23 · DM for mentorship",
      bio:"most people will never read this.\n\nthats why most people are broke.\n\n" +
          "i woke up at 4am today. did you.\n\nDM me FREEDOM for the blueprint ($1,997 value)",
      css:"",
      posts:["most people will never read this. thats why most people are broke.",
             "i woke up at 4am today. did you.",
             "Not financial advice. But it is advice. And it is financial."],
      comments:[{n:"MARCUS_1987", d:"4h ago", t:"what do you actually do though"},
                {n:"Braydon | Financial Freedom 📈", d:"4h ago", t:"DM me FREEDOM"}]
    },
    {
      id:"sharon", name:"Sharon Whitaker", ini:"SW", col:"#a8895a", friends:317, note:370,
      tag:"Grandma of 6 🌻",
      bio:"Just here for the grandbabies and the funny pictures.\n\n" +
          "Someone please tell me how to make the letters bigger.",
      css:"",
      posts:["[minion holding a wine glass]\n\nIT'S 5 O'CLOCK SOMEWHERE!!!",
             "[minion]\n\nI'M NOT ARGUING I'M JUST EXPLAINING WHY I'M RIGHT",
             "Someone please tell me how to make the letters bigger"],
      comments:[{n:"Marlene Hodge", d:"4h ago", t:"Beautiful!"},
                {n:"Aunt Deb", d:"4h ago", t:"So true Sharon"}]
    },
    {
      id:"gerald", name:"Gerald Pruitt", ini:"GP", col:"#6b7f96", friends:29, note:262,
      tag:"—",
      bio:"weather tomorrow",
      css:"",
      posts:["google", "weather tomorrow", "how to delete a post", "www.friendspace.com"],
      comments:[{n:"Your Cousin's Wife", d:"4h ago", t:"Dad this is the status box again"},
                {n:"Gerald Pruitt", d:"4h ago", t:"ok"}]
    },
    {
      id:"marlene", name:"Marlene Hodge", ini:"MH", col:"#b58fa8", friends:404, note:440,
      tag:"Beautiful!",
      bio:"Beautiful!",
      css:"",
      posts:["Beautiful!", "So beautiful!", "Beautiful!!"],
      comments:[{n:"Marlene Hodge", d:"4h ago", t:"Beautiful!"},
                {n:"Marlene Hodge", d:"4h ago", t:"Beautiful!"},
                {n:"Terri from HR", d:"4h ago", t:"Marlene this is a post about a flood"}]
    },
    {
      id:"tyler", name:"@tyler.builds", ini:"TB", col:"#4f5f6f", friends:812, note:349,
      tag:"Automated · cross-posting since 2019",
      bio:"I posted a new photo to my Instagram\n\n[link expired]\n\n" +
          "I posted a new photo to my Instagram\n\n[link expired]",
      css:"",
      posts:["I posted a new photo to my Instagram [link expired]",
             "I posted a new photo to my Instagram [link expired]",
             "I posted a new photo to my Instagram [link expired]"],
      comments:[{n:"Kyle \"Big Kyle\" Petersen", d:"4h ago", t:"link doesnt work"},
                {n:"Kyle \"Big Kyle\" Petersen", d:"4h ago", t:"still doesnt work"}]
    },
    {
      id:"severed", name:"SEVERED CIRCUIT", ini:"SC", col:"#3a3a44", friends:118, note:207,
      tag:"Metalcore · Dayton OH · est. 2006",
      bio:"NEW EP 'THE HOLLOWING' OUT NOW ON MYSPACE\n\nSHOWS:\nnone\n\n" +
          "BOOKING: severedcircuitbooking@[expired]\n\nlast updated 2009",
      css:"#profile{background:#151519;color:#8a8a94}#profile .sec{color:#c0392b;border-bottom-color:#3a1a1a}" +
          "#profile h1{font-family:Impact,sans-serif;letter-spacing:4px;color:#c0392b}",
      posts:["NEW EP 'THE HOLLOWING' OUT NOW ON MYSPACE",
             "SHOWS: none",
             "check out my band"],
      comments:[{n:"Kyle \"Big Kyle\" Petersen", d:"posted 3/11/2009", t:"sick set last night boys"},
                {n:"MARCUS_1987", d:"4h ago", t:"are you guys still together"}]
    },
    {
      id:"coach", name:"Coach Danny R.", ini:"CD", col:"#5a7d4f", friends:246, note:294,
      tag:"U12 Travel · Assistant Coach",
      bio:"FINAL: 3-2\nFINAL: 1-4\nFINAL: 2-2\nFINAL: 6-0\nFINAL: 0-1\n\nProud of these kids.",
      css:"",
      posts:["FINAL: 3-2", "FINAL: 0-1", "FINAL: 2-2. Proud of these kids."],
      comments:[{n:"Aunt Deb", d:"4h ago", t:"Which team is ours"},
                {n:"Coach Danny R.", d:"4h ago", t:"FINAL: 3-2"}]
    },
    {
      id:"patricia", name:"Patricia Nunn", ini:"PN", col:"#8f7f9a", friends:521, note:330,
      tag:"So sorry for your loss ♥",
      bio:"Thinking of you all during this difficult time. ♥",
      css:"",
      posts:["So sorry for your loss ♥",
             "Thinking of you during this difficult time ♥",
             "Praying for the family ♥"],
      comments:[{n:"Brayden Kowalczyk", d:"4h ago", t:"Patricia this is my new couch"},
                {n:"Patricia Nunn", d:"4h ago", t:"So sorry for your loss ♥"}]
    },
    {
      id:"walter", name:"Walter Kessler", ini:"WK", col:"#7f7f7f", friends:71, note:392,
      tag:"—",
      bio:"Buick1974!\n\nhow do i delete a post",
      css:"",
      posts:["Buick1974!", "how do i delete a post", "nevermind"],
      comments:[{n:"Terri from HR", d:"4h ago", t:"Walter change your password immediately"},
                {n:"MARCUS_1987", d:"4h ago", t:"nice password bro"},
                {n:"Walter Kessler", d:"4h ago", t:"Buick1975!"}]
    },
    {
      id:"kyle", name:"Kyle \"Big Kyle\" Petersen", ini:"KP", col:"#8a7bc4", friends:389, note:466,
      tag:"guy from your high school",
      bio:"you know me\n\nyou dont remember me but you know me",
      css:"",
      posts:["check out my band",
             "Not to be dramatic but I will be taking a break from Friendspace. See you in about 40 minutes.",
             "hey is your wall ok"],
      comments:[{n:"MARCUS_1987", d:"4h ago", t:"big kyle!!"},
                {n:"Kyle \"Big Kyle\" Petersen", d:"4h ago", t:"you know it"}]
    },
    {
      id:"brayden", name:"Brayden Kowalczyk", ini:"BK", col:"#7b91c4", friends:157, note:523,
      tag:"living, laughing, loving",
      bio:"Just wanted to say thank you to everyone. You know why.",
      css:"",
      posts:["Just wanted to say thank you to everyone. You know why.",
             "Anyone else's Friendspace acting funny today or is it just mine",
             "Selling: one (1) couch. Free. Must take today. Also I've moved."],
      comments:[{n:"Patricia Nunn", d:"4h ago", t:"So sorry for your loss ♥"},
                {n:"Aunt Deb", d:"4h ago", t:"What happened honey"}]
    },
    {
      id:"cousin", name:"Your Cousin's Wife", ini:"CW", col:"#7bc4a8", friends:602, note:415,
      tag:"—",
      bio:"Admin of 4 local buy-nothing groups. Do not message me about the couch.",
      css:"",
      posts:["Does anybody know how to delete an account. asking for me",
             "PSA: if you can read this, my account is working. If you cannot read this, please let me know.",
             "I have read the Terms of Service. All 30,000 words. Ask me anything."],
      comments:[{n:"Brayden Kowalczyk", d:"4h ago", t:"is the couch still available"},
                {n:"Your Cousin's Wife", d:"4h ago", t:"no"}]
    },
    {
      id:"wedding", name:"Guy You Met At A Wedding In 2011", ini:"GW", col:"#a8a85a", friends:1043, note:262,
      tag:"we talked for like 20 minutes",
      bio:"Hey! Great meeting you at the wedding. We should grab a beer sometime.\n\n" +
          "(posted 2011, never followed up)",
      css:"",
      posts:["Just liked a post and it took 11 seconds. Living the dream.",
             "hey is your wall ok",
             "Congratulations to my nephew on his graduation from the thing he graduated from!!!"],
      comments:[{n:"Kyle \"Big Kyle\" Petersen", d:"4h ago", t:"who is this"},
                {n:"Guy You Met At A Wedding In 2011", d:"4h ago", t:"we talked for like 20 minutes"}]
    }
  ];

  global.FS = global.FS || {};
  global.FS.People = P;
  global.FS.person = function (id) {
    for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i];
    return null;
  };
  global.FS.randomPerson = function () { return P[Math.floor(Math.random() * P.length)]; };

})(window);
