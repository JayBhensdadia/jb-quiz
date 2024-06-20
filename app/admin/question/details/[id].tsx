import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomSwitch } from '@/components/ui/CustomSwitch';
import { db } from '@/db/client';
import { SelectQuestion, options, questions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const QuestionsDetailsScreen = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [questionText, setQuestionText] = useState('');
    // const [options, setOptions] = useState('');
    // const [correctOption, setCorrectOption] = useState('');

    const [loading, setLoading] = useState(true);

    const [option, setOption] = useState('');
    const [isCorrectOption, setIsCorrectOption] = useState(false);

    const [showAddOptionsModal, setShowAddOptionModal] = useState(false);

    const { id } = useLocalSearchParams();

    if (!id) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(id) ? id[0] : id;

    const { data } = useLiveQuery(db.query.questions.findFirst({ where: (eq(questions.id, parseInt(currentId))) }));

    const optionsList = useLiveQuery(db.query.options.findMany({ where: eq(options.questionId, parseInt(currentId)) }));

    const handleDelete = useCallback(async () => {
        try {
            await db.delete(questions).where(eq(questions.id, parseInt(currentId)));
            setShowDeleteModal(false);
            router.back();
        } catch (error) {
            console.log(error);
            alert('Error in deleting question');
        }
    }, [currentId]);

    const handleUpdate = useCallback(async () => {
        try {

            await db.update(questions).set({ questionText }).where(eq(questions.id, parseInt(currentId)));
            setShowUpdateModal(false);
        } catch (error) {
            console.log(error);
            alert('Error in updating details');
        }
    }, [questionText]);


    const hanldeCreateOption = useCallback(async () => {
        try {

            await db.insert(options).values({ questionId: parseInt(currentId), content: option, isCorrect: isCorrectOption });
            setShowAddOptionModal(false);
            setOption('');
            setIsCorrectOption(false);

        } catch (error) {
            console.log(error);
            alert('error in creating new option');

        }
    }, [option, isCorrectOption]);


    useEffect(() => {
        if (data) {
            setLoading(false);
            setQuestionText(prev => data.questionText);

        }
    }, [data]);

    console.log('admin/question/q.details page loading.......');


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
        <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 24, paddingVertical: 30 }}>Question Details</Text>

                <CustomButton varient='outline' title='Add Options' onPress={() => setShowAddOptionModal(true)} />
            </View>

            {/* <View style={{ display: 'flex', gap: 10 }}>
                <View style={styles.detailRow}>
                    <Text style={styles.titleTop}>ID No</Text>
                    <Text style={styles.detailRowRight}>{data.id}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Question</Text>
                    <Text style={styles.detailRowRight}>{data.questionText}</Text>
                </View>





                <View style={styles.detailRow}>
                    <Text style={styles.titleBottom}>Options</Text>



                </View>
            </View> */}


            <View style={{ flex: 1, borderWidth: 1, padding: 10, margin: 10, borderColor: "gray", borderRadius: 20, }}>

                <View>
                    <Text style={{ fontFamily: 'Space-Grotesk' }}>Question: {data.id}</Text>
                    <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 30 }}>{data.questionText}</Text>
                </View>


                {/* options */}
                <View style={{ display: 'flex', gap: 10, marginVertical: 30 }}>

                    {/* <Text>{JSON.stringify(optionsList.data)}</Text> */}

                    {optionsList.data.map((option) => {
                        return <View key={option.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderRadius: 20, borderColor: 'gray' }}>



                            <Text style={[{ fontFamily: 'Space-Grotesk', fontSize: 16 }, option.isCorrect && { color: 'green', fontFamily: 'Space-Grotesk-Bold' }]}>{option.content}</Text>

                            <Pressable onPress={async () => {
                                try {

                                    await db.delete(options).where(eq(options.id, option.id));
                                    console.log('option deleted!');


                                } catch (error) {
                                    console.log(error);
                                    alert('error in deleting optoin');

                                }
                            }} >


                                <MaterialCommunityIcons name="delete" size={20} color="red" />

                            </Pressable>
                        </View>;
                    })}
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-evenly', paddingVertical: 50 }}>
                <CustomButton title='Edit' onPress={() => { setShowUpdateModal(true); }} varient='outline' />
                <CustomButton title='Delete' onPress={() => {
                    setShowDeleteModal(true);
                }} varient='outline' />
            </View>

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
                        <CustomInput type='text' placeholder='Question' value={questionText} setValue={setQuestionText} />
                        {/* <CustomInput type='text' placeholder='Options (comma separated)' value={options} setValue={setOptions} />
                        <CustomInput type='text' placeholder='Correct Option' value={correctOption} setValue={setCorrectOption} /> */}
                        <CustomButton title='Cancel' varient='outline' onPress={() => setShowUpdateModal(false)} />
                        <CustomButton title='Update' varient='outline' onPress={handleUpdate} />
                    </View>
                </View>
            </Modal>



            <Modal
                animationType='slide'
                transparent={true}
                visible={showAddOptionsModal}
                onRequestClose={() => setShowAddOptionModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontFamily: "Space-Grotesk", fontSize: 20, paddingVertical: 20 }}>Add Option</Text>

                        <CustomInput type='text' placeholder='Content' value={option} setValue={setOption} />


                        <CustomSwitch title='is Correct ?' value={isCorrectOption} setValue={setIsCorrectOption} />


                        <CustomButton title='Cancel' varient='outline' onPress={() => setShowAddOptionModal(false)} />
                        <CustomButton title='Add' varient='outline' onPress={hanldeCreateOption} />
                    </View>
                </View>
            </Modal>
        </View>
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

export default QuestionsDetailsScreen;
