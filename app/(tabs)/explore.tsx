import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Explore() {
    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={['top']}>
            <StatusBar style="dark" />
            <View className="flex-1 items-center justify-center p-8">
                <View className="bg-surface-light rounded-2xl p-8 items-center shadow-lg">
                    <View className="size-20 rounded-full bg-primary/20 items-center justify-center mb-4">
                        <Ionicons name="compass" size={40} color="#37ec13" />
                    </View>
                    <Text className="text-text-primary text-xl font-bold mb-2">Explore Plants</Text>
                    <Text className="text-text-secondary text-center text-sm">
                        This feature is not yet implemented.{'\n'}
                        Discover new plants and learn about them!
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
