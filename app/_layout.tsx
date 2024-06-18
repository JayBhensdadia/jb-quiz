import { SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { db } from '@/db/client';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const { success, error } = useMigrations(db, migrations);

    const [fontsLoaded, fontError] = useFonts({
        'Space-Grotesk': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
        'Space-Grotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
        'Space-Grotesk-Light': require('../assets/fonts/SpaceGrotesk-Light.ttf'),
        'Space-Grotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
        'Space-Grotesk-SemiBold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
    });

    const [isReady, setIsReady] = useState(false);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
            setIsReady(true);
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (success && (fontsLoaded || fontError)) {
            setIsReady(true);
            SplashScreen.hideAsync();
        }
    }, [success, fontsLoaded, fontError]);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }

    if (!success) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }

    if (!isReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Stack initialRouteName='/' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='index' />
            </Stack>
        </View>
    );
};

export default RootLayout;
