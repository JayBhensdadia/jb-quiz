import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { db } from '@/db/client';
import { SelectQuestion, questions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

// Function to format options
const formatOptions = (optionsString: string) => {
    const optionsArray = optionsString.split(',').map(option => option.trim());
    const optionsObject: any = {};
    optionsArray.forEach((option, index) => {
        const key = String.fromCharCode(65 + index); // Convert index to letter A, B, C, etc.
        optionsObject[key] = option;
    });
    return JSON.stringify(optionsObject);
};

const QuestionsDetailsScreen = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState('');
    const [correctOption, setCorrectOption] = useState('');

    const [loading, setLoading] = useState(true);

    const { id } = useLocalSearchParams();

    if (!id) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(id) ? id[0] : id;

    const { data } = useLiveQuery(db.query.questions.findFirst({ where: (eq(questions.id, parseInt(currentId))) }));

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
            const formattedOptions = formatOptions(options);
            await db.update(questions).set({ questionText, options: formattedOptions, correctOption }).where(eq(questions.id, parseInt(currentId)));
            setShowUpdateModal(false);
        } catch (error) {
            console.log(error);
            alert('Error in updating details');
        }
    }, [questionText, options, correctOption]);

    useEffect(() => {
        if (data) {
            setLoading(false);
            setQuestionText(prev => data.questionText);
            setOptions(prev => data.options);
            setCorrectOption(prev => data.correctOption);
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
        <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
            <View >
                <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 24, paddingVertical: 30 }}>Question Details</Text>
            </View>

            <View style={{ display: 'flex', gap: 10 }}>
                <View style={styles.detailRow}>
                    <Text style={styles.titleTop}>ID No</Text>
                    <Text style={styles.detailRowRight}>{data.id}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Question</Text>
                    <Text style={styles.detailRowRight}>{data.questionText}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Options</Text>
                    <Text style={styles.detailRowRight}>{data.options}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleMiddle}>Correct Option</Text>
                    <Text style={styles.detailRowRight}>{data.correctOption}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.titleBottom}>Created At</Text>
                    <Text style={styles.detailRowRight}>{data.createdAt}</Text>
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
                        <CustomInput type='text' placeholder='Options (comma separated)' value={options} setValue={setOptions} />
                        <CustomInput type='text' placeholder='Correct Option' value={correctOption} setValue={setCorrectOption} />
                        <CustomButton title='Cancel' varient='outline' onPress={() => setShowUpdateModal(false)} />
                        <CustomButton title='Update' varient='outline' onPress={handleUpdate} />
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
