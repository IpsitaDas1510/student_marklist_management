let masterReportData = [];
let filteredData = []; // Tracks the current state for exports

export function renderMarkJoinTable(rows, isInitialLoad = false) {
  if (isInitialLoad) masterReportData = rows;
  filteredData = rows; 

  const body = document.getElementById('reportBody');
  const container = document.getElementById('reportContainer');
  const noRows = document.getElementById('noRows');

  if (!body) return;
  body.innerHTML = '';

  if (!rows || !rows.length) {
    if (container) container.classList.add('hidden');
    if (noRows) noRows.classList.remove('hidden');
    return;
  }

  if (container) container.classList.remove('hidden');
  if (noRows) noRows.classList.add('hidden');

  rows.forEach((r) => {
    const tr = document.createElement('tr');
    tr.className = 'bg-black/10 backdrop-blur-sm hover:bg-white/10 transition text-sm';

    const pct = typeof r.percentage !== 'undefined' ? Number(r.percentage) : null;
    let pctHtml = '';
    if (pct !== null && !Number.isNaN(pct)) {
      let color = pct >= 75 ? 'bg-green-500' : (pct >= 50 ? 'bg-yellow-400' : 'bg-red-500');
      pctHtml = `<span class="px-2 py-1 rounded text-[11px] text-white ${color}">${pct}%</span>`;
    }

    tr.innerHTML = `
      <td class="border border-white/20 px-3 py-2 text-center">${r.id}</td>
      <td class="border border-white/20 px-3 py-2 font-medium">${r.student_name || 'N/A'}</td>
      <td class="border border-white/20 px-3 py-2 text-xs text-gray-400">${r.student_email || ''}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.student_course || ''}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.student_year ?? r.year ?? ''}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.core1 ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.core2 ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.core3 ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center font-bold">${r.total ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${pctHtml}</td>
    `;
    body.appendChild(tr);
  });
}

export function initReportSearchSort() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  const applyFilters = () => {
    const term = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    let filtered = masterReportData.filter(r => 
      (r.student_name?.toLowerCase().includes(term)) ||
      (r.student_email?.toLowerCase().includes(term)) ||
      (String(r.id).includes(term))
    );

    if (sortBy === 'name-asc') filtered.sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''));
    else if (sortBy === 'total-desc') filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    else if (sortBy === 'perc-desc') filtered.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    else if (sortBy === 'id-asc') filtered.sort((a, b) => a.id - b.id);

    renderMarkJoinTable(filtered, false);
  };

  searchInput.oninput = applyFilters;
  sortSelect.onchange = applyFilters;
}

// Export Logic
export function downloadCSV() {
  const headers = "ID,Student,Email,Course,Year,Core1,Core2,Core3,Total,Percentage";
  const rows = filteredData.map(r => 
    `${r.id},"${r.student_name}","${r.student_email}","${r.student_course}",${r.student_year ?? r.year},${r.core1},${r.core2},${r.core3},${r.total},${r.percentage}%`
  );
  const blob = new Blob([[headers, ...rows].join("\n")], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Student_Reports.csv`;
  a.click();
}

export function downloadPDF() {
  // 1. Try to get the constructor from window.jspdf or window.jsPDF
  const { jsPDF } = window.jspdf || {};
  const Constructor = jsPDF || window.jsPDF;

  if (!Constructor) {
    alert("The PDF library is still loading or failed to load. Please refresh the page.");
    return;
  }

  // 2. Initialize doc (landscape orientation)
  const doc = new Constructor('landscape');

  // 3. Prepare the data from filteredData
  if (!filteredData || filteredData.length === 0) {
    alert("No data available to export.");
    return;
  }

  const tableRows = filteredData.map(r => [
    r.id,
    r.student_name || 'N/A',
    r.student_course || '',
    r.student_year ?? r.year ?? '',
    r.core1 ?? 0,
    r.core2 ?? 0,
    r.core3 ?? 0,
    r.total ?? 0,
    (r.percentage || 0) + "%"
  ]);

  // 4. Set Title
  doc.setFontSize(18);
  doc.text("Student Progress Report Card", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  // 5. Generate Table using autoTable
  // autoTable is usually attached to the doc instance automatically
  if (typeof doc.autoTable !== 'function') {
    alert("The Table plugin (autotable) is not loaded correctly.");
    return;
  }

  doc.autoTable({
    head: [["ID", "Student", "Course", "Year", "C1", "C2", "C3", "Total", "%"]],
    body: tableRows,
    startY: 28,
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] }, // Dark theme headers
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // 6. Save
  doc.save(`Report_Card_${new Date().getTime()}.pdf`);
}






