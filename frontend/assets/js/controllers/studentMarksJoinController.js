import { renderMarkJoinTable, initReportSearchSort, downloadCSV, downloadPDF } from '../components/MarkJoinTable.js';

/**
 * Fetches the joined marks and student data from the API.
 * Shows/Hides the loading spinner during the request.
 */
async function fetchJoinedMarks() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('hidden');

    try {
        const res = await fetch('/api/marks_with_students');
        if (!res.ok) throw new Error('Failed to fetch data from API');
        const data = await res.json();
        return data || [];
    } catch (err) {
        console.error('API Error:', err);
        return [];
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}

/**
 * EXPORTED INITIALIZATION FUNCTION
 * This is the function your router should call every time the path is visited.
 */
export async function initStudentMarksJoin() {
    console.log("Initializing Student Marks Join Page...");
    
    // 1. Fetch fresh data
    const rows = await fetchJoinedMarks();
    
    // 2. Render the table rows into the #reportBody
    // We pass 'true' to indicate this is the initial load for the master data
    renderMarkJoinTable(rows, true);
    
    // 3. Initialize search and sort event listeners
    initReportSearchSort();

    // 4. Re-attach Export Button Listeners to the new DOM elements
    const csvBtn = document.getElementById('exportCSV');
    const pdfBtn = document.getElementById('exportPDF');

    if (csvBtn) {
        csvBtn.onclick = (e) => {
            e.preventDefault();
            downloadCSV();
        };
    }
    
    if (pdfBtn) {
        pdfBtn.onclick = (e) => {
            e.preventDefault();
            downloadPDF();
        };
    }
}

// Keep this call for the very first time the script is loaded/imported
initStudentMarksJoin();