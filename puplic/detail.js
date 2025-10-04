 const API = '/api/projects';
//const API = '/p';
const detail = document.getElementById('detail');

function qs(name) {
  return new URL(location.href).searchParams.get(name);
} 

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.errors ? data.errors.join(', ') : (data.error || msg);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}