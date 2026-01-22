import { renderMarkJoinTable, initReportSearchSort, downloadCSV, downloadPDF } from '../components/MarkJoinTable.js';

async function fetchJoinedMarks() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.remove('hidden');

  try {
    const res = await fetch('/api/marks_with_students');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error('API Error:', err);
    return [];
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

(async function init() {
  const rows = await fetchJoinedMarks();
  
  // Initialize table and filter listeners
  renderMarkJoinTable(rows, true);
  initReportSearchSort();

  // Attach Export Listeners
  const csvBtn = document.getElementById('exportCSV');
  const pdfBtn = document.getElementById('exportPDF');

  if (csvBtn) csvBtn.onclick = downloadCSV;
  if (pdfBtn) pdfBtn.onclick = downloadPDF;
})();



