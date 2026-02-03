import { PlantIdentificationResponse, PlantData } from '../types/plant';

const API_URL = 'https://plant.id/api/v3/identification';
const API_KEY = process.env.EXPO_PUBLIC_PLANT_ID_API_KEY || '';

const DETAILS_PARAMS = 'common_names,url,description,taxonomy,rank,image,synonyms,watering';

export class PlantIdError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errorType: 'INVALID_INPUT' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'NO_CREDITS' | 'SERVER_ERROR' | 'NETWORK_ERROR'
    ) {
        super(message);
        this.name = 'PlantIdError';
    }
}

function getErrorFromStatusCode(statusCode: number): { message: string; type: PlantIdError['errorType'] } {
    switch (statusCode) {
        case 400:
            return { message: 'Invalid image data. Please try with a different photo.', type: 'INVALID_INPUT' };
        case 401:
            return { message: 'API key is invalid. Please check configuration.', type: 'UNAUTHORIZED' };
        case 404:
            return { message: 'Identification not found.', type: 'NOT_FOUND' };
        case 429:
            return { message: 'Out of API credits. Please try again later.', type: 'NO_CREDITS' };
        case 500:
        default:
            return { message: 'Server error. Please try again.', type: 'SERVER_ERROR' };
    }
}

export async function identifyPlant(imageBase64: string): Promise<PlantData> {
    console.log("==>API_KEY", API_KEY)
    if (!API_KEY) {
        throw new PlantIdError('API key not configured', 401, 'UNAUTHORIZED');
    }

    const url = `${API_URL}?details=${DETAILS_PARAMS}&language=en`;

    console.log("==>url", url)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': API_KEY,
            },
            body: JSON.stringify({
                images: [`data:image/jpg;base64,${imageBase64}`],
                similar_images: true,
            }),
        });

        if (!response.ok) {
            const error = getErrorFromStatusCode(response.status);
            throw new PlantIdError(error.message, response.status, error.type);
        }

        const data: PlantIdentificationResponse = await response.json();
        console.log("==>data", data)

        if (data.status !== 'COMPLETED') {
            throw new PlantIdError('Identification failed. Please try again.', 500, 'SERVER_ERROR');
        }

        if (!data.result.is_plant.binary) {
            throw new PlantIdError('No plant detected in the image. Please try with a clearer plant photo.', 400, 'INVALID_INPUT');
        }

        const suggestions = data.result.classification.suggestions;
        if (!suggestions || suggestions.length === 0) {
            throw new PlantIdError('Could not identify the plant. Please try with a different photo.', 400, 'INVALID_INPUT');
        }

        // Get the top suggestion
        const topSuggestion = suggestions[0];
        const details = topSuggestion.details;

        // Transform to PlantData with "Unknown" fallbacks
        const plantData: PlantData = {
            id: topSuggestion.id,
            scientificName: topSuggestion.name || 'Unknown',
            commonName: details.common_names?.[0] || 'Unknown',
            probability: topSuggestion.probability,
            description: details.description?.value || 'No description available.',
            imageUrl: details.image?.value || topSuggestion.similar_images?.[0]?.url || '',
            capturedImageUri: '', // Will be set by caller
            taxonomy: {
                family: details.taxonomy?.family || 'Unknown',
                genus: details.taxonomy?.genus || 'Unknown',
                order: details.taxonomy?.order || 'Unknown',
            },
            wikipediaUrl: details.url || '',
            watering: details.watering
                ? `${details.watering.min}-${details.watering.max} days`
                : 'Unknown',
            synonyms: details.synonyms || [],
        };

        return plantData;
    } catch (error) {
        if (error instanceof PlantIdError) {
            throw error;
        }
        throw new PlantIdError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    }
}
