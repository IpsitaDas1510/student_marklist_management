// Global app state for the entire frontend
let state = {
  // shared
  editingId: null,

  // students
  students: [],

  // teachers
  teachers: [],

  // marks
  marks: [],
  selectedStudentId: null
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}
