export const TODAY = '2026-10-29';
export const statuses = ['Ideia', 'Em edição', 'Aprovação', 'Agendado', 'Publicado'];
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function filterContents(contents, {profile = 'all', status = 'all', query = ''} = {}) {
  const term = normalize(query.trim());
  return contents.filter(item => (profile === 'all' || item.profileId === profile)
    && (status === 'all' || item.status === status)
    && (!term || normalize(`${item.title} ${item.caption} ${item.description} ${item.platform}`).includes(term)));
}

export function summary(contents, profile = 'all') {
  const rows = filterContents(contents, {profile});
  return {
    scheduledToday: rows.filter(item => item.date === TODAY && item.status === 'Agendado').length,
    editing: rows.filter(item => item.status === 'Em edição').length,
    approvals: rows.filter(item => item.status === 'Aprovação').length,
    published: rows.filter(item => item.status === 'Publicado').length,
    views: rows.reduce((total, item) => total + (item.status === 'Publicado' && Number.isFinite(item.views) && item.views >= 0 ? item.views : 0), 0),
  };
}

export function reviewContent(contents, id, approved) {
  return contents.map(item => item.id === id && item.status === 'Aprovação'
    ? {...item, status: approved ? 'Agendado' : 'Em edição'} : item);
}

export function validateContent(item, people, profiles) {
  if (!item.title?.trim() || item.title.trim().length > 160) return 'Informe um título com até 160 caracteres.';
  if (!profiles.some(profile => profile.id === item.profileId)) return 'Escolha um perfil da Duma.';
  if (!people.some(person => person.id === item.ownerId)) return 'Escolha uma pessoa responsável.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || Number.isNaN(Date.parse(item.date + 'T12:00:00')) || new Date(item.date + 'T12:00:00Z').toISOString().slice(0,10) !== item.date) return 'Informe uma data válida.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time)) return 'Informe um horário válido.';
  if (!['Reel','Reel teste','Corte','Foto','Carrossel','Story'].includes(item.type)) return 'Escolha um formato válido.';
  return '';
}

export function restoreData(raw, seed) {
  try {
    const value = JSON.parse(raw);
    if (value.version !== seed.version || !Array.isArray(value.contents) || !Array.isArray(value.tasks) || !Array.isArray(value.activity)) return structuredClone(seed);
    const contents = value.contents.filter(item => item && /^[\w-]{1,80}$/.test(item.id) && typeof item.caption === 'string' && typeof item.description === 'string' && statuses.includes(item.status) && !validateContent(item, seed.people, seed.profiles));
    const ids = new Set();
    const tasks = value.tasks.filter(task => task && /^[\w-]{1,80}$/.test(task.id) && typeof task.title === 'string' && typeof task.done === 'boolean' && /^\d{4}-\d{2}-\d{2}$/.test(task.due) && seed.people.some(person => person.id === task.ownerId) && !ids.has(task.id) && ids.add(task.id));
    if (new Set(contents.map(item => item.id)).size !== contents.length) return structuredClone(seed);
    return {...structuredClone(seed), contents, tasks, activity:value.activity.filter(item => item && typeof item.text === 'string' && typeof item.time === 'string').slice(0, 20)};
  } catch { return structuredClone(seed); }
}
