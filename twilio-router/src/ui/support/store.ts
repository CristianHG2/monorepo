import create from 'zustand';

interface AppState {}

const useStore = create<AppState>(set => ({}));

export default useStore;
