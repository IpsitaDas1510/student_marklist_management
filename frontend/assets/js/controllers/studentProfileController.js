// /**
//  * UTILITY: Safe DOM Updates
//  */
// const safeSet = (id, value) => {
//     const el = document.getElementById(id);
//     if (el) el.innerText = value;
// };

// /**
//  * DATA FETCHING - Move this above the init function
//  */
// async function fetchStudentDetails(id) {
//     try {
//         const res = await fetch('/api/marks_with_students');
//         if (!res.ok) throw new Error("API Network Response Error");
//         const data = await res.json();
//         return data.find(student => String(student.id) === String(id));
//     } catch (err) {
//         console.error("Critical Profile Error:", err);
//         return null;
//     }
// }

// /**
//  * EXPORT LOGIC: CSV & PDF
//  */
// function downloadSingleCSV(s) {
//     const headers = "ID,Name,Email,Course,Year,C1,C2,C3,Total,Percentage";
//     const row = `${s.id},"${s.student_name || 'N/A'}","${s.student_email || ''}","${s.student_course || ''}",${s.student_year ?? s.year ?? ''},${s.core1 ?? 0},${s.core2 ?? 0},${s.core3 ?? 0},${s.total ?? 0},${s.percentage || 0}%`;
//     const blob = new Blob([[headers, row].join("\n")], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Report_${(s.student_name || 'Student').replace(/\s+/g, '_')}.csv`;
//     a.click();
// }

// /**
//  * ROUTER-COMPATIBLE INITIALIZATION
//  */
// export async function initStudentProfile() {
//     const params = new URLSearchParams(window.location.search);
//     const studentId = params.get('id');

//     const loading = document.getElementById('profileLoading');
//     const content = document.getElementById('profileContent');
//     const errorState = document.getElementById('errorState');

//     if (loading) loading.classList.remove('hidden');
//     if (content) content.classList.add('hidden');
//     if (errorState) errorState.classList.add('hidden');

//     if (!studentId) {
//         if (loading) loading.classList.add('hidden');
//         if (errorState) errorState.classList.remove('hidden');
//         return;
//     }

//     // Now this call will work because fetchStudentDetails is defined in scope
//     const student = await fetchStudentDetails(studentId);

//     if (loading) loading.classList.add('hidden');

//     if (student) {
//         if (content) content.classList.remove('hidden');

//         safeSet('profName', student.student_name || 'N/A');
//         safeSet('profEmail', student.student_email || 'No email');
//         safeSet('profId', `#${student.id}`);
//         safeSet('profCourse', student.student_course || 'N/A');
//         safeSet('profYear', student.student_year ?? student.year ?? 'N/A');
//         safeSet('profC1', student.core1 ?? 0);
//         safeSet('profC2', student.core2 ?? 0);
//         safeSet('profC3', student.core3 ?? 0);
//         safeSet('profTotal', student.total ?? 0);
//         safeSet('profPerc', `${student.percentage || 0}%`);
        
//         const csvBtn = document.getElementById('exportProfileCSV');
//         if (csvBtn) csvBtn.onclick = () => downloadSingleCSV(student);
        
//     } else {
//         if (errorState) errorState.classList.remove('hidden');
//     }
// }











/**
 * UTILITY: Safe DOM Updates
 */
const safeSet = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
};

/**
 * DATA FETCHING - Uses a timestamp to force fresh data from the API
 */
async function fetchStudentDetails(id) {
    try {
        const res = await fetch(`/api/marks_with_students?t=${Date.now()}`);
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        
        // Match the ID from the URL against the data array
        return data.find(student => String(student.id) === String(id));
    } catch (err) {
        console.error("Fetch Error:", err);
        return null;
    }
}

/**
 * PDF EXPORT: Uses your specific jsPDF logic
 */
function downloadSinglePDF(s, finalPerc) {
    const { jsPDF } = window.jspdf || {};
    const Constructor = jsPDF || window.jsPDF;
    
    if (!Constructor) {
        alert("PDF library not found. Ensure jsPDF is in index.html");
        return;
    }

    const doc = new Constructor('p', 'pt', 'a4');
    const tableRows = [[
        s.id,
        s.student_name || 'N/A',
        s.student_course || 'N/A',
        s.year || s.student_year || 'N/A',
        s.core1 || 0,
        s.core2 || 0,
        s.core3 || 0,
        s.total || 0,
        finalPerc + "%"
    ]];

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Student Progress Report Card", 40, 50);

    doc.autoTable({
        head: [["ID", "Student", "Course", "Year", "C1", "C2", "C3", "Total", "%"]],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        styles: { textColor: [0, 0, 0] }
    });

    doc.save(`Report_${(s.student_name || 'Student').replace(/\s+/g, '_')}.pdf`);
}

/**
 * MAIN INITIALIZATION
 */
export async function initStudentProfile() {
    // 1. FORCE URL PARSING: This fixes the "Stuck on ID 1" issue
    const urlObj = new URL(window.location.href);
    const studentId = urlObj.searchParams.get('id');

    const loading = document.getElementById('profileLoading');
    const content = document.getElementById('profileContent');
    const errorState = document.getElementById('errorState');

    // 2. RESET UI: Clear old data immediately
    if (loading) loading.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    if (errorState) errorState.classList.add('hidden');

    if (!studentId) {
        if (loading) loading.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
        return;
    }

    // 3. FETCH DATA
    const student = await fetchStudentDetails(studentId);

    if (loading) loading.classList.add('hidden');

    if (student) {
        if (content) content.classList.remove('hidden');

        // Calculate actual percentage (279/300 = 93.00)
        const totalMarks = student.total ?? 0;
        const finalPerc = ((totalMarks / 300) * 100).toFixed(2);

        // 4. POPULATE UI
        safeSet('profName', student.student_name || 'N/A');
        safeSet('profEmail', student.student_email || 'No email');
        safeSet('profId', `#${student.id}`);
        safeSet('profCourse', student.student_course || 'N/A');
        safeSet('profYear', student.year || student.student_year || 'N/A');
        safeSet('profC1', student.core1 ?? 0);
        safeSet('profC2', student.core2 ?? 0);
        safeSet('profC3', student.core3 ?? 0);
        safeSet('profTotal', totalMarks);
        safeSet('profPerc', `${finalPerc}%`);
        
        // 5. ATTACH LISTENERS
        const pdfBtn = document.getElementById('exportProfilePDF');
        if (pdfBtn) {
            pdfBtn.onclick = (e) => {
                e.preventDefault();
                downloadSinglePDF(student, finalPerc);
            };
        }

        const csvBtn = document.getElementById('exportProfileCSV');
        if (csvBtn) {
            csvBtn.onclick = (e) => {
                e.preventDefault();
                // Simple inline CSV logic for speed
                const csvContent = `ID,Name,Total,Perc\n${student.id},${student.student_name},${totalMarks},${finalPerc}%`;
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', `Report_${student.id}.csv`);
                a.click();
            };
        }
    } else {
        if (errorState) errorState.classList.remove('hidden');
    }
}