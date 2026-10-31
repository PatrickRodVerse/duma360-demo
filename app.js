import {seedData} from './data.js';
import {TODAY, escapeHTML as E, normalize, filterContents, summary, reviewContent, restoreData} from './model.js?v=20261030-client';

const paths = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2m4 0h2"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  library:'<rect x="4" y="4" width="6" height="16" rx="1"/><path d="M13 4v16m3-15 4 14M4 8h6"/>',
  chart:'<path d="M4 4v16h17M8 15v-4m5 4V6m5 9v-7"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  settings:'<path d="m9.5 3-.6 2.1-2 .9-2-.5-2 3.4 1.4 1.6v2.3l-1.4 1.6 2 3.4 2-.5 2 .9.6 2.1h4.2l.6-2.1 2-.9 2 .5 2-3.4-1.4-1.6v-2.3l1.4-1.6-2-3.4-2 .5-2-.9L13.7 3Z"/><circle cx="11.6" cy="11.9" r="3"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  'chevron-down':'<path d="m7 10 5 5 5-5"/>',
  'chevron-right':'<path d="m9 6 6 6-6 6"/>',
  'chevron-left':'<path d="m15 6-6 6 6 6"/>',
  chevrons:'<path d="m9 8 3-3 3 3m-6 8 3 3 3-3"/>',
  'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
  'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  sparkles:'<path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Zm7-1v4m-2-2h4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x:'<path d="m6 6 12 12M18 6 6 18"/>',
  play:'<path d="m9 5 11 7-11 7V5Z"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/>',
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  microphone:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  send:'<path d="m21 3-7 18-4-7-7-4 18-7ZM10 14l5-5"/>',
  message:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-2 2m3 5a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l2-2"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1.1.8-1.7 1.2-1.7 2.7M12 17h.01"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  reset:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',
  palette:'<circle cx="8" cy="9" r=".6"/><circle cx="12" cy="6" r=".6"/><circle cx="16" cy="9" r=".6"/><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1-2.6H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/>',
  user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a7 7 0 0 1 14 0v2"/>',
};
const icon = (name, extra='') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${paths[name] || paths.layers}</svg>`;
const navItems=[['overview','Visão geral','grid'],['approvals','Revisões','check-circle'],['conversation','Conversa','message']];
const labels=Object.fromEntries(navItems.map(([id,label])=>[id,label]));labels.settings='Configurações';
const storageKey='duma360-studio-v1';
let data;try{data=restoreData(localStorage.getItem(storageKey),seedData)}catch{data=structuredClone(seedData)}
let settings={name:'Antônio Olavo',email:'antonio@duma.studio',bio:'Ideias, quadros e o próximo Degustonho.',motion:true,accent:'forest'};
try{Object.assign(settings,JSON.parse(localStorage.getItem(storageKey+'-settings')||'{}'))}catch{}
let view='overview',profile='all',settingTab='profile',lastFocus=null,toastTimer=null,assistantDraft='';
const pendingTasks=new Map();
let messages=[];
const main=document.querySelector('#main');
const person=id=>data.people.find(item=>item.id===id)||data.people[0];
const profileFor=id=>data.profiles.find(item=>item.id===id)||data.profiles[0];
const pIndex=id=>data.profiles.findIndex(item=>item.id===id);
const compactNumber=value=>new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:1}).format(value);
const fullDate=date=>new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.','');
const motion=()=>settings.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const avatar=(id,size='')=>{const p=person(id);return `<span class="avatar ${size}" style="background:${p.color}" title="${E(p.name)}">${E(p.initials)}</span>`};
const statusClass=value=>({'Agendado':'green','Aprovação':'amber','Em edição':'blue','Publicado':'neutral','Ideia':'rose'}[value]||'neutral');
const pill=value=>`<span class="pill ${statusClass(value)}"><i class="dot"></i>${E(value)}</span>`;
const cover=(item,large=false)=>large?`<div class="approval-cover p${pIndex(item.profileId)}"><span class="cover-word">${E(item.title.replace(/^(Reel|Corte) - /,'').split(':')[0])}<small>${E(profileFor(item.profileId).name)}</small></span></div>`:`<span class="cover p${pIndex(item.profileId)}">${icon(item.type==='Foto'?'grid':'play')}</span>`;
const profileOptions=()=>`<option value="all">Todos os perfis</option>${data.profiles.map(p=>`<option value="${E(p.id)}" ${p.id===profile?'selected':''}>${E(p.name)}</option>`).join('')}`;
const selectControl=()=>`<label class="select-control"><span class="sr-only">Filtrar perfil</span><select data-filter="profile" aria-label="Filtrar perfil">${profileOptions()}</select><span>${icon('chevron-down')}</span></label>`;
const empty=(title,description)=>`<div class="empty-state">${icon('check-circle')}<strong>${E(title)}</strong>${E(description)}</div>`;

function persist(){try{localStorage.setItem(storageKey,JSON.stringify(data))}catch{toast('Não foi possível guardar esta alteração na prévia. Tente novamente.')}}
function log(text){data.activity.unshift({id:crypto.randomUUID(),text,time:'Agora',kind:'demo'});data.activity=data.activity.slice(0,20);persist()}
function toast(message){clearTimeout(toastTimer);const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),4200)}
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon))}
function applySettings(){document.documentElement.style.setProperty('--green',({forest:'#24553d',olive:'#596642',graphite:'#3b4842'})[settings.accent]||'#24553d');document.body.classList.toggle('compact',Boolean(settings.compact));document.querySelector('.user-name').textContent=settings.name;}
function saveSettings(){try{localStorage.setItem(storageKey+'-settings',JSON.stringify(settings))}catch{}applySettings()}

function renderNav(){
 const nav=document.querySelector('#navigation');
 const focusedNav=nav.contains(document.activeElement)?document.activeElement.dataset.nav:null;
 nav.querySelectorAll('.nav-item').forEach(el=>el.remove());
 nav.insertAdjacentHTML('beforeend',navItems.map(([id,label,i])=>`<button class="nav-item ${view===id?'active':''}" data-nav="${id}" ${view===id?'aria-current="page"':''}>${icon(i)}<span>${label}</span>${id==='approvals'?`<span class="nav-badge">${summary(weekContents('all')).approvals}</span>`:''}</button>`).join(''));
 if(focusedNav)nav.querySelector(`[data-nav="${focusedNav}"]`)?.focus({preventScroll:true});
 requestAnimationFrame(()=>{const active=nav.querySelector('.active');const lens=nav.querySelector('.nav-lens');if(!lens)return;lens.style.opacity=active?'1':'0';if(active){const props={x:active.offsetLeft,y:active.offsetTop,width:active.offsetWidth,height:active.offsetHeight,duration:motion()?.38:0,ease:'power3.out'};if(window.gsap)gsap.to(lens,props);else Object.assign(lens.style,{width:props.width+'px',height:props.height+'px',transform:`translate(${props.x}px,${props.y}px)`})}});
}
function heading(title,subtitle,filter=false){return `<div class="page-heading"><div><h1>${E(title)}</h1><p>${E(subtitle)}</p></div>${filter?`<div class="heading-actions">${selectControl()}</div>`:''}</div>`}
function initializeMessages(){if(!messages.length)messages=[{role:'assistant',html:`<p>Oi, ${E(String(settings.name).split(' ')[0])}. O que vamos colocar em movimento?</p><p>Faça um pedido. Eu preparo uma prévia para você decidir.</p><div class="suggestion-chips"><button data-prompt="Cria uma meta de edição do Degustonho para a Sara até sexta">Preparar uma tarefa</button><button data-prompt="O que precisa de aprovação?">Ver aprovações</button><button data-prompt="Como está a agenda da semana?">Consultar a semana</button></div>`}];}
// shortcut: the preview uses this example week; connect a selected period with live data later.
function weekContents(selectedProfile=profile){return filterContents(data.contents,{profile:selectedProfile}).filter(c=>c.date>='2026-10-26'&&c.date<='2026-11-01')}
function overview(){
 const rows=weekContents();
 const stats=summary(rows);
 const pending=rows.filter(c=>c.status==='Aprovação').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const upcoming=rows.filter(c=>c.status==='Agendado'&&c.date>=TODAY).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 return heading('Visão geral','Acompanhe seus conteúdos e o que precisa de você.',true)+`<p class="dashboard-period">Semana de 26 de outubro a 1 de novembro de 2026</p><section class="dashboard-metrics" aria-label="Resumo da semana">${[['Para revisar',stats.approvals],['Em edição',stats.editing],['Publicados',stats.published],['Visualizações',stats.views]].map(([label,value])=>`<div class="dashboard-metric"><span>${E(label)}</span><strong ${label==='Visualizações'?`title="${new Intl.NumberFormat('pt-BR').format(value)} visualizações"`:''}>${label==='Visualizações'?compactNumber(value):value}</strong></div>`).join('')}</section><div class="dashboard-layout"><section class="dashboard-panel dashboard-pending"><header class="dashboard-panel-header"><h2>Precisa da sua aprovação</h2><span class="pill neutral">${pending.length}</span></header>${pending.length?pending.slice(0,3).map(c=>`<button class="dashboard-row" data-detail="${E(c.id)}">${cover(c)}<span class="dashboard-row-copy"><strong>${E(c.title)}</strong><small>${E(profileFor(c.profileId).name)} · ${E(person(c.ownerId).name)}</small></span><span class="dashboard-row-meta">Revisar ${icon('chevron-right')}</span></button>`).join(''):empty('Tudo revisado','As próximas aprovações aparecem aqui.')}<footer class="dashboard-panel-footer"><button class="text-link" data-nav="approvals">Ver todas as revisões ${icon('arrow-right')}</button></footer></section><section class="dashboard-panel dashboard-upcoming"><header class="dashboard-panel-header"><h2>Próximas publicações</h2><span class="pill neutral">${upcoming.length}</span></header>${upcoming.length?upcoming.slice(0,3).map(c=>`<button class="dashboard-row" data-detail="${E(c.id)}">${cover(c)}<span class="dashboard-row-copy"><strong>${E(c.title)}</strong><small>${E(profileFor(c.profileId).name)}</small></span><time class="dashboard-row-meta" datetime="${E(c.date)}T${E(c.time)}">${fullDate(c.date)}<br>${E(c.time)}</time></button>`).join(''):empty('Sem publicações programadas','Os próximos conteúdos aparecem quando forem agendados.')}</section></div>`;
}
function conversationPage(){
 initializeMessages();
 return heading('Conversa','Envie uma ideia, prepare uma tarefa ou peça um resumo.')+`<div class="client-conversation"><section class="conversation-panel" aria-label="Conversa com a Duma"><div class="assistant-messages" id="assistant-messages" aria-live="polite"></div><form class="assistant-composer" id="assistant-form"><label class="sr-only" for="assistant-input">Sua mensagem para a Duma</label><textarea id="assistant-input" name="message" placeholder="O que vamos colocar em movimento?" rows="2" maxlength="1000">${E(assistantDraft)}</textarea><div class="composer-actions"><span class="composer-hint">Enter para enviar · Shift + Enter para pular</span><div><button class="icon-button" type="button" data-action="sample-audio" aria-label="Testar áudio de exemplo" title="Testar áudio de exemplo">${icon('microphone')}</button><button class="icon-button send-button" type="submit" aria-label="Enviar mensagem">${icon('arrow-up-right')}</button></div></div></form></section></div>`;
}
function approvalsPage(){const rows=weekContents().filter(c=>c.status==='Aprovação');return heading('Revisões',rows.length?`${rows.length} ${rows.length===1?'conteúdo pronto':'conteúdos prontos'} para você revisar.`:'Sem pendências neste filtro.',true)+`<div class="approval-grid">${rows.length?rows.map(c=>`<article class="panel approval-card">${cover(c,true)}<span class="content-subtitle"><i class="profile-dot" style="background:${profileFor(c.profileId).color}"></i>${E(profileFor(c.profileId).name)} · ${E(c.type)}</span><h2>${E(c.title)}</h2><p>${E(c.caption||c.description)}</p><div class="approval-meta"><span class="content-owner">${avatar(c.ownerId,'small')}${E(person(c.ownerId).name)}</span><time>${fullDate(c.date)} às ${E(c.time)}</time></div><div class="approval-actions"><button class="button" data-detail="${E(c.id)}">Revisar</button><button class="button primary" data-approve="${E(c.id)}">${icon('check')}Aprovar</button></div></article>`).join(''):`<section class="panel" style="grid-column:1/-1">${empty('Nada para decidir por aqui',profile==='all'?'Os próximos conteúdos aparecem quando estiverem prontos.':'Selecione outro perfil para consultar as demais pendências.')}</section>`}</div>`}
function settingsPage(){return heading('Configurações','Deixe a Duma do seu jeito.')+`<div class="settings-layout"><nav class="settings-nav" aria-label="Seções de configurações">${[['profile','Perfil','user'],['appearance','Preferências','palette']].map(([id,label,i])=>`<button data-settings-tab="${id}" class="${settingTab===id?'active':''}">${icon(i)}${label}</button>`).join('')}</nav><section class="panel settings-content">${settingsContent()}</section></div>`}
function settingsContent(){
 if(settingTab==='profile')return `<div class="profile-settings-heading">${avatar('an','large')}<div><h2>Seu perfil</h2><p>Como você aparece na Duma.</p></div></div><form id="profile-form"><div class="form-grid"><label class="form-field">Nome<input name="name" value="${E(settings.name)}" required maxlength="70"></label><label class="form-field">E-mail<input type="email" name="email" value="${E(settings.email)}" required></label><label class="form-field full">Sobre você<textarea name="bio" maxlength="250">${E(settings.bio)}</textarea></label></div><div class="form-actions"><button class="button" type="button" data-action="discard-settings">Descartar</button><button class="button primary" type="submit">Salvar alterações</button></div></form>`;
 return `<h2>Espaço para criar</h2><p>Escolha como prefere trabalhar.</p><div class="setting-row"><div><strong>Cor de destaque</strong></div></div><div style="display:flex;gap:8px;margin:16px 0 22px;flex-wrap:wrap">${[['forest','Floresta','#24553d'],['olive','Oliva','#596642'],['graphite','Grafite','#3b4842']].map(([id,name,color])=>`<button class="button ${settings.accent===id?'active':''}" style="${settings.accent===id?'background:#e6efde':''}" data-accent="${id}"><i class="profile-dot" style="background:${color}"></i>${name}${settings.accent===id?icon('check'):''}</button>`).join('')}</div>${[['motion','Movimento suave','Animações suaves entre as telas.'],['compact','Modo compacto','Um pouco mais de conteúdo no mesmo espaço.']].map(([key,title,description])=>`<div class="setting-row"><div><strong>${title}</strong><p>${description}</p></div><button class="switch" role="switch" aria-label="${title}" aria-checked="${Boolean(settings[key])}" data-setting-toggle="${key}"></button></div>`).join('')}<div class="form-actions"><button class="button danger" data-action="reset">${icon('reset')}Recomeçar prévia</button></div>`;
}
function render(animate=true){
 const active=document.activeElement;
 const focusKey=main.contains(active)&&active.getAttributeNames().find(name=>name==='id'||name.startsWith('data-'));
 const focusSelector=focusKey?`${active.tagName.toLowerCase()}[${focusKey}="${CSS.escape(active.getAttribute(focusKey))}"]`:null;
 renderNav();main.innerHTML=({overview,approvals:approvalsPage,conversation:conversationPage,settings:settingsPage})[view]();
 if(view==='conversation')renderMessages();
 if(animate&&motion()&&window.gsap)gsap.fromTo(main.children,{y:5,opacity:.72},{y:0,opacity:1,duration:.32,stagger:.025,ease:'power3.out',clearProps:'transform,opacity'});
 document.title=`${labels[view]} · Duma 360`;
 if(focusSelector&&!document.querySelector('.modal'))(main.querySelector(focusSelector)||main).focus({preventScroll:true});
}
function navigate(id){view=labels[id]?id:'overview';history.replaceState(null,'','#'+view);closeOverlay(false);render();window.scrollTo({top:0,left:0,behavior:'instant'});main.focus({preventScroll:true});}
function openOverlay(content){const root=document.querySelector('#overlay-root');if(!root.firstElementChild)lastFocus=document.activeElement;document.querySelector('.app-shell').inert=true;root.innerHTML=`<div class="overlay-backdrop" data-backdrop="true"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title">${content}</section></div>`;const el=document.querySelector('.modal');if(motion()&&window.gsap)gsap.fromTo(el,{y:10,scale:.99},{y:0,scale:1,duration:.25,ease:'power3.out'});requestAnimationFrame(()=>{if(el.isConnected)el.querySelector('input,textarea,button')?.focus()});}
function closeOverlay(restore=true){const root=document.querySelector('#overlay-root');if(!root.firstElementChild)return;root.innerHTML='';document.querySelector('.app-shell').inert=false;if(restore){const target=lastFocus?.isConnected&&lastFocus!==document.body&&!lastFocus.closest('[inert]')&&lastFocus.getClientRects().length?lastFocus:main;target.focus({preventScroll:true})}lastFocus=null;}
const modalHeader=(title,subtitle='')=>`<header class="modal-header"><div><h2 id="dialog-title">${E(title)}</h2>${subtitle?`<p>${E(subtitle)}</p>`:''}</div><button class="icon-button" data-action="close" aria-label="Fechar">${icon('x')}</button></header>`;
function openDetail(id){const c=data.contents.find(item=>item.id===id);if(!c)return;openOverlay(modalHeader('Detalhes do conteúdo','Confira a legenda, o responsável e o prazo.')+`<div class="detail-top">${cover(c)}<div><h3>${E(c.title)}</h3>${pill(c.status)}</div></div><dl class="detail-grid"><div><dt>Perfil</dt><dd>${E(profileFor(c.profileId).name)}</dd></div><div><dt>Responsável</dt><dd>${E(person(c.ownerId).name)}</dd></div><div><dt>Data e horário</dt><dd>${fullDate(c.date)} de 2026 · ${E(c.time)}</dd></div><div><dt>Formato / plataforma</dt><dd>${E(c.type)} · ${E(c.platform)}</dd></div></dl><div class="detail-section"><h3>Legenda</h3><p>${E(c.caption||'Ainda vamos escrever a legenda.')}</p><h3>Orientações</h3><p>${E(c.description)}</p></div>${c.status==='Publicado'?`<div class="notice">${compactNumber(c.views||0)} visualizações · ${compactNumber(c.shares||0)} compartilhamentos.</div>`:''}<div class="form-actions">${c.status==='Aprovação'?`<button class="button" data-changes="${E(c.id)}">Pedir ajuste</button><button class="button primary" data-approve="${E(c.id)}">${icon('check')}Aprovar conteúdo</button>`:`<button class="button" data-action="close">Fechar</button><button class="button primary" data-discuss="${E(c.id)}">${icon('sparkles')}Conversar sobre este conteúdo</button>`}</div>`)}
function approve(id,yes=true){const previous=data.contents.find(c=>c.id===id);if(!previous||previous.status!=='Aprovação')return;data.contents=reviewContent(data.contents,id,yes);log(`${person('an').name} ${yes?'aprovou':'solicitou ajustes em'} ${previous.title}.`);closeOverlay();render(false);toast(yes?'Conteúdo aprovado nesta prévia.':'Pedido de ajuste registrado nesta prévia.');}
function openAssistant(prompt=''){navigate('conversation');if(prompt)sendMessage(prompt);requestAnimationFrame(()=>document.querySelector('#assistant-input')?.focus());}
function renderMessages(){const el=document.querySelector('#assistant-messages');if(!el)return;el.innerHTML=messages.map(message=>`<div class="message ${message.role}">${message.html}</div>`).join('');el.scrollTop=el.scrollHeight;}
function sendMessage(text){text=String(text).trim();if(!text)return;assistantDraft='';messages.push({role:'user',html:E(text)});const term=normalize(text);let html;
 if(/meta|tarefa|sara|edicao|editar/.test(term)){
  const nextDate=new Date(TODAY+'T12:00:00');if(/sexta|amanha/.test(term))nextDate.setDate(nextDate.getDate()+1);
  const draft={id:crypto.randomUUID(),title:term.includes('degustonho')?'Editar o Degustonho':text.replace(/^(cria|criar|crie)\s+(uma?\s+)?(meta|tarefa)(\s+de)?\s*/i,'').slice(0,160)||'Nova tarefa da Duma',ownerId:term.includes('sara')?'sa':'an',due:nextDate.toISOString().slice(0,10),time:'18:00',done:false,category:term.includes('edicao')||term.includes('editar')?'Edição':'Organização'};
  pendingTasks.set(draft.id,draft);
  html=`<p>Confira o pedido antes de confirmar.</p><section class="draft-preview"><h3>Tarefa para a equipe</h3><p>${E(draft.title)}</p><dl><dt>Responsável</dt><dd>${E(person(draft.ownerId).name)}</dd><dt>Prazo</dt><dd>${fullDate(draft.due)} de 2026, ${draft.time}</dd></dl><button class="button primary" data-confirm-task="${draft.id}">${icon('check')}Confirmar tarefa</button><small>Revise o responsável e o prazo antes de confirmar.</small></section>`;
 }else if(/aprov|revis/.test(term)){const rows=weekContents().filter(c=>c.status==='Aprovação');html=rows.length?`<p>Temos <strong>${rows.length} conteúdos</strong> esperando seu olhar:</p>${rows.map(c=>`<p><strong>${E(c.title)}</strong><br>${E(profileFor(c.profileId).name)} · ${fullDate(c.date)} às ${E(c.time)}<br><button class="text-link" data-detail="${E(c.id)}">Abrir prévia ${icon('arrow-right')}</button></p>`).join('')}`:'<p>As aprovações estão em dia por aqui.</p>';
 }else if(/agenda|semana|hoje|program/.test(term)){const rows=weekContents().filter(c=>c.status==='Agendado');const today=rows.filter(c=>c.date===TODAY);html=`<p>Na semana de 26 de outubro a 1 de novembro, temos <strong>${rows.length} conteúdos programados</strong>, sendo <strong>${today.length} para 29 de outubro</strong>.</p><p>Você pode acompanhar os próximos conteúdos na visão geral.</p><button class="text-link" data-nav="overview">Ver visão geral ${icon('arrow-right')}</button>`;
 }else{html=`<p>Posso preparar uma tarefa, responder sobre a semana ou trazer os conteúdos para aprovação.</p><div class="suggestion-chips"><button data-prompt="Cria uma meta de edição do Degustonho para a Sara até sexta">Preparar uma tarefa</button><button data-prompt="O que precisa de aprovação?">Ver aprovações</button></div>`;}
 messages.push({role:'assistant',html});renderMessages();const input=document.querySelector('#assistant-input');if(input){input.value='';input.focus()}
}

