import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { db } from '@/db/client';
import { SelectUser, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const UserDetailsScreen = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');


    const [loading, setLoading] = useState(true);

    const { id } = useLocalSearchParams();



    console.log(id);

    if (!id) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(id) ? id[0] : id;



    const { data } = useLiveQuery(db.query.users.findFirst({ where: (eq(users.id, parseInt(currentId))) }));


    const handleDelete = useCallback(async () => {
        try {
            await db.delete(users).where(eq(users.id, parseInt(currentId)));
            setShowDeleteModal(false);
            router.back();
        } catch (error) {
            console.log(error);
            alert('error in deleting user');

        }
    }, [currentId]);


    const handleUpdate = useCallback(async () => {
        try {
            await db.update(users).set({ name, username, password, profilePhoto }).where(eq(users.id, parseInt(currentId)));
            setShowUpdateModal(false);
        } catch (error) {
            console.log(error);
            alert('error in updating details');
        }
    }, [name, username, password, profilePhoto]);






    useEffect(() => {
        if (data) {
            setLoading(false);
            setName(prev => data.name!);
            setUsername(prev => data.username);
            setPassword(prev => data.password);
            setProfilePhoto(prev => data.profilePhoto!);
            // loadDataIntoModal();
        }
    }, [data]);



    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading.....</Text>
        </View>;
    }


    if (!data) {
        return <View>
            <Text>data not found</Text>
        </View>;
    }






    return (
        <ScrollView style={{ flex: 1, marginTop: 50, padding: 10, marginHorizontal: 10 }}>

            <View >
                <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 24 }}>User Details</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Image source={{ uri: data.profilePhoto!, height: 300, width: 300 }} />
            </View>


            <View style={{ display: 'flex', gap: 10 }}>
                <View style={styles.detailRow}>
                    <Text style={styles.titleTop}>id No</Text>
                    <Text style={styles.detailRowRight}>{data.id}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle} >Name</Text>
                    <Text style={styles.detailRowRight}>{data.name}</Text>

                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Email</Text>
                    <Text style={styles.detailRowRight}>{data.username}</Text>


                </View>


                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Password</Text>

                    <Text style={styles.detailRowRight}>{data.password}</Text>


                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleBottom}>Created At</Text>

                    <Text style={styles.detailRowRight}>{data.createdAt}</Text>


                </View>




                {/* <Text>{data.createdAt}</Text> */}
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-evenly', paddingVertical: 50 }}>
                <CustomButton title='Edit' onPress={() => { setShowUpdateModal(true); }} varient='outline' />
                <CustomButton title='Delete' onPress={() => {
                    setShowDeleteModal(true);
                }} varient='outline' />
            </View>

            <CustomButton title='Show Report' onPress={() => {


                router.push(`/admin/user/report/${currentId}`);

            }} varient='outline' />

            {/* <Modal
                animationType='slide'
                transparent={true}
                visible={showUpdateModal}
                onRequestClose={() => setShowUpdateModal(false)}>


            </Modal> */}


            <Modal
                animationType='slide'
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}>


                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontFamily: "Space-Grotesk", fontSize: 20, paddingVertical: 20 }}>Are you sure?</Text>



                        <CustomButton title='Cancel' varient='outline' onPress={() => { setShowDeleteModal(false); }} />
                        <CustomButton title='Delete' varient='outline' onPress={handleDelete} />




                    </View>
                </View>

            </Modal>


            <Modal
                animationType='slide'
                transparent={true}
                visible={showUpdateModal}

                onRequestClose={() => setShowUpdateModal(false)}>


                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontFamily: "Space-Grotesk", fontSize: 20, paddingVertical: 20 }}>Update Details</Text>

                        <CustomInput type='text' placeholder='name' value={name} setValue={setName} />
                        <CustomInput type='text' placeholder='email' value={username} setValue={setUsername} />
                        <CustomInput type='password' placeholder='password' value={password} setValue={setPassword} />
                        <CustomInput type='text' placeholder='Photo url' value={profilePhoto} setValue={setProfilePhoto} />

                        <CustomButton title='Cancel' varient='outline' onPress={() => setShowUpdateModal(false)} />
                        <CustomButton title='Update' varient='outline' onPress={handleUpdate} />



                    </View>
                </View>

            </Modal>




        </ScrollView>
    );
};


const styles = StyleSheet.create({

    detailRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 30, gap: 20, alignItems: "center" },

    detailRowRight: {
        flex: 1,
        fontFamily: 'Space-Grotesk',
        fontSize: 20,
    },

    titleTop: {
        backgroundColor: '#015055', paddingHorizontal: 20, paddingVertical: 10, color: 'white', fontFamily: 'Space-Grotesk', borderTopLeftRadius: 20, width: 120
    },

    titleMiddle: {
        backgroundColor: '#015055', paddingHorizontal: 20, paddingVertical: 10, color: 'white', fontFamily: 'Space-Grotesk', width: 120
    },
    titleBottom: {
        backgroundColor: '#015055', paddingHorizontal: 20, paddingVertical: 10, color: 'white', fontFamily: 'Space-Grotesk', borderBottomLeftRadius: 20, width: 120
    },


    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    btnText: {
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },

});

export default UserDetailsScreen;