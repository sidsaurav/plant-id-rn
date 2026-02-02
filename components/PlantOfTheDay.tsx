import { View, Text, Image, Pressable } from 'react-native';

interface PlantOfTheDayProps {
    name: string;
    nickname: string;
    imageUrl: string;
    onLearnMore?: () => void;
}

export function PlantOfTheDay({ name, nickname, imageUrl, onLearnMore }: PlantOfTheDayProps) {
    return (
        <View className="flex flex-col items-stretch justify-start rounded-xl bg-surface-light overflow-hidden shadow-lg">
            <Image
                source={{ uri: imageUrl }}
                className="w-full aspect-video"
                resizeMode="cover"
            />
            <View className="flex w-full flex-col items-stretch justify-center gap-1 p-5">
                <Text className="text-primary text-xs font-bold leading-normal tracking-wider uppercase">
                    Plant of the Day
                </Text>
                <Text className="text-text-primary text-xl font-bold leading-tight tracking-tight">
                    {name}
                </Text>
                <View className="flex flex-row items-end gap-3 justify-between mt-1">
                    <View className="flex flex-col flex-1">
                        <Text className="text-text-secondary text-sm font-normal italic">"{nickname}"</Text>
                    </View>
                    <Pressable
                        onPress={onLearnMore}
                        className="flex min-w-[100px] items-center justify-center rounded-lg h-9 px-4 bg-primary active:opacity-80"
                    >
                        <Text className="text-text-primary text-sm font-bold">Learn More</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
