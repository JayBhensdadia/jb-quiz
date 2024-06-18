import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { db } from '@/db/client';

const RootLayout = () => {


    const { success, error } = useMigrations(db, migrations);
    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }
    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }



    return (
        <Stack initialRouteName='/' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
        </Stack>
    );
};

export default RootLayout;