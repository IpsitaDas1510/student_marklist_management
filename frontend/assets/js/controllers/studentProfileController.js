/**
 * UTILITY: Safe DOM Updates
 */
const safeSet = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
};

/**
 * DATA FETCHING - Move this above the init function
 */
async function fetchStudentDetails(id) {
    try {
        const res = await fetch('/api/marks_with_students');
        if (!res.ok) throw new Error("API Network Response Error");
        const data = await res.json();
        return data.find(student => String(student.id) === String(id));
    } catch (err) {
        console.error("Critical Profile Error:", err);
        return null;
    }
}

/**
 * EXPORT LOGIC: CSV & PDF
 */
function downloadSingleCSV(s) {
    const headers = "ID,Name,Email,Course,Year,C1,C2,C3,Total,Percentage";
    const row = `${s.id},"${s.student_name || 'N/A'}","${s.student_email || ''}","${s.student_course || ''}",${s.student_year ?? s.year ?? ''},${s.core1 ?? 0},${s.core2 ?? 0},${s.core3 ?? 0},${s.total ?? 0},${s.percentage || 0}%`;
    const blob = new Blob([[headers, row].join("\n")], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${(s.student_name || 'Student').replace(/\s+/g, '_')}.csv`;
    a.click();
}

/**
 * ROUTER-COMPATIBLE INITIALIZATION
 */
export async function initStudentProfile() {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    const loading = document.getElementById('profileLoading');
    const content = document.getElementById('profileContent');
    const errorState = document.getElementById('errorState');

    if (loading) loading.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    if (errorState) errorState.classList.add('hidden');

    if (!studentId) {
        if (loading) loading.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
        return;
    }

    // Now this call will work because fetchStudentDetails is defined in scope
    const student = await fetchStudentDetails(studentId);

    if (loading) loading.classList.add('hidden');

    if (student) {
        if (content) content.classList.remove('hidden');

        safeSet('profName', student.student_name || 'N/A');
        safeSet('profEmail', student.student_email || 'No email');
        safeSet('profId', `#${student.id}`);
        safeSet('profCourse', student.student_course || 'N/A');
        safeSet('profYear', student.student_year ?? student.year ?? 'N/A');
        safeSet('profC1', student.core1 ?? 0);
        safeSet('profC2', student.core2 ?? 0);
        safeSet('profC3', student.core3 ?? 0);
        safeSet('profTotal', student.total ?? 0);
        safeSet('profPerc', `${student.percentage || 0}%`);
        
        const csvBtn = document.getElementById('exportProfileCSV');
        if (csvBtn) csvBtn.onclick = () => downloadSingleCSV(student);
        
    } else {
        if (errorState) errorState.classList.remove('hidden');
    }
}