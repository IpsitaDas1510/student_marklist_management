export function renderMarkJoinTable(rows) {
  const body = document.getElementById('reportBody');
  const container = document.getElementById('reportContainer');
  const loading = document.getElementById('loading');
  const noRows = document.getElementById('noRows');

  body.innerHTML = '';
  loading.classList.add('hidden');

  if (!rows || !rows.length) {
    container.classList.add('hidden');
    noRows.classList.remove('hidden');
    return;
  }

  container.classList.remove('hidden');
  noRows.classList.add('hidden');

  rows.forEach((r, i) => {
    const tr = document.createElement('tr');
    // zebra rows
    tr.className = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';

    const pct = typeof r.percentage !== 'undefined' ? Number(r.percentage) : null;
    let pctHtml = '';
    if (pct === null || Number.isNaN(pct)) {
      pctHtml = '';
    } else {
      let color = 'bg-gray-300 text-gray-800';
      if (pct >= 75) color = 'bg-green-500 text-white';
      else if (pct >= 50) color = 'bg-yellow-400 text-white';
      else color = 'bg-red-500 text-white';

      pctHtml = `<span class="px-2 py-1 rounded text-sm ${color}">${pct}%</span>`;
    }

    const yearValue = (typeof r.student_year !== 'undefined' && r.student_year !== null) ? r.student_year : r.year;
    // display numeric year (1/2/3) but do not use it as a filtering link
    const yearLabel = (yearValue === null || typeof yearValue === 'undefined') ? '' : String(yearValue);

    // percentage value used for badge (kept) — do not show subtitle under name

    tr.innerHTML = `
      <td class="border px-3 py-2">${r.id}</td>
      <td class="border px-3 py-2 font-medium">${r.student_name || r.student_id}</td>
      <td class="border px-3 py-2 text-sm text-gray-600">${r.student_email || ''}</td>
      <td class="border px-3 py-2">${r.student_course || ''}</td>
      <td class="border px-3 py-2">${yearLabel}</td>
      <td class="border px-3 py-2">
        <div>${r.core1 ?? ''}</div>
        <div class="text-xs text-gray-500">${r.core1_teacher ? 'T: ' + r.core1_teacher : ''}</div>
      </td>
      <td class="border px-3 py-2">
        <div>${r.core2 ?? ''}</div>
        <div class="text-xs text-gray-500">${r.core2_teacher ? 'T: ' + r.core2_teacher : ''}</div>
      </td>
      <td class="border px-3 py-2">
        <div>${r.core3 ?? ''}</div>
        <div class="text-xs text-gray-500">${r.core3_teacher ? 'T: ' + r.core3_teacher : ''}</div>
      </td>
      <td class="border px-3 py-2">${r.total ?? ''}</td>
      <td class="border px-3 py-2">${pctHtml}</td>
    `;
    body.appendChild(tr);
  });
}
