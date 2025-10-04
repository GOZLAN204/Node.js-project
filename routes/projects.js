const express = require('express');
const router = express.Router();

// In-memory store
let projects = [];
let nextId = 1;