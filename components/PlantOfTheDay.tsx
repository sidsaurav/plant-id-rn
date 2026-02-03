import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PlantOfTheDayProps {
    name: string;
    nickname: string;
    imageUrl: string;
    onLearnMore?: () => void;
}

export function PlantOfTheDay({ name, nickname, imageUrl, onLearnMore }: PlantOfTheDayProps) {
    return (
        <View className="flex flex-col items-stretch justify-start rounded-2xl bg-white overflow-hidden shadow-xl border-2 border-primary/20">
            {/* Image with Gradient Overlay */}
            <View className="relative">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full aspect-video"
                    resizeMode="cover"
                />
                {/* Gradient overlay for depth */}
                <LinearGradient
                    colors={['transparent', 'rgba(27, 67, 50, 0.6)']}
                    className="absolute bottom-0 left-0 right-0 h-1/2"
                />
                {/* Badge on image */}
                <View className="absolute top-3 left-3 flex-row items-center gap-1.5 bg-primary px-3 py-1.5 rounded-full shadow-md">
                    <Ionicons name="sparkles" size={14} color="#FFD700" />
                    <Text className="text-white text-xs font-bold uppercase tracking-wide">
                        Plant of the Day
                    </Text>
                </View>
            </View>

            {/* Content Section */}
            <View className="flex w-full flex-col items-stretch justify-center gap-2 p-5 bg-gradient-to-b from-white to-earthy-sage/30">
                <Text className="text-brand-green text-2xl font-bold leading-tight tracking-tight">
                    {name}
                </Text>
                <View className="flex flex-row items-end gap-3 justify-between">
                    <View className="flex flex-col flex-1">
                        <Text className="text-text-secondary text-sm font-medium italic">"{nickname}"</Text>
                    </View>
                    <Pressable
                        onPress={onLearnMore}
                        className="flex flex-row min-w-[110px] items-center justify-center gap-1.5 rounded-full h-10 px-5 bg-primary active:opacity-90 shadow-md"
                    >
                        <Text className="text-white text-sm font-bold">Learn More</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
