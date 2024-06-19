import { db } from '@/db/client';
import { SelectQuestion, users, SelectQuizResult } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const UserQuiz = () => {
    const { userId } = useLocalSearchParams();
    const [myQuiz, setMyQuiz] = useState<SelectQuizResult[] | null | undefined>(null);
    const [playableQuestions, setPlayableQuestions] = useState<SelectQuestion[] | null | undefined>(null);

    console.log(userId);

    if (!userId) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(userId) ? userId[0] : userId;



    const currentQuiz = useLiveQuery(db.query.questions.findMany());
    // const playedQuiz = useLiveQuery(db.query.quizResults.findMany());



    useEffect(() => {

        const loadQuiz = async () => {



            if (currentId) {
                try {

                    const tempQuiz = await db.query.quizResults.findMany();

                    tempQuiz.filter((quiz) => quiz.userId === parseInt(currentId));

                    setMyQuiz(tempQuiz);


                } catch (error) {
                    console.log('error fetching user data');
                    console.log(error);

                }

            }
        };

        loadQuiz();
    }, []);







    return (
        <View style={{ flex: 1, marginTop: 50 }}>

            <Text>User {currentId} Quiz page</Text>
            <Text>{JSON.stringify(currentQuiz.data)}</Text>
            <Text>{JSON.stringify(myQuiz)}</Text>
        </View>

    );
};

export default UserQuiz;