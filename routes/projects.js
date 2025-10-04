const express = require('express');
const router = express.Router();

// In-memory store
let projects = [];
let nextId = 1;

// Validation
function validateProject(body, { partial = false } = {}) {
	const errors = [];

	if (!partial || body.name !== undefined) {
		if (typeof body.name !== 'string' || body.name.trim().length < 2) {
			errors.push('name must be a string with at least 2 characters');
		}
	}

	if (!partial || body.description !== undefined) {
		if (typeof body.description !== 'string' || body.description.trim().length < 2) {
			errors.push('description must be a string with at least 2 characters');
		}
	}

	if (!partial || body.image !== undefined) {
		if (typeof body.image !== 'string' || !/^https?:\/\//.test(body.image)) {
			errors.push('image must be a valid http(s) URL');
		}
	}

	if (!partial || body.rating !== undefined) {
		if (typeof body.rating !== 'number' || !Number.isFinite(body.rating)) {
			errors.push('rating must be a number');
		}
	}

	return errors;
}

// Seed example
projects.push({
	id: nextId++,
	name: 'Demo Project',
	description: 'A sample project to get started',
	image: 'https://picsum.photos/seed/demo/600/360',
	rating: 0
});

// List all
// router.get('/', (req, res) => {
// 	res.json(projects);
// });
router.get('/', (req, res) => res.status(200).json(projects));

// Get one
router.get('/:id', (req, res) => {
	const id = Number(req.params.id);
	const project = projects.find(p => p && p.id === id);
	if (!project) return res.status(404).json({ error: 'Not found' });
	res.json(project);
});

// Create
router.post('/', (req, res) => {
	const errors = validateProject(req.body);
	if (errors.length) return res.status(400).json({ errors });

	const project = {
		id: nextId++,
		name: req.body.name.trim(),
		description: req.body.description.trim(),
		image: req.body.image.trim(),
		rating: typeof req.body.rating === 'number' ? req.body.rating : 0
	};
	projects.push(project);
	res.status(201).json(project);
});

// Update (partial or full)
router.put('/:id', (req, res) => {
	const id = Number(req.params.id);
	const project = projects.find(p => p && p.id === id);
	if (!project) return res.status(404).json({ error: 'Not found' });

	const errors = validateProject(req.body, { partial: true });
	if (errors.length) return res.status(400).json({ errors });

	if (req.body.name !== undefined) project.name = req.body.name.trim();
	if (req.body.description !== undefined) project.description = req.body.description.trim();
	if (req.body.image !== undefined) project.image = req.body.image.trim();
	if (req.body.rating !== undefined) project.rating = req.body.rating;

	res.json(project);
});

// Delete
router.delete('/:id', (req, res) => {
	const id = Number(req.params.id);
	const idx = projects.findIndex(p => p && p.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	const [deleted] = projects.splice(idx, 1);
	res.json(deleted || { message: 'ok' });
});

// Rate (increment by 1)
router.post('/:id/rate', (req, res) => {
	const id = Number(req.params.id);
	const project = projects.find(p => p && p.id === id);
	if (!project) return res.status(404).json({ error: 'Not found' });
	project.rating += 1;
	res.json(project);
});

module.exports = router;