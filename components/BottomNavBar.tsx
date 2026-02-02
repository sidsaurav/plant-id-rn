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
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
            }}
        >
            <Ionicons name={icon} size={24} color={isActive ? '#37ec13' : '#688961'} />
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: isActive ? '#37ec13' : '#688961',
                    marginTop: 4,
                }}
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
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: 'rgba(0, 0, 0, 0.1)',
                paddingBottom: 24,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <NavItem
                    icon={activeTab === 'home' ? 'home' : 'home-outline'}
                    label="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />
                <NavItem
                    icon={activeTab === 'scan' ? 'camera' : 'camera-outline'}
                    label="Scan"
                    isActive={activeTab === 'scan'}
                    onPress={() => onTabPress('scan')}
                />
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
