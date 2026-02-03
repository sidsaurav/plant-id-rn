import { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { Header } from '@/components/Header';
import { PlantOfTheDay } from '@/components/PlantOfTheDay';
import { TabSelector } from '@/components/TabSelector';
import { PlantCard } from '@/components/PlantCard';
import { EmptyState } from '@/components/EmptyState';
import { usePlantStore, useHistory, useCollection } from '@/store/usePlantStore';
import type { ScannedPlant } from '@/store/usePlantStore';

import mockData from '@/data/mock.json';
import { useState } from 'react';

const PLANT_OF_THE_DAY = mockData.plantOfTheDay;
const USER_AVATAR = mockData.userAvatar;

/**
 * Format a date for display on plant cards
 */
function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

/**
 * Get display name for a plant (first common name or scientific name)
 */
function getDisplayName(plant: ScannedPlant): string {
    return plant.commonNames[0] || plant.scientificName || 'Unknown Plant';
}

export default function Home() {
    const [activeContentTab, setActiveContentTab] = useState('Collection');

    // Subscribe to store with optimized selectors
    const history = useHistory();
    const collection = useCollection();
    const { toggleFavorite, isFavorite } = usePlantStore();

    // Get the appropriate list based on selected tab
    const displayedPlants = activeContentTab === 'Collection' ? collection : history;

    const handleCardPress = useCallback((plant: ScannedPlant) => {
        // Navigate to plant detail
        router.push({
            pathname: '/plant-detail',
            params: {
                scientificName: plant.scientificName,
                commonNames: plant.commonNames.join(','),
                probability: plant.probability.toString(),
                description: plant.description,
                imageUrl: plant.imageUrl,
                capturedImageUri: plant.capturedImageUri,
                family: plant.taxonomy.family,
                genus: plant.taxonomy.genus,
                order: plant.taxonomy.order,
                wikipediaUrl: plant.wikipediaUrl,
                watering: plant.watering?.label || 'Unknown',
                synonyms: plant.synonyms.join(','),
                edibleParts: plant.edibleParts.join(','),
                propagationMethods: plant.propagationMethods.join(','),
            },
        });
    }, []);

    const handleFavoriteToggle = useCallback(
        (plantId: string) => {
            toggleFavorite(plantId);
        },
        [toggleFavorite]
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />

            <Header
                userName="Alex"
                avatarUrl={USER_AVATAR}
                onBadgePress={() => { }}
                onSettingsPress={() => { }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Plant of the Day */}
                <View style={styles.plantOfDayContainer}>
                    <PlantOfTheDay
                        name={PLANT_OF_THE_DAY.name}
                        nickname={PLANT_OF_THE_DAY.nickname}
                        imageUrl={PLANT_OF_THE_DAY.imageUrl}
                        onLearnMore={() => { }}
                    />
                </View>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TabSelector
                        tabs={['Collection', 'History']}
                        activeTab={activeContentTab}
                        onTabChange={setActiveContentTab}
                    />
                </View>

                {/* Plant Grid or Empty State */}
                {displayedPlants.length === 0 ? (
                    <EmptyState
                        icon={activeContentTab === 'Collection' ? 'heart-outline' : 'time-outline'}
                        title={
                            activeContentTab === 'Collection'
                                ? 'No favorites yet'
                                : 'No scans yet'
                        }
                        subtitle={
                            activeContentTab === 'Collection'
                                ? 'Tap the heart icon on any scanned plant to add it to your collection.'
                                : 'Scan a plant using the camera to start building your history.'
                        }
                    />
                ) : (
                    <View style={styles.grid}>
                        {displayedPlants.map((plant) => (
                            <View key={plant.id} style={styles.gridItem}>
                                <PlantCard
                                    name={getDisplayName(plant)}
                                    imageUrl={plant.capturedImageUri || plant.imageUrl}
                                    date={formatDate(plant.scannedAt)}
                                    isFavorite={isFavorite(plant.id)}
                                    onPress={() => handleCardPress(plant)}
                                    onFavoriteToggle={() => handleFavoriteToggle(plant.id)}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8f6',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    plantOfDayContainer: {
        padding: 16,
    },
    tabContainer: {
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
        marginTop: 8,
    },
    gridItem: {
        width: '47%',
    },
});
