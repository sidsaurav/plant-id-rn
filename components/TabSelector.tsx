import { View, Text, Pressable } from 'react-native';

interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
    return (
        <View className="flex flex-row border-b border-border-light gap-8 px-4">
            {tabs.map((tab) => (
                <Pressable
                    key={tab}
                    onPress={() => onTabChange(tab)}
                    className={`flex flex-col items-center justify-center pb-3 pt-2 border-b-[3px] ${activeTab === tab ? 'border-b-primary' : 'border-b-transparent'
                        }`}
                >
                    <Text
                        className={`text-sm font-bold leading-normal tracking-wide ${activeTab === tab ? 'text-text-primary' : 'text-text-secondary'
                            }`}
                    >
                        {tab}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
