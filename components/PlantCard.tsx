import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';

interface PlantCardProps {
    /** Plant display name */
    name: string;
    /** Plant image URL or local URI */
    imageUrl: string;
    /** Date string to display (e.g., "Oct 12" or "Feb 03") */
    date: string;
    /** Whether this plant is in the user's favorites/collection */
    isFavorite?: boolean;
    /** Callback when the card is pressed */
    onPress?: () => void;
    /** Callback when the favorite heart is toggled */
    onFavoriteToggle?: () => void;
}

/**
 * Plant card component with image, name, date, and favorite toggle
 * Memoized for list performance per React Native best practices
 */
export const PlantCard = memo(function PlantCard({
    name,
    imageUrl,
    date,
    isFavorite = false,
    onPress,
    onFavoriteToggle,
}: PlantCardProps) {
    const handleFavoritePress = useCallback(() => {
        onFavoriteToggle?.();
    }, [onFavoriteToggle]);

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Heart icon at top right */}
                <Pressable
                    onPress={handleFavoritePress}
                    style={styles.heartButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFavorite ? '#ef4444' : '#ffffff'}
                    />
                </Pressable>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 8,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#ffffff',
        padding: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        paddingHorizontal: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#121811',
        lineHeight: 18,
    },
    date: {
        fontSize: 12,
        color: '#688961',
        marginTop: 2,
    },
});
