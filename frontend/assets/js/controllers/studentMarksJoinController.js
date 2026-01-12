import { renderMarkJoinTable } from '../components/MarkJoinTable.js';

async function fetchJoinedMarks() {
  try {
    const res = await fetch('/api/marks_with_students');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error('Error fetching joined marks:', err);
    return [];
  }
}

(async function init() {
  const rows = await fetchJoinedMarks();
  renderMarkJoinTable(rows);
})();
