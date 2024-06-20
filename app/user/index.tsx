import { CustomButton } from '@/components/ui/CustomButton';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { answers, questions, SelectAnswer, SelectUser, users } from '@/db/schema';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';

const UserScreen = () => {
    const [id, setId] = useState<string | null>(null);
    const [user, setUser] = useState<SelectUser | null | undefined>(null);
    const [answerList, setAnswerList] = useState<SelectAnswer[]>([]); // Initialize as an empty array
    const [totalQuestionsCount, setTotalQuestionsCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const storedId = await SecureStore.getItemAsync('userId');
            setId(storedId);

            if (storedId) {
                try {
                    const tempUser = await db.query.users.findFirst({ where: eq(users.id, parseInt(storedId)) });
                    setUser(tempUser);
                } catch (error) {
                    console.log('Error fetching user data:', error);
                }
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        const loadAnswers = async () => {
            if (user && id) {
                try {
                    const tempAnswers = await db.query.answers.findMany({ where: eq(answers.userId, parseInt(id)) });
                    setAnswerList(tempAnswers);
                } catch (error) {
                    console.log('Error fetching answers:', error);
                    alert('Error fetching answers');
                }
            }
        };

        loadAnswers();
    }, [id, user]);

    useEffect(() => {
        const loadTotalQuestionsCount = async () => {
            try {
                const tempQuestions = await db.query.questions.findMany();
                setTotalQuestionsCount(tempQuestions.length);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching total questions count:', error);
                alert('Error fetching total questions count');
            }
        };

        loadTotalQuestionsCount();
    }, [answerList]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>User data could not be loaded!</Text>
            </View>
        );
    }

    const isQuizCompleted = answerList.length >= (totalQuestionsCount ?? 0);

    return (
        <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 20 }}>Hello,</Text>
                    <Text style={{ fontFamily: 'Space-Grotesk-Bold', fontSize: 32 }}>{user.name}</Text>
                </View>

                <CustomButton
                    varient='default'
                    title='Logout'
                    onPress={async () => {
                        await SecureStore.deleteItemAsync('token');
                        router.replace('/');
                    }}
                />
            </View>

            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", paddingVertical: 30 }}>
                <Image source={{ uri: user.profilePhoto!, height: 300, width: 300 }} style={{ borderRadius: 150 }} />
            </View>

            <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 36, textAlign: 'center' }}>
                What are you planning to learn today?
            </Text>

            <View style={{ flex: 1, display: 'flex', gap: 20, paddingVertical: 50, paddingHorizontal: 30 }}>
                {!isQuizCompleted && (
                    <CustomButton
                        varient='default'
                        title={answerList.length === 0 ? 'Start Quiz' : 'Resume Quiz'}
                        onPress={() => {
                            router.push(`/user/quiz/${user.id}`);
                        }}
                    />
                )}

                {isQuizCompleted && (
                    <CustomButton
                        varient='outline'
                        title='See Report'
                        onPress={() => {
                            router.push(`/user/report/${user.id}`);
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default UserScreen;
