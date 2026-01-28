/**
 * UTILITY: Safe DOM Updates
 */
const safeSet = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
};

/**
 * FETCH DATA – Matches by ID and Year
 */
async function fetchStudentDetails(targetId, targetYear) {
    try {
        const res = await fetch(`/api/marks_with_students?t=${Date.now()}`);
        const data = await res.json();
        const records = Array.isArray(data) ? data : (data.data || []);

        return records.find(row => 
            String(row.student_id) === String(targetId) && 
            String(row.year) === String(targetYear)
        );
    } catch (err) {
        return null;
    }
}

/**
 * MAIN INITIALIZATION
 */
export async function initStudentProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id") || urlParams.get("student_id");
    const year = urlParams.get("year");

    const loading = document.getElementById("profileLoading");
    const content = document.getElementById("profileContent");
    const errorState = document.getElementById("errorState");

    // UI Reset
    if (loading) loading.classList.remove("hidden");
    if (content) content.classList.add("hidden");
    if (errorState) errorState.classList.add("hidden");

    if (!studentId) {
        if (loading) loading.classList.add("hidden");
        if (errorState) errorState.classList.remove("hidden");
        return;
    }

    const student = await fetchStudentDetails(studentId, year);

    if (loading) loading.classList.add("hidden");

    if (!student) {
        if (errorState) errorState.classList.remove("hidden");
        return;
    }

    // Success: Populate the UI
    if (content) content.classList.remove("hidden");

    const totalMarks = Number(student.total) || 0;
    const finalPerc = ((totalMarks / 300) * 100).toFixed(2);

    safeSet("profName", student.student_name);
    safeSet("profEmail", student.student_email || "No email available");
    safeSet("profId", `#${student.student_id}`);
    safeSet("profCourse", student.student_course);
    safeSet("profYear", `Year ${student.year}`);
    safeSet("profC1", student.core1 ?? 0);
    safeSet("profC2", student.core2 ?? 0);
    safeSet("profC3", student.core3 ?? 0);
    safeSet("profTotal", totalMarks);
    safeSet("profPerc", `${finalPerc}%`);

    // ✅ Attach Listeners
    setupListeners(student, finalPerc);
}

/**
 * PDF & CSV HANDLERS
*/
function setupListeners(student, finalPerc) {
    const pdfBtn = document.getElementById('exportProfilePDF');
    if (pdfBtn) {
        pdfBtn.onclick = (e) => {
            e.preventDefault();

            // 1. Get the library from the window object
            const { jsPDF } = window.jspdf || {};
            
            if (!jsPDF) {
                alert("PDF Library (jsPDF) not found. Please ensure <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'></script> is in your HTML.");
                return;
            }

            // 2. Initialize PDF
            const doc = new jsPDF();
            
            // 3. Add Content (Simple Styling)
            doc.setFontSize(22);
            doc.text("Student Progress Report", 20, 20);
            
            doc.setFontSize(14);
            doc.text(`Student: ${student.student_name}`, 20, 40);
            doc.text(`ID: ${student.student_id}`, 20, 50);
            doc.text(`Academic Year: ${student.year}`, 20, 60);
            doc.text(`Course: ${student.student_course}`, 20, 70);
            
            doc.line(20, 75, 190, 75); // Divider line
            
            doc.text(`Core Subject 1: ${student.core1 || 0}`, 20, 85);
            doc.text(`Core Subject 2: ${student.core2 || 0}`, 20, 95);
            doc.text(`Core Subject 3: ${student.core3 || 0}`, 20, 105);
            
            doc.setFont(undefined, 'bold');
            doc.text(`Total Marks: ${student.total || 0}`, 20, 120);
            doc.text(`Percentage: ${finalPerc}%`, 20, 130);

            // 4. Download the file
            doc.save(`Report_${student.student_id}_Year${student.year}.pdf`);
        };
    }

    const csvBtn = document.getElementById('exportProfileCSV');
    if (csvBtn) {
        csvBtn.onclick = (e) => {
            e.preventDefault();
            const total = student.total ?? 0; 
            const csvContent = `ID,Name,Total,Perc\n${student.student_id},${student.student_name},${total},${finalPerc}%`;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `Report_${student.student_id}.csv`);
            a.click();
        };
    }
}