document.addEventListener('click',event=>{
 const nav=event.target.closest('[data-nav]');if(nav){navigate(nav.dataset.nav);return}
 const detail=event.target.closest('[data-detail]');if(detail){openDetail(detail.dataset.detail);return}
 const approval=event.target.closest('[data-approve]');if(approval){approve(approval.dataset.approve);return}
 const changes=event.target.closest('[data-changes]');if(changes){approve(changes.dataset.changes,false);return}
 const discuss=event.target.closest('[data-discuss]');if(discuss){const item=data.contents.find(c=>c.id===discuss.dataset.discuss);if(!item)return;openAssistant();messages.push({role:'user',html:E('Quero revisar '+item.title)},{role:'assistant',html:`<p>Vamos olhar este conteúdo:</p><p><strong>${E(item.title)}</strong><br>${E(profileFor(item.profileId).name)} · ${E(item.status)}</p><p><strong>Orientações</strong><br>${E(item.description||'Sem orientações por enquanto.')}</p><p><strong>Legenda</strong><br>${E(item.caption||'Ainda vamos escrever a legenda.')}</p><button class="text-link" data-detail="${E(item.id)}">Abrir prévia ${icon('arrow-right')}</button>`});renderMessages();return}
 const prompt=event.target.closest('[data-prompt]');if(prompt){sendMessage(prompt.dataset.prompt);return}
 const st=event.target.closest('[data-settings-tab]');if(st){settingTab=st.dataset.settingsTab;render(false);return}
 const toggle=event.target.closest('[data-setting-toggle]');if(toggle){settings[toggle.dataset.settingToggle]=!settings[toggle.dataset.settingToggle];saveSettings();render(false);return}
 const accent=event.target.closest('[data-accent]');if(accent){settings.accent=accent.dataset.accent;saveSettings();render(false);toast('Cor de destaque atualizada.');return}
 const confirmTask=event.target.closest('[data-confirm-task]');
 if(confirmTask){const id=confirmTask.dataset.confirmTask;const item=pendingTasks.get(id);if(!item){toast('Esta prévia já foi confirmada.');return}pendingTasks.delete(id);data.tasks.push({...item,id:crypto.randomUUID()});log('Duma criou a tarefa demonstrativa “'+item.title+'”.');messages.forEach(m=>{if(m.html.includes('data-confirm-task="'+id+'"'))m.html=m.html.replace(/<button[^>]*data-confirm-task="[^"]+"[^>]*>[\s\S]*?<\/button>/,'<span class="pill green">Confirmada</span>')});messages.push({role:'assistant',html:'<p><strong>Tarefa confirmada nesta prévia.</strong><br>'+E(person(item.ownerId).name)+' · '+fullDate(item.due)+' às '+E(item.time)+'</p>'});renderMessages();document.querySelector('#assistant-input')?.focus();toast('Tarefa confirmada nesta prévia.');return}
 const action=event.target.closest('[data-action]')?.dataset.action;
 if(action==='assistant')openAssistant();
 if(action==='close')closeOverlay();
 if(action==='user'){settingTab='profile';navigate('settings')}
 if(action==='discard-settings'){render(false);toast('Os campos voltaram à última versão salva.')}
 if(action==='sample-audio'){sendMessage('Cria uma meta de edição do Degustonho para a Sara até sexta');toast('Pedido de áudio de exemplo preparado.')}
 if(action==='reset')openOverlay(modalHeader('Recomeçar a prévia?','Os testes feitos nesta prévia serão reiniciados.')+`<p>Você volta aos conteúdos e tarefas de exemplo.</p><div class="form-actions"><button class="button" data-action="close">Continuar por aqui</button><button class="button primary" data-action="confirm-reset">Recomeçar prévia</button></div>`);
 if(action==='confirm-reset'){data=structuredClone(seedData);persist();messages=[];assistantDraft='';pendingTasks.clear();closeOverlay(false);navigate('overview');toast('Exemplos restaurados.')}
 if(event.target.matches('[data-backdrop]'))closeOverlay();
});
document.addEventListener('submit',event=>{
 if(event.target.id==='profile-form'){event.preventDefault();const fields=new FormData(event.target);settings.name=String(fields.get('name')).trim();settings.email=String(fields.get('email')).trim();settings.bio=String(fields.get('bio')).trim();saveSettings();toast('Perfil atualizado nesta prévia.');return}
 if(event.target.id==='assistant-form'){event.preventDefault();sendMessage(new FormData(event.target).get('message')||'')}
});
document.addEventListener('change',event=>{if(event.target.dataset.filter==='profile'){profile=event.target.value;render(false)}});
document.addEventListener('input',event=>{if(event.target.id==='assistant-input')assistantDraft=event.target.value});
document.addEventListener('keydown',event=>{
 if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openAssistant()}
 if(event.key==='Escape')closeOverlay();
 if(event.target.id==='assistant-input'&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();sendMessage(event.target.value)}
 if(event.key==='Tab'){const dialog=document.querySelector('.modal');if(dialog){const nodes=[...dialog.querySelectorAll('button,input,textarea,select,a[href]')].filter(el=>!el.disabled&&el.offsetParent!==null);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(!dialog.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus()}else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}}
});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
window.addEventListener('resize',renderNav);
hydrateIcons();applySettings();const initial=location.hash.slice(1);view=labels[initial]?initial:'overview';if(initial&&!labels[initial])history.replaceState(null,'','#overview');render(false);
// shortcut: the assistant is a local scripted demo; replace with the authenticated Hermes API when backend integration starts.
