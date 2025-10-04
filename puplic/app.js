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