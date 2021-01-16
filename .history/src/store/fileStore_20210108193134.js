import create from "zustand";

export const FileStore = create((set) => ({
    name: null,
    patientId: null;
    setName: (name) => set({ name })
    setPatientId: (patientId) => set({ patientId })
}));
