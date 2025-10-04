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
async function render() {
  const id = qs('id');
  if (!id) {
    detail.textContent = 'Missing id in URL (detail.html?id=...)';
    return;
  }
  try {
    const p = await fetchJSON(`${API}/${id}`);
    detail.innerHTML = `
      <h1>${p.name}</h1>
      <img src="${p.image}" alt="${p.name}">
      <p>${p.description}</p>
      <p><strong>Rating:</strong> <span id="rating">⭐ ${p.rating}</span></p>
      <div class="actions">
        <button id="rateBtn">Add a point</button>
        <a href="/"><button type="button" class="secondary">Back</button></a>
      </div>
    `;
    document.getElementById('rateBtn').addEventListener('click', async () => {
      try {
        const updated = await fetchJSON(`${API}/${id}/rate`, { method: 'POST' });
        document.getElementById('rating').textContent = `⭐ ${updated.rating}`;
      } catch (e) {
        alert(e.message);
      }
    });
  } catch (e) {
    detail.textContent = `Failed to load project: ${e.message}`;
    console.error(e);
  }
}