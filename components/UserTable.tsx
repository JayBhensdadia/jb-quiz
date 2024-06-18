import { db } from '@/db/client';
import { users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CustomButton } from './ui/CustomButton';
import { router } from 'expo-router';

const UserTable = ({ varient }: { varient: 'full' | 'mini'; }) => {



    const { data } = varient === 'mini' ? useLiveQuery(db.select().from(users).limit(5)) : useLiveQuery(db.select().from(users));

    return (
        <View style={{ marginHorizontal: 20 }}>
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 20, paddingBottom: 10 }}>List of Users</Text>
                <Pressable onPress={() => {
                    router.push("/admin/user");
                }}>
                    <Text style={{ fontFamily: 'Space-Grotesk-Bold', backgroundColor: '#E1F396', paddingHorizontal: 10, borderRadius: 20, paddingVertical: 5 }}>show all</Text>
                </Pressable>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: "#015055", paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ color: 'white', fontFamily: 'Space-Grotesk-SemiBold' }}>id</Text>
                <Text style={{ color: 'white', fontFamily: 'Space-Grotesk-SemiBold' }}>username</Text>
                <Text style={{ color: 'white', fontFamily: 'Space-Grotesk-SemiBold' }}>password</Text>

            </View>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
                {data.map((user) => {
                    return <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', borderBottomWidth: 1, paddingVertical: 5 }} key={user.id}>
                        <Text>{user.id}</Text>
                        <Text>{user.username}</Text>
                        <Text>{user.password}</Text>
                    </View>;
                })}
            </View>
        </View>
    );
};

export default UserTable;