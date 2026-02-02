import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    userName: string;
    avatarUrl: string;
    onBadgePress?: () => void;
    onSettingsPress?: () => void;
}

export function Header({ userName, avatarUrl, onBadgePress, onSettingsPress }: HeaderProps) {
    return (
        <View className="flex flex-row items-center p-4 pb-2 justify-between bg-background-light">
            <View className="flex flex-row items-center gap-3">
                <View className="size-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary">
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <Text className="text-text-primary text-lg font-bold leading-tight tracking-tight">
                    Good Morning, {userName} 🌿
                </Text>
            </View>
            <View className="flex flex-row gap-2">
                <Pressable
                    onPress={onBadgePress}
                    className="flex size-10 items-center justify-center rounded-full bg-surface-light shadow-sm active:opacity-70"
                >
                    <Ionicons name="trophy-outline" size={20} color="#688961" />
                </Pressable>
                <Pressable
                    onPress={onSettingsPress}
                    className="flex size-10 items-center justify-center rounded-full bg-surface-light shadow-sm active:opacity-70"
                >
                    <Ionicons name="settings-outline" size={20} color="#688961" />
                </Pressable>
            </View>
        </View>
    );
}
