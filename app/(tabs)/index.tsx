import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Header } from '@/components/Header';
import { PlantOfTheDay } from '@/components/PlantOfTheDay';
import { TabSelector } from '@/components/TabSelector';
import { PlantCard } from '@/components/PlantCard';

import mockData from '@/data/mock.json';

const PLANTS_DATA = mockData.plants;
const PLANT_OF_THE_DAY = mockData.plantOfTheDay;
const USER_AVATAR = mockData.userAvatar;

export default function Home() {
    const [activeContentTab, setActiveContentTab] = useState('Collection');

    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={['top']}>
            <StatusBar style="auto" />

            <Header
                userName="Alex"
                avatarUrl={USER_AVATAR}
                onBadgePress={() => { }}
                onSettingsPress={() => { }}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Plant of the Day */}
                <View className="p-4">
                    <PlantOfTheDay
                        name={PLANT_OF_THE_DAY.name}
                        nickname={PLANT_OF_THE_DAY.nickname}
                        imageUrl={PLANT_OF_THE_DAY.imageUrl}
                        onLearnMore={() => { }}
                    />
                </View>

                {/* Tab Selector */}
                <View className="mt-2">
                    <TabSelector
                        tabs={['Collection', 'History']}
                        activeTab={activeContentTab}
                        onTabChange={setActiveContentTab}
                    />
                </View>

                {/* Plant Collection Grid */}
                <View className="flex flex-row flex-wrap p-4 gap-4 mt-2">
                    {PLANTS_DATA.map((plant) => (
                        <View key={plant.id} style={{ width: '47%' }}>
                            <PlantCard
                                name={plant.name}
                                location={plant.location}
                                status={plant.status}
                                imageUrl={plant.imageUrl}
                                date={plant.date}
                                onPress={() => { }}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
