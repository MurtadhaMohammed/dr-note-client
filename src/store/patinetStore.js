import create from "zustand";

export const PatientStore = create((set) => ({
  name: null,
  age: null,
  phone: null,
  gender: null,
  address: null,
  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setPhone: (phone) => set({ phone }),
  setAddress: (address) => set({ address }),
}));
