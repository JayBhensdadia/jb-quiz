import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export function useFontProvider() {
    const [fontsLoaded, fontError] = useFonts({
        'Space-Grotesk': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                console.warn(e);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    return { fontsLoaded, fontError, onLayoutRootView };
}
