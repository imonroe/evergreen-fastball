async function request(method, url, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const getProjects = () => request('GET', '/api/projects');
export const createProject = (body) => request('POST', '/api/projects', body);
export const updateProject = (id, body) => request('PUT', `/api/projects/${id}`, body);
export const deleteProject = (id) => request('DELETE', `/api/projects/${id}`);
export const reorderProjects = (ids) => request('PUT', '/api/projects/reorder', { ids });

export const getProjectNotes = (projectId) => request('GET', `/api/notes/${projectId}`);
export const addNote = (projectId, text) => request('POST', `/api/notes/${projectId}`, { text });
export const getJournal = () => request('GET', '/api/notes');

export const getPreferences = () => request('GET', '/api/preferences');
export const updatePreferences = (body) => request('PUT', '/api/preferences', body);
