import { db } from '@/db/client';
import { answers, SelectUser, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const UserReport = () => {


    const { userId } = useLocalSearchParams();


    console.log('user_id: ', userId);

    if (!userId) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(userId) ? userId[0] : userId;

    const answersList = useLiveQuery(db.query.answers.findMany({ where: eq(answers.userId, parseInt(currentId)) }));



    const correctCount = (): number => {
        let count = 0;
        answersList.data.map((item) => {
            if (item.isCorrect) { count++; }
        });
        return count;
    };

    const wrongCount = () => {
        return answersList.data.length - correctCount();
    };


    return (
        <ScrollView style={{ flex: 1, marginTop: 50, marginHorizontal: 20 }}>

            <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 26, paddingBottom: 40 }}>
                User's Report
            </Text>



            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 30 }}>

                <View style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                    <Text style={{ fontFamily: "Space-Grotesk-Bold", fontSize: 72, color: 'green' }}>{correctCount()}</Text>
                    <Text style={{ fontFamily: "Space-Grotesk-Medium", fontSize: 24, textAlign: 'center', color: 'green' }}>Correct</Text>
                </View>


                <View style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                    <Text style={{ fontFamily: "Space-Grotesk-Bold", fontSize: 72, color: 'red' }}>{wrongCount()}</Text>
                    <Text style={{ fontFamily: "Space-Grotesk-Medium", fontSize: 24, textAlign: 'center', color: 'red' }}>Wrong</Text>
                </View>

            </View>

            {/* <Text>{JSON.stringify(answersList.data)}</Text> */}

            <View style={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>

                {answersList.data.map((item) => {
                    return <View key={item.id} style={[{ width: 100, height: 100, borderRadius: 20, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }, item.isCorrect && { backgroundColor: 'green' }]}>
                        <Text style={{ fontFamily: 'Space-Grotesk-Bold', fontSize: 36, color: 'white' }}>{item.questionId}</Text>
                    </View>;
                })}

            </View>
        </ScrollView>
    );
};

export default UserReport;