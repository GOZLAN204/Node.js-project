 const API = '/api/projects';
//const API = '/p';
const detail = document.getElementById('detail');

function qs(name) {
  return new URL(location.href).searchParams.get(name);
} 