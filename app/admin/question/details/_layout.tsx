import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const Layout = () => {
    return (
        <Stack initialRouteName='/' screenOptions={{
            headerShown: false
        }} >
            <Stack.Screen name='[id]' />
        </Stack>
    );
};

export default Layout;