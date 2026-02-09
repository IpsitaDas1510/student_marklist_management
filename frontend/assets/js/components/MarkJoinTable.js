let masterReportData = [];
let filteredData = [];
let listenersInitialized = false;

/**
 * Render Student–Marks Join Table
 */
export function renderMarkJoinTable(rows, isInitialLoad = true) {
  const body = document.getElementById('reportBody');
  const container = document.getElementById('reportContainer');
  const noRows = document.getElementById('noRows');

  // Router safety
  if (!body) return;

  // 🔥 CRITICAL: clear table to avoid duplicates
  body.innerHTML = '';

  if (isInitialLoad) {
    masterReportData = [...rows];
  }
  filteredData = [...rows];

  if (!rows || rows.length === 0) {
    container?.classList.add('hidden');
    noRows?.classList.remove('hidden');
    return;
  }

  container?.classList.remove('hidden');
  noRows?.classList.add('hidden');

  rows.forEach((r) => {
    const tr = document.createElement('tr');
    tr.className = 'bg-black/10 backdrop-blur-sm hover:bg-white/10 transition text-sm';

    const total =
      r.total ??
      (Number(r.core1 || 0) +
        Number(r.core2 || 0) +
        Number(r.core3 || 0));

    const pct =
      typeof r.percentage !== 'undefined'
        ? Number(r.percentage)
        : ((total / 300) * 100).toFixed(2);

    const color =
      pct >= 75 ? 'bg-green-900' : pct >= 50 ? 'bg-yellow-900' : 'bg-red-900';

    // Capture the year correctly to pass it in the link
    const currentYear = r.exam_year ?? r.student_year ?? r.year ?? '';

    tr.innerHTML = `
      <td class="border border-white/20 px-3 py-2 text-center">${r.student_id}</td>

      <td class="border border-white/20 px-3 py-2 font-medium">
        <a href="/student-profile?id=${r.student_id}&year=${currentYear}"
           data-link
           class="text-blue-400 hover:text-blue-300 hover:underline transition">
           ${r.student_name || 'N/A'}
        </a>
      </td>

      <td class="border border-white/20 px-3 py-2 text-xs text-gray-400">
        ${r.student_email || ''}
      </td>

      <td class="border border-white/20 px-3 py-2 text-center">
        ${r.student_course || ''}
      </td>

      <td class="border border-white/20 px-3 py-2 text-center">
        ${currentYear}
      </td>

      <td class="border border-white/20 px-3 py-2 text-center">${r.core1 ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.core2 ?? 0}</td>
      <td class="border border-white/20 px-3 py-2 text-center">${r.core3 ?? 0}</td>

      <td class="border border-white/20 px-3 py-2 text-center font-bold">
        ${total}
      </td>

      <td class="border border-white/20 px-3 py-2 text-center">
        <span class="px-2 py-1 rounded text-[11px] text-white ${color}">
          ${pct}%
        </span>
      </td>
    `;

    body.appendChild(tr);
  });
}

/**
 * Search + Sort (bind once only)
 */
export function initReportSearchSort() {
  if (listenersInitialized) return;
  listenersInitialized = true;

  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (!searchInput || !sortSelect) return;

  const applyFilters = () => {
    const term = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    let result = masterReportData.filter((r) =>
      r.student_name?.toLowerCase().includes(term) ||
      r.student_email?.toLowerCase().includes(term) ||
      String(r.student_id).includes(term)
    );

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) =>
          (a.student_name || '').localeCompare(b.student_name || '')
        );
        break;
      case 'total-desc':
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case 'perc-desc':
        result.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
        break;
      case 'id-asc':
        result.sort((a, b) => a.student_id - b.student_id);
        break;
    }

    renderMarkJoinTable(result, false);
  };

  searchInput.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
}

/**
 * CSV Export
 * Downloads student report data as a CSV file
 */
export function downloadCSV() {
  // If there is no data, do nothing
  if (!filteredData.length) return;

  // CSV header row
  const headers =
    'ID,Student,Email,Course,Year,Core1,Core2,Core3,Total,Percentage';

  // Convert each student record into a CSV row
  const rows = filteredData.map((r) => {
    // Safely extract marks (default to 0 if missing)
    const c1 = r.core1 ?? 0;
    const c2 = r.core2 ?? 0;
    const c3 = r.core3 ?? 0;

    // Calculate total marks if not already present
    const total = r.total ?? (c1 + c2 + c3);

    // Maximum possible marks (3 subjects × 100)
    const maxMarks = 300;

    // Calculate percentage
    const percentage = ((total / maxMarks) * 100).toFixed(2);

    // Return CSV row as a comma-separated string
    return [
      r.student_id,
      `"${r.student_name || 'N/A'}"`,
      `"${r.student_email || ''}"`,
      `"${r.student_course || ''}"`,
      r.exam_year ?? r.student_year ?? r.year ?? '',
      c1,
      c2,
      c3,
      total,
      `${percentage}%`
    ].join(',');
  });

  // Create CSV file as a Blob
  const blob = new Blob([[headers, ...rows].join('\n')], {
    type: 'text/csv'
  });

  // Create a temporary download link
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Student_Report.csv';

  // Trigger download
  a.click();
}

/**
 * PDF Export
 * Downloads student report data as a formatted PDF file
 */
export function downloadPDF() {
  // Get jsPDF constructor safely
  const Constructor = window.jspdf?.jsPDF || window.jsPDF;

  // Stop if library is not loaded or no data is available
  if (!Constructor || !filteredData.length) {
    alert('PDF library not ready or no data.');
    return;
  }

  // Create a new PDF document in landscape mode
  const doc = new Constructor('landscape');

  // Set title font size
  doc.setFontSize(18);

  // Add title text
  doc.text('Student Progress Report Card', 14, 15);

  // Prepare table rows
  const rows = filteredData.map((r) => {
    // Safely extract marks
    const c1 = r.core1 ?? 0;
    const c2 = r.core2 ?? 0;
    const c3 = r.core3 ?? 0;

    // Calculate total marks
    const total = r.total ?? (c1 + c2 + c3);

    // Maximum marks
    const maxMarks = 300;

    // Calculate percentage
    const percentage = ((total / maxMarks) * 100).toFixed(2);

    // Return row data for PDF table
    return [
      r.student_id,
      r.student_name || 'N/A',
      r.student_course || '',
      r.exam_year ?? r.student_year ?? r.year ?? '',
      c1,
      c2,
      c3,
      total,
      `${percentage}%`
    ];
  });

  // Generate table using autoTable plugin
  doc.autoTable({
    head: [['ID', 'Student', 'Course', 'Year', 'C1', 'C2', 'C3', 'Total', '%']],
    body: rows,
    startY: 28,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    },
    styles: {
      textColor: [0, 0, 0]
    }
  });

  // Save the PDF with a timestamped filename
  doc.save(`Report_Card_${Date.now()}.pdf`);
}
