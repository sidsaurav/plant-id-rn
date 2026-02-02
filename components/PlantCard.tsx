import { View, Text, Image, Pressable } from 'react-native';

interface PlantCardProps {
    name: string;
    location: string;
    status: string;
    imageUrl: string;
    date: string;
    onPress?: () => void;
}

export function PlantCard({ name, location, status, imageUrl, date, onPress }: PlantCardProps) {
    return (
        <Pressable onPress={onPress} className="flex flex-col gap-2">
            <View className="relative w-full aspect-square bg-surface-light p-1 rounded-xl shadow-sm">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                />
                <View className="absolute top-2 right-2 bg-primary/90 px-2 py-0.5 rounded-full">
                    <Text className="text-text-primary text-[10px] font-bold">{date}</Text>
                </View>
            </View>
            <View className="px-1">
                <Text className="text-text-primary text-sm font-bold leading-tight">{name}</Text>
                <Text className="text-text-secondary text-xs font-normal">
                    {location} • {status}
                </Text>
            </View>
        </Pressable>
    );
}
