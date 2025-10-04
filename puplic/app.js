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