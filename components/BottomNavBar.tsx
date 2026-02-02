import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isActive?: boolean;
    onPress?: () => void;
}

function NavItem({ icon, label, isActive, onPress }: NavItemProps) {
    return (
        <Pressable onPress={onPress} className="flex flex-col items-center gap-1 pb-1">
            <Ionicons name={icon} size={24} color={isActive ? '#37ec13' : '#688961'} />
            <Text
                className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-text-secondary'
                    }`}
            >
                {label}
            </Text>
        </Pressable>
    );
}

interface BottomNavBarProps {
    activeTab: 'home' | 'scan' | 'explore';
    onTabPress: (tab: 'home' | 'scan' | 'explore') => void;
}

export function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-light/95 border-t border-border-light/50 h-24 pb-8">
            <View className="flex flex-row justify-around items-end h-full px-4">
                <NavItem
                    icon={activeTab === 'home' ? 'home' : 'home-outline'}
                    label="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />
                <View className="relative -top-3">
                    <Pressable
                        onPress={() => onTabPress('scan')}
                        className="flex flex-col items-center gap-1"
                    >
                        <View className="size-16 rounded-full bg-primary flex items-center justify-center shadow-lg border-4 border-surface-light active:scale-95">
                            <Ionicons name="camera" size={28} color="#ffffff" />
                        </View>
                        <Text className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mt-0.5">
                            Scan
                        </Text>
                    </Pressable>
                </View>
                <NavItem
                    icon={activeTab === 'explore' ? 'compass' : 'compass-outline'}
                    label="Explore"
                    isActive={activeTab === 'explore'}
                    onPress={() => onTabPress('explore')}
                />
            </View>
        </View>
    );
}
