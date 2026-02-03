import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PlantDetail() {

    const params = useLocalSearchParams<{
        scientificName: string;
        commonName: string;
        probability: string;
        description: string;
        imageUrl: string;
        capturedImageUri: string;
        family: string;
        genus: string;
        order: string;
        wikipediaUrl: string;
        watering: string;
        synonyms: string;
    }>();

    const probability = parseFloat(params.probability || '0');
    const confidencePercent = Math.round(probability * 100);
    const synonyms = params.synonyms ? params.synonyms.split(',').filter(Boolean) : [];

    const handleOpenWikipedia = () => {
        if (params.wikipediaUrl) {
            Linking.openURL(params.wikipediaUrl);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const displayImage = params.capturedImageUri || params.imageUrl;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                {displayImage ? (
                    <Image source={{ uri: displayImage }} style={styles.heroImage} />
                ) : (
                    <View style={[styles.heroImage, styles.placeholderImage]}>
                        <Ionicons name="leaf" size={80} color="rgba(55, 236, 19, 0.3)" />
                    </View>
                )}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.heroGradient}
                />

                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Confidence Badge */}
                <View style={styles.confidenceBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#37ec13" />
                    <Text style={styles.confidenceText}>{confidencePercent}% Match</Text>
                </View>

                {/* Plant Name Overlay */}
                <View style={styles.nameOverlay}>
                    <Text style={styles.commonName}>{params.commonName || 'Unknown'}</Text>
                    <Text style={styles.scientificName}>{params.scientificName || 'Unknown'}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Info Cards */}
                <View style={styles.quickInfoRow}>
                    <View style={styles.quickInfoCard}>
                        <Ionicons name="water" size={24} color="#37ec13" />
                        <Text style={styles.quickInfoLabel}>Watering</Text>
                        <Text style={styles.quickInfoValue}>{params.watering || 'Unknown'}</Text>
                    </View>
                    <View style={styles.quickInfoCard}>
                        <Ionicons name="leaf" size={24} color="#37ec13" />
                        <Text style={styles.quickInfoLabel}>Family</Text>
                        <Text style={styles.quickInfoValue}>{params.family || 'Unknown'}</Text>
                    </View>
                    <View style={styles.quickInfoCard}>
                        <Ionicons name="git-branch" size={24} color="#37ec13" />
                        <Text style={styles.quickInfoLabel}>Genus</Text>
                        <Text style={styles.quickInfoValue}>{params.genus || 'Unknown'}</Text>
                    </View>
                </View>

                {/* Description Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>
                        {params.description || 'No description available.'}
                    </Text>
                    {params.wikipediaUrl && (
                        <TouchableOpacity style={styles.wikiButton} onPress={handleOpenWikipedia}>
                            <Ionicons name="open-outline" size={16} color="#37ec13" />
                            <Text style={styles.wikiButtonText}>Read more on Wikipedia</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Taxonomy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Taxonomy</Text>
                    <View style={styles.taxonomyGrid}>
                        <View style={styles.taxonomyItem}>
                            <Text style={styles.taxonomyLabel}>Order</Text>
                            <Text style={styles.taxonomyValue}>{params.order || 'Unknown'}</Text>
                        </View>
                        <View style={styles.taxonomyItem}>
                            <Text style={styles.taxonomyLabel}>Family</Text>
                            <Text style={styles.taxonomyValue}>{params.family || 'Unknown'}</Text>
                        </View>
                        <View style={styles.taxonomyItem}>
                            <Text style={styles.taxonomyLabel}>Genus</Text>
                            <Text style={styles.taxonomyValue}>{params.genus || 'Unknown'}</Text>
                        </View>
                    </View>
                </View>

                {/* Synonyms Section */}
                {synonyms.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Also Known As</Text>
                        <View style={styles.synonymsContainer}>
                            {synonyms.slice(0, 5).map((synonym, index) => (
                                <View key={index} style={styles.synonymChip}>
                                    <Text style={styles.synonymText}>{synonym}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a1a0a',
    },
    heroContainer: {
        height: width * 0.9,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        backgroundColor: '#1a2a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confidenceBadge: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    confidenceText: {
        color: '#37ec13',
        fontSize: 14,
        fontWeight: '600',
    },
    nameOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    commonName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'capitalize',
    },
    scientificName: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        fontStyle: 'italic',
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    quickInfoRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    quickInfoCard: {
        flex: 1,
        backgroundColor: 'rgba(55, 236, 19, 0.1)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(55, 236, 19, 0.2)',
    },
    quickInfoLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
    },
    quickInfoValue: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
    },
    wikiButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    wikiButtonText: {
        color: '#37ec13',
        fontSize: 14,
        fontWeight: '500',
    },
    taxonomyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    taxonomyItem: {
        width: '30%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
    },
    taxonomyLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    taxonomyValue: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        marginTop: 4,
    },
    synonymsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    synonymChip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    synonymText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontStyle: 'italic',
    },
});
