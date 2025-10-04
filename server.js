const express = require('express');
const path = require('path');

const app = express();
const port = 3430;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
 app.use('/api/projects', require('./routes/projects'));

// Root 
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});