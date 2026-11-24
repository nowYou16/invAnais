'use strict';
const PHONE = '51959219553';
const $ = id => document.getElementById(id);

const hours = [];
for (let h = 12; h <= 21; h++) hours.push(`${h === 12 ? 12 : h - 12}:00 p. m.`);

const steps = [
{ k: 'fecha', l: 'Fecha', t: 'Día disponible', o: ['Lunes 30 de noviembre de 2026'], nota: 'Te iba a dar más opciones, pero no puedo otros días. Jeje, perdóname. 🥺' },
{ k: 'hora', l: 'Hora', t: '¿A qué hora nos vemos?', o: hours, cls: 'hours' },
{ k: 'encuentro', l: 'Encuentro', t: '¿Cómo nos encontramos?', o: ['Nos encontramos en un punto medio', 'Nos encontramos cerca de mi casa (ten en cuenta que no tengo movilidad)'], notas: { 'Nos encontramos en un punto medio': 'Tú me dices dónde.', 'Nos encontramos cerca de mi casa (ten en cuenta que no tengo movilidad)': 'Tú me dices dónde, y llego como sea jaja.' } },
{ k: 'vestimenta', l: 'Vestimenta', t: '¿Qué vestimenta prefieres?', o: ['Casual', 'Semiformal', 'Formal'] },
{ k: 'pelicula', l: 'Película', t: '¿Qué tipo de película vemos?', o: ['Terror', 'Comedia', 'Acción', 'Romance', 'Suspenso', 'Animación'] },
{ k: 'cierre', l: 'Despedida', t: 'Para despedirnos al final de la invitación...', o: ['Un choque de puños, muy profesional 👊', 'Un simple "nos vemos", sin rodeos', 'Besito en el cachete'], notas: { 'Un choque de puños, muy profesional 👊': 'Excelente elección. Puñito reservado 👊', 'Un simple "nos vemos", sin rodeos': 'Perfecto, sin rodeos. Todo en orden.', 'Besito en el cachete': 'Al final tú decides, pero mi cachete ya estará listo. Jeje.' } }
];
const answers = {};
let step = 0;

