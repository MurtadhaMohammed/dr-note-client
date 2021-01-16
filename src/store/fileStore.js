import create from "zustand";

export const FileStore = create((set) => ({
    name: null,
    PatientId: null,
    setName: (name) => set({ name }),
    setPatientId: (PatientId) => set({ PatientId })
}));
