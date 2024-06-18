import { db } from '@/db/client';
import { SelectQuestion, SelectUser, users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const UserList = () => {

    const { data } = useLiveQuery(db.select().from(users));


    const renderItem = ({ item }: { item: SelectUser; }) => (
        <View >
            <Text>{item.id}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />

        </View>
    );
};

export default UserList;