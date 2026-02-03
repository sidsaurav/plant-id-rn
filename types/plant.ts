// Types for Plant.id API responses

export interface PlantIdentificationResponse {
    access_token: string;
    model_version: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    result: PlantResult;
    created: number;
    completed: number;
}

export interface PlantResult {
    classification: {
        suggestions: PlantSuggestion[];
    };
    is_plant: {
        probability: number;
        binary: boolean;
    };
}

export interface PlantSuggestion {
    id: string;
    name: string;
    probability: number;
    similar_images?: SimilarImage[];
    details: PlantDetails;
}

export interface SimilarImage {
    id: string;
    url: string;
    url_small: string;
    similarity: number;
}

export interface PlantDetails {
    common_names: string[] | null;
    taxonomy: PlantTaxonomy | null;
    url: string | null;
    description: PlantDescription | null;
    image: PlantImage | null;
    synonyms: string[] | null;
    edible_parts: string[] | null;
    watering: WateringInfo | null;
    propagation_methods: string[] | null;
    gbif_id: number | null;
    inaturalist_id: number | null;
}

export interface PlantTaxonomy {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
}

export interface PlantDescription {
    value: string;
    citation: string;
}

export interface PlantImage {
    value: string;
    citation?: string;
}

export interface WateringInfo {
    min: number;
    max: number;
}

// Simplified plant data for navigation/display
export interface PlantData {
    id: string;
    scientificName: string;
    commonNames: string[];
    probability: number;
    description: string;
    imageUrl: string;
    capturedImageUri: string;
    taxonomy: {
        family: string;
        genus: string;
        order: string;
    };
    wikipediaUrl: string;
    watering: {
        min: number;
        max: number;
        label: string;
    } | null;
    synonyms: string[];
    edibleParts: string[];
    propagationMethods: string[];
    gbifId: number | null;
    inaturalistId: number | null;
}
