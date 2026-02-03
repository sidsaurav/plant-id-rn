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
        <View className="flex-row items-center px-6 py-4 justify-between bg-background-light">
            <View className="flex-row items-center gap-3">
                {/* Avatar with online indicator */}
                <View className="relative">
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-12 h-12 rounded-full border-2 border-primary"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-background-light rounded-full" />
                </View>
                {/* Two-line greeting */}
                <View>
                    <Text className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                        Good Morning,
                    </Text>
                    <Text className="text-xl font-bold text-text-main">
                        {userName} 🌿
                    </Text>
                </View>
            </View>
            {/* Icon buttons */}
            <View className="flex-row gap-2">
                <Pressable
                    onPress={onBadgePress}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white/50 border border-black/5 active:opacity-70"
                >
                    <Ionicons name="notifications-outline" size={20} color="#1B4332" />
                </Pressable>
                <Pressable
                    onPress={onSettingsPress}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white/50 border border-black/5 active:opacity-70"
                >
                    <Ionicons name="settings-outline" size={20} color="#1B4332" />
                </Pressable>
            </View>
        </View>
    );
}
