import { db } from '@/db/client';
import { questions, users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React from 'react';
import { Text, View } from 'react-native';

const QuestionsHero = () => {

    const { data } = useLiveQuery(db.select().from(questions));
    return (

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: "Space-Grotesk", fontSize: 72 }}>{data.length}</Text>
            <Text style={{ fontFamily: "Space-Grotesk", fontSize: 24, textAlign: 'center' }}>Questions</Text>
        </View>



    );
};

export default QuestionsHero;