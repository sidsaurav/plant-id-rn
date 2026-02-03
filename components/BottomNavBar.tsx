import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isActive?: boolean;
    onPress?: () => void;
}

function NavItem({ icon, label, isActive, onPress }: NavItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2"
        >
            <Ionicons name={icon} size={24} color={isActive ? '#2D6A4F' : '#4A5D54'} />
            <Text
                className={`text-[10px] font-bold uppercase mt-1 ${isActive ? 'text-primary' : 'text-text-secondary'
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

interface BottomNavBarProps {
    activeTab: 'home' | 'scan' | 'explore';
    onTabPress: (tab: 'home' | 'scan' | 'explore') => void;
}

export function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-background-light/90 border-t border-black/5 px-8 py-4">
            <View className="flex-row items-center justify-between">
                {/* Home */}
                <NavItem
                    icon={activeTab === 'home' ? 'home' : 'home-outline'}
                    label="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />

                {/* Scan - Elevated button */}
                <View className="items-center -mt-8">
                    <TouchableOpacity
                        onPress={() => onTabPress('scan')}
                        activeOpacity={0.95}
                        className="w-14 h-14 bg-brand-green rounded-full items-center justify-center shadow-lg border-4 border-background-light"
                    >
                        <Ionicons name="camera" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text className="text-[10px] font-bold text-text-secondary mt-1 uppercase">
                        Scan
                    </Text>
                </View>

                {/* Explore */}
                <NavItem
                    icon={activeTab === 'explore' ? 'compass' : 'compass-outline'}
                    label="Explore"
                    isActive={activeTab === 'explore'}
                    onPress={() => onTabPress('explore')}
                />
            </View>

            {/* Home indicator bar */}
            <View className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-green/20 rounded-full" />
        </View>
    );
}
