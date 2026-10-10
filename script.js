/* Content Bravio shared JavaScript
   Main website + backend testing page.
   When the backend is ready, set BACKEND_URL below. */

const BACKEND_URL = ""; // Example later: "https://api.contentbravio.com"

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'main') initMainSite();
  if (page === 'testing') initBackendTester();
});

function initMainSite() {
(() => {
      const $ = (s, root=document) => root.querySelector(s);
      const $$ = (s, root=document) => [...root.querySelectorAll(s)];
      const pick = arr => arr[Math.floor(Math.random()*arr.length)];
      const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

      const state = {
        clicks: 0,
        chaos: 12,
        achievements: new Set(),
        progress: 7,
        quizScore: 0,
        quizCategory: 'creator',
        rpsYou: 0,
        rpsSite: 0,
        bestReaction: null
      };

      function countClick(amount=1) {
        state.clicks += amount;
        state.chaos = Math.min(999, state.chaos + Math.max(1, Math.ceil(amount/2)));
        $('#clickStat').textContent = state.clicks;
        $('#chaosStat').textContent = state.chaos + '%';
        $('#vibeStat').textContent = state.chaos > 150 ? 'S+' : state.chaos > 80 ? 'A++' : 'A+';
        if (state.clicks === 10) achieve('Button Enthusiast', 'You clicked 10 things. The website noticed.');
        if (state.clicks === 50) achieve('Professional Procrastinator', '50 clicks. Astonishing commitment to absolutely nothing.');
      }

      document.addEventListener('click', e => {
        if (e.target.closest('button, .feature-card, .email, .mood-cell')) countClick();
      });

      function goPage(name) {
        $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-'+name));
        $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === name));
        window.scrollTo({top:0, behavior:'smooth'});
        addFeed(`Visited the ${name} section. Excellent use of company time.`);
      }
      $$('.nav-btn[data-page]').forEach(b => b.addEventListener('click', () => goPage(b.dataset.page)));
      $$('[data-go]').forEach(b => b.addEventListener('click', () => goPage(b.dataset.go)));
      $('.nav-home').addEventListener('click', () => goPage('home'));
      $('#randomPage').addEventListener('click', () => goPage(pick(['home','arcade','quiz','doodle','studio'])));

      function addFeed(text) {
        const feed = $('#activityFeed');
        const d = document.createElement('div');
        d.className = 'feed-item';
        d.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + ' — ' + text;
        feed.prepend(d);
        while (feed.children.length > 5) feed.lastElementChild.remove();
      }

      function achieve(title, desc) {
        if (state.achievements.has(title)) return;
        state.achievements.add(title);
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<b>🏆 ${title}</b><span>${desc}</span>`;
        $('#toasts').appendChild(t);
        setTimeout(() => t.remove(), 4200);
      }

      function showModal(title, text) {
        $('#modalTitle').textContent = title;
        $('#modalText').textContent = text;
        $('#modal').classList.add('show');
      }
      $('#closeModal').addEventListener('click', () => $('#modal').classList.remove('show'));
      $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) $('#modal').classList.remove('show'); });

      const statusMessages = [
        "Still cooking. Don't open the oven.", "The intern pressed something...", "Adding unnecessary animations...",
        "Pretending we understand the algorithm...", "Making the logo 2px bigger...", "Rewatching the same edit 47 times...",
        "Export failed. Classic.", "CEO said 'make it pop'...", "Optimising the vibes...", "Almost there. Probably.",
        "Uploading more pixels...", "Teaching the algorithm who's boss...", "Okay, this is actually looking good.",
        "One tiny revision became seventeen.", "Waiting for inspiration to reply in Slack.", "Making the subtitle emotionally available."
      ];
      $('#checkWebsite').addEventListener('click', () => {
        state.progress += rand(2,13);
        if (state.progress >= 99) {
          state.progress = 99;
          $('#status').textContent = '99% ready. The last 1% takes 6 months.';
          achieve('Almost There™', 'You reached 99%. There is legally no 100%.');
        } else $('#status').textContent = pick(statusMessages);
        $('#progress').style.width = state.progress + '%';
        $('#percentage').textContent = state.progress + '% ready';
        addFeed('Website readiness increased to ' + state.progress + '%. Nobody knows why.');
      });

      let bPresses = 0;
      $('#megaB').addEventListener('click', () => {
        bPresses++;
        const b = $('#megaB');
        b.style.transform = `rotate(${rand(-10,10)}deg) scale(${(92+rand(0,14))/100})`;
        setTimeout(()=> { b.style.transform=''; }, 450);
        if (bPresses === 7) achieve('B Button Believer', 'You pressed the Bravio logo seven times. Why?');
      });

      $('#surpriseMe').addEventListener('click', () => {
        const surprises = [
          () => goPage(pick(['arcade','quiz','doodle','studio'])),
          () => showModal('Breaking news', 'You have been selected as Employee of the Minute. Benefits expire almost immediately.'),
          () => { document.body.style.filter = `hue-rotate(${rand(60,300)}deg)`; setTimeout(()=>document.body.style.filter='',1200); },
          () => achieve('Surprise Recipient', 'You clicked a button without knowing the outcome. Bold.')
        ];
        pick(surprises)();
      });

      let panic = 0;
      $('#panicButton').addEventListener('click', () => {
        panic++;
        const texts = ['I said do not press.', 'Seriously?', 'We discussed this.', 'This is going in the report.', 'Fine. You win.'];
        $('#panicButton').textContent = texts[Math.min(panic-1, texts.length-1)];
        if (panic === 5) {
          document.body.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:400,iterations:2});
          achieve('Boundary Tester', 'Pressed the forbidden button five times. HR has been notified.');
        }
      });

      $('#mysteryCard').addEventListener('click', () => {
        showModal('Mystery Box Result', pick([
          'You won 3 invisible exposure points.',
          'Inside the box: another smaller box. Budget cuts.',
          'Congratulations. You found the premium air package.',
          'The box contained a meeting that could have been an email.',
          'Jackpot: one completely unsolicited opinion about your logo.'
        ]));
        achieve('Box Opener', 'Curiosity defeated caution.');
      });

      $('#achievementCard').addEventListener('click', () => {
        const list = state.achievements.size ? [...state.achievements].join(', ') : 'None yet. Start clicking suspicious things.';
        showModal(`Achievements (${state.achievements.size})`, list);
      });

      // Click Frenzy
      let clickGameTimer = null, clickGameScore = 0, clickGameEnd = 0;
      function moveTarget() {
        const arena = $('#clickArena'), target = $('#clickTarget');
        const maxX = Math.max(0, arena.clientWidth - 70), maxY = Math.max(0, arena.clientHeight - 70);
        target.style.left = rand(5,maxX) + 'px';
        target.style.top = rand(5,maxY) + 'px';
      }
      $('#startClickGame').addEventListener('click', () => {
        clearInterval(clickGameTimer);
        clickGameScore = 0; $('#clickScore').textContent='0';
        $('#clickIntro').style.display='none'; $('#clickTarget').style.display='block'; moveTarget();
        clickGameEnd = Date.now()+10000;
        clickGameTimer = setInterval(() => {
          if (Date.now() >= clickGameEnd) {
            clearInterval(clickGameTimer); $('#clickTarget').style.display='none'; $('#clickIntro').style.display='block';
            $('#startClickGame').textContent='Play again';
            showModal('Time!', `You hit the target ${clickGameScore} times. ${clickGameScore>=15?'Disturbingly fast.':clickGameScore>=8?'Respectable finger velocity.':'The target sends its regards.'}`);
            if (clickGameScore >= 15) achieve('Click Goblin', '15+ hits in Click Frenzy. Terrifying reflexes.');
          }
        },100);
      });
      $('#clickTarget').addEventListener('click', e => { e.stopPropagation(); clickGameScore++; $('#clickScore').textContent=clickGameScore; moveTarget(); countClick(); });

      // Reaction
      let reactionState='idle', reactionTimeout=null, reactionStart=0;
      $('#reactionBox').addEventListener('click', () => {
        const box=$('#reactionBox');
        if (reactionState==='idle') {
          reactionState='waiting'; box.className='waiting'; box.textContent='Wait for green…';
          reactionTimeout=setTimeout(()=>{reactionState='go'; reactionStart=performance.now(); box.className='go'; box.textContent='CLICK!';},rand(1200,3800));
        } else if (reactionState==='waiting') {
          clearTimeout(reactionTimeout); reactionState='idle'; box.className=''; box.textContent='Too early. Click to try again.'; $('#reactionResult').textContent='False start 😭';
        } else if (reactionState==='go') {
          const ms=Math.round(performance.now()-reactionStart); reactionState='idle'; box.className=''; box.textContent=`${ms} ms — click to retry`;
          if (state.bestReaction===null || ms<state.bestReaction) state.bestReaction=ms;
          $('#reactionResult').textContent=`Best: ${state.bestReaction} ms`;
          if (ms<250) achieve('Human Espresso Shot', `Reaction time: ${ms} ms.`);
        }
      });

      // RPS
      $$('.rps').forEach(btn=>btn.addEventListener('click',()=>{
        const you=btn.dataset.rps, site=pick(['rock','paper','scissors']);
        const win=(you==='rock'&&site==='scissors')||(you==='paper'&&site==='rock')||(you==='scissors'&&site==='paper');
        let text;
        if(you===site) text=`Tie. We both chose ${site}. Suspicious.`;
        else if(win){state.rpsYou++; text=`You win. Website chose ${site}.`;}
        else {state.rpsSite++; text=`Website wins with ${site}. Absolutely skill-based.`;}
        $('#rpsResult').textContent=text; $('#rpsScore').textContent=`You ${state.rpsYou} — ${state.rpsSite} Website`;
        if(state.rpsYou===5) achieve('Fist of Algorithm', 'Beat the website five times at RPS.');
      }));

      // Avoid button
      let avoidAttempts=0;
      function flee() {
        avoidAttempts++; const zone=$('#avoidZone'), btn=$('#avoidBtn');
        const x=rand(10,Math.max(10,zone.clientWidth-btn.offsetWidth-10));
        const y=rand(10,Math.max(10,zone.clientHeight-btn.offsetHeight-10));
        btn.style.left=x+'px'; btn.style.top=y+'px'; btn.style.transform='none';
        $('#avoidText').textContent=`Attempts: ${avoidAttempts} — ${pick(['too slow','nice try','almost','the button fears commitment','keep chasing'])}`;
        if(avoidAttempts===12) achieve('Persistent Nuisance', 'Chased the escape button 12 times.');
      }
      $('#avoidBtn').addEventListener('pointerenter', flee);
      $('#avoidBtn').addEventListener('touchstart', e=>{ e.preventDefault(); flee(); }, {passive:false});
      $('#avoidBtn').addEventListener('click',()=>{ showModal('Impossible?', 'You clicked it. The website would like to file an appeal.'); achieve('Button Catcher', 'Caught the evasive button.'); });

      // Memory
      const symbols=['🎬','🔥','😂','🚀','👀','💡','🎯','🧃'];
      let memoryFirst=null, memoryLock=false, memoryMoves=0, memoryMatches=0;
      function setupMemory(){
        memoryFirst=null; memoryLock=false; memoryMoves=0; memoryMatches=0; $('#memoryMoves').textContent='Moves: 0';
        const deck=[...symbols,...symbols].sort(()=>Math.random()-.5), grid=$('#memoryGrid'); grid.innerHTML='';
        deck.forEach((symbol,i)=>{
          const b=document.createElement('button'); b.className='memory-card'; b.type='button'; b.textContent=symbol; b.dataset.symbol=symbol; b.dataset.i=i;
          b.addEventListener('click',()=>flipMemory(b)); grid.appendChild(b);
        });
      }
      function flipMemory(card){
        if(memoryLock||card.classList.contains('matched')||card===memoryFirst) return;
        card.classList.add('flipped');
        if(!memoryFirst){memoryFirst=card; return;}
        memoryMoves++; $('#memoryMoves').textContent=`Moves: ${memoryMoves}`;
        if(memoryFirst.dataset.symbol===card.dataset.symbol){
          memoryFirst.classList.add('matched'); card.classList.add('matched'); memoryFirst=null; memoryMatches++;
          if(memoryMatches===symbols.length){ achieve('Memory Editor', `Cleared the board in ${memoryMoves} moves.`); showModal('Board cleared!', `You matched everything in ${memoryMoves} moves.`); }
        } else {
          memoryLock=true; const a=memoryFirst; memoryFirst=null;
          setTimeout(()=>{a.classList.remove('flipped'); card.classList.remove('flipped'); memoryLock=false;},650);
        }
      }
      $('#resetMemory').addEventListener('click',setupMemory); setupMemory();

      // Quiz
      const quizData={
        creator:[
          {q:'A client says “make it viral.” What is the correct first response?',a:['Ask what success means','Add 14 fire emojis','Promise 10M views by lunch','Turn off your phone'],c:0,f:'Correct. “Viral” is not a strategy, unfortunately.'},
          {q:'What is most likely to kill a short-form video?',a:['A weak opening','Using one font','Owning a tripod','Drinking water'],c:0,f:'The first seconds matter. The tripod is innocent.'},
          {q:'The edit is perfect, but the caption says “test123 final FINAL.” What now?',a:['Post immediately','Fix the caption','Delete the internet','Blame Mercury retrograde'],c:1,f:'Correct. Tiny details are still details.'},
          {q:'A client asks for “premium but Gen Z but corporate but meme.” Your best move?',a:['Clarify the brief','Scream professionally','Use Comic Sans','Create four brands at once'],c:0,f:'Clarifying the contradiction is cheaper than telepathy.'}
        ],
        internet:[
          {q:'Which phrase is most likely to appear right before unnecessary chaos?',a:['“Quick question”','“Looks good”','“No rush”','All of the above'],c:3,f:'Correct. Every option is a trap in its own special way.'},
          {q:'What does “final_v7_REAL_final2.mp4” usually mean?',a:['The actual final','There will be another export','The file is cursed','Both B and C'],c:3,f:'You understand creative production too well.'},
          {q:'What is the natural predator of productivity?',a:['A 4-minute Reel','Opening one “quick” tab','Notifications','All of them'],c:3,f:'The food chain is brutal.'},
          {q:'Someone comments “first.” What have they achieved?',a:['Historical importance','Absolutely nothing','SEO dominance','A tax deduction'],c:1,f:'Harsh, but accurate.'}
        ],
        personality:[
          {q:'You see a button labelled “DO NOT PRESS.” You…',a:['Ignore it','Press once','Press repeatedly','Inspect element first'],c:2,f:'Your personality type is: Problem Creator (Advanced).'},
          {q:'A deadline is in 48 hours. When does inspiration arrive?',a:['Immediately','24 hours before','47 hours and 58 minutes later','Never'],c:2,f:'Classic creative timing profile detected.'},
          {q:'Pick a meeting superpower.',a:['End on time','Mute everyone politely','Auto-generate action items','Become mysteriously offline'],c:0,f:'Rare choice. Responsible adult energy detected.'},
          {q:'Your browser has how many tabs open?',a:['1–5','6–15','16–40','I refuse to count'],c:3,f:'Diagnosis: tab ecosystem. Please do not disturb its habitat.'}
        ]
      };
      let currentQuiz=null, answered=false;
      function loadQuestion(){
        answered=false; const pool=quizData[state.quizCategory]; currentQuiz=pick(pool);
        $('#quizCategoryLabel').textContent={creator:'Creator brain',internet:'Internet nonsense',personality:'Highly scientific personality'}[state.quizCategory];
        $('#quizQuestion').textContent=currentQuiz.q; $('#quizFeedback').textContent=''; $('#quizAnswers').innerHTML='';
        currentQuiz.a.forEach((a,i)=>{const b=document.createElement('button');b.className='answer';b.type='button';b.textContent=a;b.addEventListener('click',()=>answerQuiz(b,i));$('#quizAnswers').appendChild(b);});
      }
      function answerQuiz(btn,i){
        if(answered)return; answered=true;
        const buttons=$$('.answer',$('#quizAnswers'));
        buttons[currentQuiz.c].classList.add('correct');
        if(i!==currentQuiz.c) btn.classList.add('wrong'); else {state.quizScore++; $('#quizScore').textContent=state.quizScore;}
        $('#quizFeedback').textContent=currentQuiz.f;
        if(state.quizScore===5) achieve('Questionable Scholar','Got five quiz answers correct. Diploma pending.');
      }
      $$('.category-btn').forEach(b=>b.addEventListener('click',()=>{state.quizCategory=b.dataset.category;loadQuestion();}));
      $('#nextQuestion').addEventListener('click',loadQuestion); loadQuestion();

      // Doodle
      const canvas=$('#doodleCanvas'), ctx=canvas.getContext('2d');
      let drawing=false, brushColor='#0866ff', brushSize=10, erasing=false, strokes=0;
      const colors=['#0866ff','#0a1833','#ff5caa','#24d17e','#ffd54a','#7b61ff','#ff5b5b','#ffffff'];
      colors.forEach(c=>{const d=document.createElement('button');d.className='color-dot'+(c===brushColor?' active':'');d.type='button';d.style.background=c;d.title=c;d.addEventListener('click',()=>{brushColor=c;erasing=false;$$('.color-dot').forEach(x=>x.classList.remove('active'));d.classList.add('active');$('#eraserBtn').textContent='Eraser';});$('#colorPalette').appendChild(d);});
      function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)};}
      canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=canvasPoint(e);ctx.beginPath();ctx.moveTo(p.x,p.y);});
      canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=canvasPoint(e);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=brushSize;ctx.strokeStyle=erasing?'#ffffff':brushColor;ctx.lineTo(p.x,p.y);ctx.stroke();});
      canvas.addEventListener('pointerup',()=>{if(drawing){drawing=false;strokes++;if(strokes===20)achieve('Digital Picasso-ish','Completed 20 doodle strokes.');}});
      $('#brushSize').addEventListener('input',e=>{brushSize=Number(e.target.value);$('#brushValue').textContent=brushSize;});
      $('#eraserBtn').addEventListener('click',()=>{erasing=!erasing;$('#eraserBtn').textContent=erasing?'Eraser ON':'Eraser';});
      $('#clearCanvas').addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);});
      $('#downloadDoodle').addEventListener('click',()=>{const a=document.createElement('a');a.download='bravio-masterpiece.png';a.href=canvas.toDataURL('image/png');a.click();achieve('Museum Pending','Downloaded a doodle. The Louvre has not replied.');});
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);

      // Chaos Studio
      const subjects=['a dentist','a gym owner','a sleepy accountant','a dramatic barista','a tiler','a dog groomer','a startup founder','a wedding photographer','a barber','a real estate agent'];
      const actions=['reviews celebrity habits','explains industry myths','reacts to terrible advice','ranks customer excuses','tries a viral challenge','teaches one oddly useful trick','confesses three trade secrets','tests a ridiculous hack'];
      const twists=['while on a treadmill','using only sticky notes','in under 15 seconds','with dramatic opera music','while their coworker judges them','using a tiny whiteboard','without saying the industry name','as if it is a courtroom drama'];
      $('#ideaBtn').addEventListener('click',()=>{$('#ideaOutput').textContent=`${pick(subjects)} ${pick(actions)} ${pick(twists)}.`;});
      const hooks=['Nobody tells you this about growing online…','Stop doing this before your next post.','I wasted six months learning this the hard way.','The boring reason your content is not working.','If I had to start from zero tomorrow, I would do this.','This looks wrong, but it works.','Three signs your content strategy needs an intervention.','You are probably overcomplicating this.'];
      $('#hookBtn').addEventListener('click',()=>{$('#hookOutput').textContent='“'+pick(hooks)+'”';});
      const excuses=['The export queue developed trust issues.','Adobe and I are currently taking space from each other.','The Wi-Fi saw the deadline and resigned.','The file became emotionally unavailable.','The final-final version started a family and moved interstate.','The render finished, but spiritually it was not ready.','I accidentally improved it and that created more work.'];
      $('#excuseBtn').addEventListener('click',()=>{$('#excuseOutput').textContent=pick(excuses);});
      const fortunes=['Your next post will get exactly enough views to make you overanalyse it.','A client will say “small change” and then describe a new project.','The algorithm sees you. The algorithm is confused.','A strangely simple video will outperform the one you spent six hours editing.','Someone will save your post and never look at it again. Destiny.','Your best idea will arrive while you are nowhere near a notes app.'];
      $('#fortuneBtn').addEventListener('click',()=>{$('#fortuneText').textContent=pick(fortunes);});

      const fakeEmails=[
        {from:'Big Client Energy',subject:'Tiny change :)',body:'Can we replace the footage, voiceover, music, hook, CTA and overall concept? Should be quick.'},
        {from:'Definitely Not The CEO',subject:'Make it pop',body:'Can you make it more premium, more casual, more corporate and more Gen Z? Keep it simple.'},
        {from:'Algorithm Department',subject:'Performance review',body:'We cannot explain why your worst video performed best. Please stop asking.'},
        {from:'Finance',subject:'URGENT',body:'Who subscribed to twelve editing tools and labelled all of them “essential infrastructure”?'},
        {from:'Intern',subject:'good news / bad news',body:'Good news: the render finished. Bad news: wrong aspect ratio.'}
      ];
      fakeEmails.forEach((m,i)=>{const d=document.createElement('div');d.className='email'+(i<2?' unread':'');d.innerHTML=`<strong>${m.from}</strong><span>${m.subject}</span>`;d.addEventListener('click',()=>{d.classList.remove('unread');showModal(m.subject,m.body);});$('#fakeInbox').appendChild(d);});

      const moodItems=[['⚡','#fff4bf'],['🎥','#dbe9ff'],['😵‍💫','#e7dcff'],['💥','#ffd8d8'],['🧠','#dbfff0'],['🪩','#ffe1f1'],['👀','#e7f1ff'],['📈','#e2fff0'],['🧃','#fff1d5']];
      function renderMood(){ const board=$('#moodBoard'); board.innerHTML=''; moodItems.sort(()=>Math.random()-.5).slice(0,6).forEach(([emoji,bg])=>{const d=document.createElement('div');d.className='mood-cell';d.textContent=emoji;d.style.background=bg;d.addEventListener('click',()=>{d.textContent=pick(['🔥','🧊','🧠','🌀','✨','👀','🧃','📸','🪩']);d.style.transform=`rotate(${rand(-8,8)}deg)`;});board.appendChild(d);}); }
      renderMood();

      // Secret / Konami
      const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
      let keyBuffer=[];
      function feedKey(k){
        keyBuffer.push(k.length===1?k.toLowerCase():k); if(keyBuffer.length>konami.length) keyBuffer.shift();
        if(konami.every((v,i)=>keyBuffer[i]===v)) unlockKonami();
      }
      function isEditingText(target) {
        return target instanceof Element && target.closest('input, textarea, select, [contenteditable]');
      }
      window.addEventListener('keydown',e=>{ if (!isEditingText(e.target)) feedKey(e.key); });
      $$('.key').forEach(k=>k.addEventListener('click',()=>feedKey(k.dataset.key)));
      function unlockKonami(){
        keyBuffer=[]; const overlay=$('#konami');overlay.classList.add('show');
        for(let i=0;i<70;i++){const c=document.createElement('i');c.className='confetti';c.style.left=rand(0,100)+'%';c.style.background=pick(['#fff','#ffd54a','#ff5caa','#24d17e','#7b61ff']);c.style.animationDelay=(Math.random()*1.5)+'s';overlay.appendChild(c);setTimeout(()=>c.remove(),4700);}
        achieve('Secret Sauce','Unlocked Bravio Overdrive.');
      }
      $('#closeKonami').addEventListener('click',()=>$('#konami').classList.remove('show'));

      // Tiny easter egg: typing BRAVIO anywhere
      let typed='';
      window.addEventListener('keypress',e=>{ if(isEditingText(e.target)) return; if(/^[a-z]$/i.test(e.key)){typed=(typed+e.key.toLowerCase()).slice(-6); if(typed==='bravio'){showModal('You typed BRAVIO', 'Secret handshake accepted. Your browser is now 7% more charismatic.'); achieve('Brand Loyalist','Typed the magic word.');}}});

      setTimeout(()=>achieve('Still Here','You stayed long enough for the website to become emotionally attached.'),45000);
    })();
}

function initBackendTester() {
  const $ = (selector) => document.querySelector(selector);
  const form = $('#clientForm');
  const nameInput = $('#name');
  const companyInput = $('#company');
  const clientsContainer = $('#clients');
  const message = $('#backendMessage');
  const statusDot = $('#statusDot');
  const statusText = $('#statusText');
  const refreshButton = $('#refreshClients');
  const checkButton = $('#checkBackend');

  function setStatus(type, text) {
    statusDot.className = 'status-dot' + (type ? ' ' + type : '');
    statusText.textContent = text;
  }

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#a52323' : '#607897';
  }

  function apiReady() {
    if (!BACKEND_URL) {
      setStatus('', 'Backend not connected yet');
      setMessage('Backend URL is empty in script.js. We will connect it in the next step.');
      clientsContainer.innerHTML = '<div class="empty-state">No database connection yet. The page is ready for it.</div>';
      return false;
    }
    return true;
  }

  async function request(path, options = {}) {
    const response = await fetch(BACKEND_URL.replace(/\/$/, '') + path, options);
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}${detail ? ': ' + detail : ''}`);
    }
    const type = response.headers.get('content-type') || '';
    return type.includes('application/json') ? response.json() : null;
  }

  async function checkBackend() {
    if (!apiReady()) return;
    setStatus('', 'Checking backend…');
    try {
      await request('/clients');
      setStatus('connected', 'Backend connected');
      setMessage('Connection successful.');
    } catch (error) {
      setStatus('error', 'Backend connection failed');
      setMessage(error.message, true);
    }
  }

  async function loadClients() {
    if (!apiReady()) return;
    clientsContainer.innerHTML = '<div class="empty-state">Loading records…</div>';
    try {
      const clients = await request('/clients');
      setStatus('connected', 'Backend connected');
      clientsContainer.innerHTML = '';

      if (!Array.isArray(clients) || clients.length === 0) {
        clientsContainer.innerHTML = '<div class="empty-state">Database connected, but there are no client records yet.</div>';
        return;
      }

      clients.forEach((client) => {
        const card = document.createElement('div');
        card.className = 'client';

        const name = document.createElement('strong');
        name.textContent = client.name || 'Unnamed client';

        const company = document.createElement('span');
        company.textContent = client.company || 'No company';

        card.append(name, company);
        clientsContainer.appendChild(card);
      });
      setMessage(`Loaded ${clients.length} client record${clients.length === 1 ? '' : 's'}.`);
    } catch (error) {
      clientsContainer.innerHTML = '<div class="empty-state">Could not load database records.</div>';
      setStatus('error', 'Backend connection failed');
      setMessage(error.message, true);
    }
  }

  async function addClient(event) {
    event.preventDefault();
    if (!apiReady()) return;

    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    if (!name || !company) {
      setMessage('Enter both a client name and company.', true);
      return;
    }

    try {
      setMessage('Saving client…');
      await request('/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company })
      });
      form.reset();
      setMessage('Client saved. Refreshing records…');
      await loadClients();
    } catch (error) {
      setStatus('error', 'Backend connection failed');
      setMessage(error.message, true);
    }
  }

  form.addEventListener('submit', addClient);
  refreshButton.addEventListener('click', loadClients);
  checkButton.addEventListener('click', checkBackend);

  apiReady();
  if (BACKEND_URL) loadClients();
}

