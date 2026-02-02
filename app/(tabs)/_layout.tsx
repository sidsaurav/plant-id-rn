import { Tabs } from 'expo-router';
import { router } from 'expo-router';
import { BottomNavBar } from '../../components/BottomNavBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function CustomTabBar({ state }: BottomTabBarProps) {
    const routeNames = state.routes.map(route => route.name);
    const currentRoute = state.routes[state.index].name;

    const getActiveTab = (): 'home' | 'scan' | 'explore' => {
        if (currentRoute === 'index') return 'home';
        if (currentRoute === 'scan') return 'scan';
        if (currentRoute === 'explore') return 'explore';
        return 'home';
    };

    const handleTabPress = (tab: 'home' | 'scan' | 'explore') => {
        console.log("==> " + tab)
        switch (tab) {
            case 'home':
                router.push('/');
                break;
            case 'scan':
                router.push('/scan');
                break;
            case 'explore':
                router.push('/explore');
                break;
        }
    };

    return (
        <BottomNavBar
            activeTab={getActiveTab()}
            onTabPress={handleTabPress}
        />
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="scan" />
            <Tabs.Screen name="explore" />
        </Tabs>
    );
}
