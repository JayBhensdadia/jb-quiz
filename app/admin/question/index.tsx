import { db } from '@/db/client';
import { SelectQuestion, questions } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';



const QuestionsList = () => {
    const { data } = useLiveQuery(db.select().from(questions));
    const [showAddModal, setShowAddModal] = useState(false);
    const [questionText, setQuestionText] = useState('');


    const handleCreate = useCallback(async () => {
        console.log('Creating question with:', { questionText });
        try {

            await db.insert(questions).values({ questionText });
            console.log('Question created!');
            setShowAddModal(false);
            setQuestionText('');

        } catch (error) {
            console.log(error);
            alert('Error in creating new question');
        }
    }, [questionText]);

    const renderItem = ({ item }: { item: SelectQuestion; }) => (
        <Pressable style={{ flex: 1 }} onPress={() => router.push(`/admin/question/details/${item.id}`)}>
            <View style={styles.itemContainer}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{item.questionText}</Text>
                    <Text style={styles.itemDetail}>ID No: {item.id}</Text>
                    {/* <Text style={styles.itemDetail}>Options: {item.options}</Text>
                    <Text style={styles.itemDetail}>Correct Option: {item.correctOption}</Text> */}
                </View>
                <AntDesign name="right" size={15} color="gray" />
            </View>
        </Pressable>
    );

    return (
        <View style={{ flex: 1, marginTop: 50 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Questions</Text>
                <CustomButton varient='outline' title='Add Question' onPress={() => setShowAddModal(true)} />
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
                            <CustomInput placeholder='Question Text' value={questionText} setValue={setQuestionText} type='text' />

                        </View>
                        <View style={styles.modalActions}>
                            <CustomButton varient='outline' title='Cancel' onPress={() => {
                                setShowAddModal(false);
                                setQuestionText('');

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
        paddingVertical: 20,
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
        fontSize: 20
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

export default QuestionsList;
