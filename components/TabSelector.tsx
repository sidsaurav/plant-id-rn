import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.pillContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => onTabChange(tab)}
                        activeOpacity={0.8}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
    },
    pillContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F2EE',
        borderRadius: 9999,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4A5D54',
    },
    activeTabText: {
        color: '#1B4332',
    },
});
