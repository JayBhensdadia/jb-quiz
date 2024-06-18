import React from 'react';
import { Button, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { CustomButton } from '@/components/ui/CustomButton';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

const AdminScreen = () => {

    const { data } = useLiveQuery(db.select().from(users));

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', gap: 10 }}>
            <Text>
                AdminScreen

            </Text>
            <Text>
                {JSON.stringify(data)}

            </Text>

            <CustomButton title='create user' varient='default' onPress={async () => {
                try {
                    await db.insert(users).values({ username: 'user2@gmail.com', password: 'user2' });
                    console.log('user created..!!!');

                } catch (error) {
                    console.log(error);

                    alert('error in creating user');
                }
            }} />

            <Button title="logout" onPress={async () => {
                await SecureStore.deleteItemAsync('token');
                router.replace('/');
            }} />
        </View>
    );
};

export default AdminScreen;