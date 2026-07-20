/* ==========================================================================
   Vridhi — shared app logic (prototype / sample-data only)
   ========================================================================== */

/* Color palette mirrored from css/style.css custom properties,
   used by Chart.js instances which can't read CSS vars directly. */
const palette = {
  gold:     '#E8A33D',
  goldSoft: 'rgba(232,163,61,.16)',
  sage:     '#6FA98A',
  sageSoft: 'rgba(111,169,138,.16)',
  sky:      '#5C8DE0',
  skySoft:  'rgba(92,141,224,.16)',
  coral:    '#E8604A',
  coralSoft:'rgba(232,96,74,.16)',
  cream:    '#F5F1E6',
  creamDim: '#C7C4D6',
  inkSoft:  '#8B87A3',
  grid:     'rgba(255,255,255,.06)',
  navy700:  '#1D2145',
};

/* ---------- Chart.js global theming ---------- */
function applyChartDefaults(){
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = palette.inkSoft;
  Chart.defaults.borderColor = palette.grid;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0F1128';
  Chart.defaults.plugins.tooltip.titleColor = palette.cream;
  Chart.defaults.plugins.tooltip.bodyColor = palette.creamDim;
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.displayColors = false;
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.line.borderWidth = 2.5;
}

/* ---------- Ring / donut score painter ---------- */
/* Paints a circular progress ring inside #id (expects .ring-track + .ring-fill circles). */
function paintRing(id, value, color){
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const fill = wrap.querySelector('.ring-fill');
  if (!fill) return;
  const r = fill.r.baseVal.value;
  const circumference = 2 * Math.PI * r;
  fill.style.stroke = color || palette.gold;
  fill.style.strokeDasharray = `${circumference}`;
  fill.style.strokeDashoffset = `${circumference}`;
  // animate in
  requestAnimationFrame(()=>{
    const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
    fill.style.strokeDashoffset = `${offset}`;
  });
}

/* ---------- Role selector (signup / signin) ---------- */
const ROLE_HINTS = {
  owner:   'Set up your organisation, invite teachers, and see growth across every classroom.',
  teacher: 'Log grades, attendance and notes — Vridhi turns them into growth signals for parents.',
  student: 'See academic and emotional timelines together, with a home plan built around your child.',
};

function initRoleSelect(defaultRole){
  const container = document.getElementById('role-select');
  const hint = document.getElementById('role-hint');
  let currentRole = defaultRole || 'student';

  function setRole(role){
    currentRole = role;
    if (container){
      container.querySelectorAll('.role-card').forEach(c=>{
        c.classList.toggle('selected', c.dataset.role === role);
      });
    }
    if (hint) hint.textContent = ROLE_HINTS[role] || '';
  }

  if (container){
    container.querySelectorAll('.role-card').forEach(card=>{
      card.addEventListener('click', ()=> setRole(card.dataset.role));
    });
  }

  setRole(currentRole);
  return () => currentRole;
}

/* ---------- Auth form submit (prototype: no backend, just routes by role) ---------- */
const ROLE_DASHBOARDS = {
  owner:   'owner-dashboard.html',
  teacher: 'teacher-dashboard.html',
  student: 'dashboard.html',
};

function handleAuthSubmit(formId, getRole){
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const role = typeof getRole === 'function' ? getRole() : 'student';
    window.location.href = ROLE_DASHBOARDS[role] || 'dashboard.html';
  });
}
