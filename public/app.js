 const API = '/api/projects';
//const API = '/p';

const grid = document.getElementById('grid');
const form = document.getElementById('projectForm');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEdit');
const formErr = document.getElementById('formErr');

const idField = document.getElementById('projectId');
const nameField = document.getElementById('name');
const descField = document.getElementById('description');
const imageField = document.getElementById('image');
const ratingField = document.getElementById('rating');

async function fetchJSON(url, options) {
	const res = await fetch(url, options);
	if (!res.ok) {
		let msg = 'Request failed';
		try {
			const data = await res.json();
			msg = data.errors ? data.errors.join(', ') : (data.error || msg);
		} catch {}
		throw new Error(msg);
	}
	return res.json();
}

function card(project) {
	const div = document.createElement('div');
	div.className = 'card';
	div.innerHTML = `
		<img src="${project.image}" alt="${project.name}" />
		<div class="card-body">
			<div class="card-title">
				<span>${project.name}</span>
				<span>⭐ ${project.rating}</span>
			</div>
			<div class="card-actions">
				<button type="button" data-edit="${project.id}">Edit</button>
				<button type="button" data-delete="${project.id}" class="secondary">Delete</button>
				<a href="detail.html?id=${project.id}">
					<button type="button">Open</button>
				</a>
			</div>
		</div>
	`;
	return div;
}

async function load() {
	grid.innerHTML = '';
	const items = await fetchJSON(API);
	items.forEach(p => grid.appendChild(card(p)));
}

function resetForm() {
	idField.value = '';
	nameField.value = '';
	descField.value = '';
	imageField.value = '';
	ratingField.value = '0';
	cancelEditBtn.hidden = true;
	formTitle.textContent = 'Create Project';
	formErr.textContent = '';
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	formErr.textContent = '';

	const payload = {
		name: nameField.value.trim(),
		description: descField.value.trim(),
		image: imageField.value.trim(),
		rating: Number(ratingField.value || 0)
	};

	try {
		if (idField.value) {
			await fetchJSON(`${API}/${idField.value}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
		} else {
			await fetchJSON(API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
		}
		resetForm();
		await load();
	} catch (err) {
		formErr.textContent = err.message;
	}
});

cancelEditBtn.addEventListener('click', resetForm);

grid.addEventListener('click', async (e) => {
	const editId = e.target.getAttribute('data-edit');
	const delId = e.target.getAttribute('data-delete');

	try {
		if (editId) {
			const p = await fetchJSON(`${API}/${editId}`);
			idField.value = p.id;
			nameField.value = p.name;
			descField.value = p.description;
			imageField.value = p.image;
			ratingField.value = p.rating;
			formTitle.textContent = 'Edit Project';
			cancelEditBtn.hidden = false;
		} else if (delId) {
			const ok = confirm('Delete project?');
			if (!ok) return;
			await fetchJSON(`${API}/${delId}`, { method: 'DELETE' });
			await load();
		}
	} catch (err) {
		alert(err.message);
	}
});

load();