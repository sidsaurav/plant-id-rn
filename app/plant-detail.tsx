import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Linking, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PlantDetail() {

    const params = useLocalSearchParams<{
        scientificName: string;
        commonNames: string;
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
        edibleParts: string;
        propagationMethods: string;
    }>();

    const probability = parseFloat(params.probability || '0');
    const confidencePercent = Math.round(probability * 100);
    const commonNames = params.commonNames ? params.commonNames.split(',').filter(Boolean) : [];
    const synonyms = params.synonyms ? params.synonyms.split(',').filter(Boolean) : [];
    const edibleParts = params.edibleParts ? params.edibleParts.split(',').filter(Boolean) : [];
    const propagationMethods = params.propagationMethods ? params.propagationMethods.split(',').filter(Boolean) : [];

    // Display name is the first common name, or scientific name if no common names
    const displayName = commonNames[0] || params.scientificName || 'Unknown';
    // "Also known as" shows remaining common names (skip the first one used as display name)
    const alsoKnownAs = commonNames.slice(1);

    const handleOpenWikipedia = () => {
        if (params.wikipediaUrl) {
            Linking.openURL(params.wikipediaUrl);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this plant I found: ${displayName} (${params.scientificName})`,
                url: params.wikipediaUrl || '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const displayImage = params.capturedImageUri || params.imageUrl;

    // Format propagation methods for display
    const formatPropagationMethod = (method: string) => {
        return method.charAt(0).toUpperCase() + method.slice(1);
    };

    // Format edible parts for display
    const formatEdiblePart = (part: string) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
    };

    return (
        <View className="flex-1 bg-background-light">
            <StatusBar style="light" />

            {/* Hero Image Container */}
            <View className="relative w-full" style={{ height: width * 0.9 }}>
                {displayImage ? (
                    <Image
                        source={{ uri: displayImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full bg-surface-dark items-center justify-center">
                        <Ionicons name="leaf" size={80} color="rgba(45, 106, 79, 0.3)" />
                    </View>
                )}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    className="absolute bottom-0 left-0 right-0 h-1/2"
                />

                {/* Back Button */}
                <TouchableOpacity
                    className="absolute top-12 left-5 w-11 h-11 rounded-full bg-black/30 items-center justify-center backdrop-blur-md"
                    onPress={handleGoBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Share Button (Optional addition) */}
                <TouchableOpacity
                    className="absolute top-12 right-5 w-11 h-11 rounded-full bg-black/30 items-center justify-center backdrop-blur-md"
                    onPress={handleShare}
                >
                    <Ionicons name="share-outline" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Confidence Badge */}
                <View className="absolute bottom-24 right-5 flex-row items-center bg-black/40 px-3 py-1.5 rounded-full gap-1.5 backdrop-blur-sm">
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                    <Text className="text-white text-sm font-semibold">{confidencePercent}% Match</Text>
                </View>

                {/* Plant Name Overlay */}
                <View className="absolute bottom-5 left-5 right-5">
                    <Text className="text-3xl font-bold text-white capitalize shadow-sm">{displayName}</Text>
                    <Text className="text-lg text-white/80 italic mt-1 font-medium">{params.scientificName || 'Unknown'}</Text>
                </View>
            </View>

            {/* Content ScrollView */}
            <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Quick Info Cards */}
                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm border border-border-light">
                        <Ionicons name="water-outline" size={24} color="#2D6A4F" />
                        <Text className="text-xs text-text-secondary mt-2 font-medium">Watering</Text>
                        <Text className="text-sm text-text-main font-bold mt-1 text-center capitalize">{params.watering || 'Unknown'}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm border border-border-light">
                        <Ionicons name="leaf-outline" size={24} color="#2D6A4F" />
                        <Text className="text-xs text-text-secondary mt-2 font-medium">Family</Text>
                        <Text className="text-sm text-text-main font-bold mt-1 text-center" numberOfLines={1}>{params.family || 'Unknown'}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-2xl items-center shadow-sm border border-border-light">
                        <Ionicons name="git-branch-outline" size={24} color="#2D6A4F" />
                        <Text className="text-xs text-text-secondary mt-2 font-medium">Genus</Text>
                        <Text className="text-sm text-text-main font-bold mt-1 text-center" numberOfLines={1}>{params.genus || 'Unknown'}</Text>
                    </View>
                </View>

                {/* Description Section */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-text-main mb-3">About</Text>
                    <Text className="text-base text-text-secondary leading-6">
                        {params.description.slice(0, 400) + '...' || 'No description available.'}
                    </Text>
                    {params.wikipediaUrl && (
                        <TouchableOpacity className="flex-row items-center mt-3 gap-1.5" onPress={handleOpenWikipedia}>
                            <Text className="text-primary text-sm font-semibold">Read more on Wikipedia</Text>
                            <Ionicons name="arrow-forward" size={14} color="#2D6A4F" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Also Known As Section (Common Names) */}
                {alsoKnownAs.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-xl font-bold text-text-main mb-3">Also Known As</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {alsoKnownAs.slice(0, 6).map((name, index) => (
                                <View key={index} className="bg-white px-3 py-2 rounded-xl border border-border-light shadow-sm">
                                    <Text className="text-text-secondary text-sm">{name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Edible Parts Section */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-text-main mb-3">Edible Parts</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {edibleParts.length > 0 ? (
                            edibleParts.map((part, index) => (
                                <View key={index} className="bg-green-50 px-3 py-2 rounded-xl border border-green-100 flex-row items-center gap-1.5">
                                    <Ionicons name="restaurant-outline" size={14} color="#2D6A4F" />
                                    <Text className="text-primary text-sm font-medium">{formatEdiblePart(part)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text className="text-text-secondary italic">Not Known</Text>
                        )}
                    </View>
                </View>

                {/* Propagation Methods Section */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-text-main mb-3">Propagation Methods</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {propagationMethods.length > 0 ? (
                            propagationMethods.map((method, index) => (
                                <View key={index} className="bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 flex-row items-center gap-1.5">
                                    <Ionicons name="cut-outline" size={14} color="#2563EB" />
                                    <Text className="text-blue-600 text-sm font-medium">{formatPropagationMethod(method)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text className="text-text-secondary italic">Not Known</Text>
                        )}
                    </View>
                </View>

                {/* Taxonomy Section */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-text-main mb-3">Taxonomy</Text>
                    <View className="flex-row flex-wrap gap-3">
                        <View className="w-[30%] bg-surface-light p-3 rounded-xl border border-border-light">
                            <Text className="text-xs text-text-secondary uppercase tracking-wider mb-1">Order</Text>
                            <Text className="text-sm text-text-main font-medium">{params.order || 'Unknown'}</Text>
                        </View>
                        <View className="w-[30%] bg-surface-light p-3 rounded-xl border border-border-light">
                            <Text className="text-xs text-text-secondary uppercase tracking-wider mb-1">Family</Text>
                            <Text className="text-sm text-text-main font-medium">{params.family || 'Unknown'}</Text>
                        </View>
                        <View className="w-[30%] bg-surface-light p-3 rounded-xl border border-border-light">
                            <Text className="text-xs text-text-secondary uppercase tracking-wider mb-1">Genus</Text>
                            <Text className="text-sm text-text-main font-medium">{params.genus || 'Unknown'}</Text>
                        </View>
                    </View>
                </View>

                {/* Scientific Synonyms Section */}
                {synonyms.length > 0 && (
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-text-main mb-3">Scientific Synonyms</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {synonyms.slice(0, 5).map((synonym, index) => (
                                <View key={index} className="bg-surface-light px-3 py-1.5 rounded-lg border border-border-light">
                                    <Text className="text-text-secondary text-sm italic">{synonym}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
