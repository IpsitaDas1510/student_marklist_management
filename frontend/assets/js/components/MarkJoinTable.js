let masterReportData = [];
let filteredData = []; // Tracks the current state for exports

export function renderMarkJoinTable(rows, isInitialLoad = false) {
  if (isInitialLoad) masterReportData = rows;
  filteredData = rows; 

  const body = document.getElementById('reportBody');
  const container = document.getElementById('reportContainer');
  const noRows = document.getElementById('noRows');

  // CRITICAL: Exit if the router hasn't injected the HTML yet
  if (!body) {
      console.warn("Table body not found in DOM yet.");
      return;
  }
  
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
      <td class="border border-white/20 px-3 py-2 font-medium">
        <a href="/student-profile?id=${r.id}" 
           data-link 
           class="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors">
           ${r.student_name || 'N/A'}
        </a>
      </td>
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

  // Guard against missing elements on page transition
  if (!searchInput || !sortSelect) return;

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

export function downloadCSV() {
  const headers = "ID,Student,Email,Course,Year,Core1,Core2,Core3,Total,Percentage";
  const rows = filteredData.map(r => 
    `${r.id},"${r.student_name || 'N/A'}","${r.student_email || ''}","${r.student_course || ''}",${r.student_year ?? r.year ?? ''},${r.core1 ?? 0},${r.core2 ?? 0},${r.core3 ?? 0},${r.total ?? 0},${r.percentage || 0}%`
  );
  const blob = new Blob([[headers, ...rows].join("\n")], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Student_Reports.csv`;
  a.click();
}

export function downloadPDF() {
  const { jsPDF } = window.jspdf || {};
  const Constructor = jsPDF || window.jsPDF;

  if (!Constructor) {
    alert("The PDF library is still loading.");
    return;
  }

  const doc = new Constructor('landscape');

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

  // Title in Black
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text("Student Progress Report Card", 14, 15);

  doc.autoTable({
    head: [["ID", "Student", "Course", "Year", "C1", "C2", "C3", "Total", "%"]],
    body: tableRows,
    startY: 28,
    theme: 'grid',
    // Header Colors: White Background with Black Text
    headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1 
    },
    styles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0]
    }
  });

  doc.save(`Report_Card_${new Date().getTime()}.pdf`);
}