/* cielo de estrellas sutiles */
(function sky() {
const sky = $('sky'), chars = ['✦', '✧', '·', '✦'];
for (let i = 0; i < 38; i++) {
const s = document.createElement('span');
s.className = 'star';
s.textContent = chars[i % 4];
s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${8 + Math.random() * 12}px;--d:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 4}s`;
sky.appendChild(s);
}
})();

/* destellos */
function burst(x, y, type = 'soft', n = 8) {
const sets = {
soft: [['✦', '#f6bfd0'], ['✧', '#e88fb0'], ['★', '#f7c6d9']],
pink: [['✦', '#f6bfd0'], ['✧', '#e88fb0'], ['★', '#f7c6d9'], ['✦', '#c0587c']],
blue: [['🥺', ''], ['🥲', ''], ['✦', '#f6bfd0'], ['✧', '#e88fb0']]
}[type];
for (let i = 0; i < n; i++) {
const [ch, col] = sets[i % sets.length], p = document.createElement('span'), a = Math.random() * 6.28, d = 50 + Math.random() * 80;
p.className = 'p';
p.textContent = ch;
p.style.cssText = `left:${x}px;top:${y}px;color:${col};--s:${14 + Math.random() * 14}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 20}px;--r:${Math.random() * 200 - 100}deg`;
document.body.appendChild(p);
setTimeout(() => p.remove(), 1000);
}
}
const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

/* pantallas */
function show(id) {
document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
$(id).classList.add('active');
window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* sobre y carta */
$('seal').addEventListener('click', e => {
$('env').classList.add('open');
burst(...center(e.currentTarget), 'pink', 10);
setTimeout(() => show('s-letter'), 1000);
});
$('start').addEventListener('click', () => { step = 0; renderStep(); show('s-form'); });

/* formulario por pasos */
function renderStep() {
const s = steps[step], box = $('opts');
$('count').textContent = `Pregunta ${step + 1} de ${steps.length}`;
$('fill').style.width = `${((step + 1) / steps.length) * 100}%`;
$('q').textContent = s.t;
$('err').textContent = '';
$('note').textContent = '';
$('back').hidden = false;
$('back').textContent = step === 0 ? 'Volver a la carta' : 'Atrás';
$('next').textContent = step === steps.length - 1 ? 'Ver resumen' : 'Siguiente';
box.className = 'opts ' + (s.cls || '');
box.innerHTML = '';
box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
s.o.forEach(opt => {
const b = document.createElement('button');
b.type = 'button';
b.className = 'chip';
b.textContent = opt;
b.setAttribute('aria-pressed', answers[s.k] === opt);
b.addEventListener('click', () => choose(s, opt, b));
if (s.notas && s.notas[opt]) b.dataset.nota = s.notas[opt];
box.appendChild(b);
});
if (s.k === 'cierre' && answers.cierre) hugNote(answers.cierre);
if (s.nota && !answers[s.k]) $('note').textContent = s.nota;
}
function hugNote(v) {
if (v.startsWith('Un choque')) $('note').textContent = 'Excelente elección. Puñito reservado 👊';
else if (v.startsWith('Besito')) $('note').textContent = 'Al final tú decides, pero mi cachete ya estará listo. Jeje.';
else $('note').textContent = 'Perfecto, sin rodeos. Todo en orden.';
}
function choose(s, opt, btn) {
answers[s.k] = opt;
if (s.notas) $('note').textContent = s.notas[opt] || '';
document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === btn));
$('err').textContent = '';
const [x, y] = center(btn);
if (s.k === 'cierre') {
hugNote(opt);
if (opt.startsWith('Besito')) burstKiss(x, y);
else burst(x, y, opt.startsWith('Un choque') ? 'pink' : 'blue', 14);
}
else burst(x, y, 'soft', 8);
}
$('next').addEventListener('click', () => {
const s = steps[step];
if (!answers[s.k]) { $('err').textContent = 'Elige una opción para continuar.'; return; }
if (step < steps.length - 1) { step++; renderStep(); } else { renderSummary(); show('s-sum'); }
});
$('back').addEventListener('click', () => { if (step > 0) { step--; renderStep(); } else { show('s-letter'); } });

/* resumen */
function renderSummary() {
const ul = $('list');
ul.innerHTML = '';
steps.forEach(s => {
const li = document.createElement('li'), a = document.createElement('span'), b = document.createElement('b');
a.textContent = s.l;
b.textContent = answers[s.k];
li.append(a, b);
ul.appendChild(li);
});
}
$('edit').addEventListener('click', () => { step = 0; renderStep(); show('s-form'); });

/* WhatsApp */
function buildMessage() {
return [
'Hola Miguel ✨',
'¡Acepto tu invitación a comer y al cine! 🍽️🎬',
'',
`📅 Fecha: ${answers.fecha}`,
`🕒 Hora: ${answers.hora}`,
`📍 Encuentro: ${answers.encuentro}`,
`👗 Vestimenta: ${answers.vestimenta}`,
`🎬 Película: ${answers.pelicula}`,
`👊 Para terminar la invitación: ${answers.cierre}`,
'',
...(($('comment').value||'').trim() ? ['', `💬 Lo que pienso de la invitación: ${$('comment').value.trim()}`] : []),
'',
'¡Nos vemos pronto!'
].join('\n');
}
$('accept').addEventListener('click', e => {
if (steps.some(s => !answers[s.k])) { step = steps.findIndex(s => !answers[s.k]); renderStep(); show('s-form'); return; }
$('wa').href = `https://wa.me/${PHONE}?text=${encodeURIComponent(buildMessage())}`;
burst(...center(e.currentTarget), 'pink', 16);
show('s-end');
});
$('wa').addEventListener('click', e => burst(...center(e.currentTarget), 'pink', 14));

/* rechazo amable */
$('decline').addEventListener('click', e => {
const msg = 'Hola Miguel ✨\nGracias por la invitación, pero por ahora prefiero no aceptar.\nSerá en otra oportunidad.';
$('wa-no').href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
burst(...center(e.currentTarget), 'blue', 12);
show('s-no');
});
$('undo').addEventListener('click', () => show('s-letter'));

/* besitos con estrellitas */
function burstKiss(x, y){
const sym = ['😘','✦','✧','★','😘','✦'];
for (let i = 0; i < 12; i++){
const p = document.createElement('span'), a = Math.random()*6.28, d = 50 + Math.random()*80;
p.className = 'p';
p.textContent = sym[i % sym.length];
p.style.cssText = `left:${x}px;top:${y}px;color:${sym[i%sym.length]==='😘'?'inherit':'#f6bfd0'};--s:${14+Math.random()*12}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-20}px;--r:${Math.random()*200-100}deg`;
document.body.appendChild(p);
setTimeout(() => p.remove(), 1000);
}
}
