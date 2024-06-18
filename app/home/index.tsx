import React from 'react';
import { Button, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                HomeScreen
                <Button title="logout" onPress={async () => {
                    await SecureStore.deleteItemAsync('token');
                    router.replace('/');
                }} />
            </Text>
        </View>
    );
};

export default HomeScreen;