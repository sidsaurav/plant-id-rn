import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';

interface PlantCardProps {
    /** Plant display name */
    name: string;
    /** Plant image URL or local URI */
    imageUrl: string;
    /** Date string to display (e.g., "Watered Feb 03") */
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
        <Pressable
            onPress={onPress}
            className="bg-card-accent p-3 rounded-2xl border border-white/60 shadow-sm active:scale-[0.98]"
        >
            {/* Image container */}
            <View className="relative aspect-square rounded-xl overflow-hidden mb-3">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Heart button */}
                <Pressable
                    onPress={handleFavoritePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 items-center justify-center shadow-sm"
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={16}
                        color={isFavorite ? '#f43f5e' : '#4A5D54'}
                    />
                </Pressable>
            </View>
            {/* Info */}
            <Text className="font-bold text-sm text-text-main" numberOfLines={1}>
                {name}
            </Text>
            <Text className="text-[10px] text-text-secondary font-bold uppercase tracking-tight mt-0.5">
                Watered {date}
            </Text>
        </Pressable>
    );
});
