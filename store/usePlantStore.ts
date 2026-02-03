import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlantData } from '../types/plant';

/**
 * Represents a plant that has been scanned and saved to history
 */
export interface ScannedPlant extends PlantData {
    /** ISO timestamp when the plant was scanned */
    scannedAt: string;
}

interface PlantStoreState {
    /** Array of scanned plants, newest first */
    history: ScannedPlant[];
    /** Set of plant IDs that are favorited */
    favoriteIds: string[];
}

interface PlantStoreActions {
    /** Add a plant to history after successful identification */
    addToHistory: (plant: PlantData) => void;
    /** Toggle favorite status for a plant */
    toggleFavorite: (plantId: string) => void;
    /** Check if a plant is favorited */
    isFavorite: (plantId: string) => boolean;
    /** Get collection (favorited plants only) */
    getCollection: () => ScannedPlant[];
    /** Clear all history (for testing/reset) */
    clearHistory: () => void;
}

type PlantStore = PlantStoreState & PlantStoreActions;

/**
 * Zustand store for plant history and favorites
 * Persisted to AsyncStorage for offline-first experience
 */
export const usePlantStore = create<PlantStore>()(
    persist(
        (set, get) => ({
            // Initial state
            history: [],
            favoriteIds: [],

            // Actions
            addToHistory: (plant: PlantData) => {
                const scannedPlant: ScannedPlant = {
                    ...plant,
                    scannedAt: new Date().toISOString(),
                };

                set((state) => ({
                    // Add to beginning of array (newest first)
                    // Avoid duplicates by checking ID
                    history: [
                        scannedPlant,
                        ...state.history.filter((p) => p.id !== plant.id),
                    ],
                }));
            },

            toggleFavorite: (plantId: string) => {
                set((state) => {
                    const isFav = state.favoriteIds.includes(plantId);
                    return {
                        favoriteIds: isFav
                            ? state.favoriteIds.filter((id) => id !== plantId)
                            : [...state.favoriteIds, plantId],
                    };
                });
            },

            isFavorite: (plantId: string) => {
                return get().favoriteIds.includes(plantId);
            },

            getCollection: () => {
                const { history, favoriteIds } = get();
                return history.filter((plant) => favoriteIds.includes(plant.id));
            },

            clearHistory: () => {
                set({ history: [], favoriteIds: [] });
            },
        }),
        {
            name: 'plant-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist data, not functions
            partialize: (state) => ({
                history: state.history,
                favoriteIds: state.favoriteIds,
            }),
        }
    )
);

// Selector hooks for optimized re-renders
export const useHistory = () => usePlantStore((state) => state.history);
export const useFavoriteIds = () => usePlantStore((state) => state.favoriteIds);
export const useCollection = () => {
    const history = usePlantStore((state) => state.history);
    const favoriteIds = usePlantStore((state) => state.favoriteIds);
    return history.filter((plant) => favoriteIds.includes(plant.id));
};
