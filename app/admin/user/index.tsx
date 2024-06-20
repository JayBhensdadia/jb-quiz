import { Header } from '@/components/ui/Header';
import { db } from '@/db/client';
import { SelectUser, users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';

const UserList = () => {


    const { data } = useLiveQuery(db.select().from(users));
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleCreate = useCallback(async () => {
        console.log('Creating user with:', { name, username, password });
        try {
            await db.insert(users).values({ name, username, password });
            console.log('User created!');
            setShowAddModal(false);
        } catch (error) {
            console.log(error);
            alert('Error in creating new user');
        }
    }, [name, username, password]);

    const renderItem = ({ item }: { item: SelectUser; }) => (
        <Pressable style={{ flex: 1 }} onPress={() => router.push(`/admin/user/details/${item.id}`)}>
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.profilePhoto!, height: 100, width: 100 }} />
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetail}>ID No: {item.id}</Text>
                    <Text style={styles.itemDetail}>{item.username}</Text>
                </View>
                <AntDesign name="right" size={15} color="gray" />
            </View>
        </Pressable>
    );

    return (
        <View style={{ flex: 1, marginTop: 50, marginHorizontal: 10 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Users</Text>
                <CustomButton varient='outline' title='Add User' onPress={() => setShowAddModal(true)} />
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType='slide'
                transparent={true}
                visible={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ display: 'flex', gap: 10 }}>
                            <CustomInput placeholder='Name' value={name} setValue={setName} type='text' />
                            <CustomInput placeholder='Username' value={username} setValue={setUsername} type='text' />
                            <CustomInput placeholder='Password' value={password} setValue={setPassword} type='password' />
                        </View>
                        <View style={styles.modalActions}>
                            <CustomButton varient='outline' title='Cancel' onPress={() => {
                                setShowAddModal(false);
                                setName('');
                                setUsername('');
                                setPassword('');
                            }} />
                            <CustomButton varient='outline' title='Create' onPress={handleCreate} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#015055',
        borderRadius: 20
    },
    itemTextContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    itemName: {
        fontFamily: 'Space-Grotesk-SemiBold',
        color: 'white',
        fontSize: 24
    },
    itemDetail: {
        fontFamily: 'Space-Grotesk',
        opacity: 0.5,
        fontSize: 16,
        color: 'white'
    },
    header: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontFamily: 'Space-Grotesk',
        fontSize: 24,
        marginLeft: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default UserList;
