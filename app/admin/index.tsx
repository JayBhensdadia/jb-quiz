import React from 'react';
import { Button, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { CustomButton } from '@/components/ui/CustomButton';
import { db } from '@/db/client';
import { questions, users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Header } from '@/components/ui/Header';
import UserTable from '@/components/UserTable';
import UsersHero from '@/components/UsersHero';
import QuestionsHero from '@/components/QuestionsHero';
import QuestionsTable from '@/components/QuestionsTable';

const AdminScreen = () => {

    const { data } = useLiveQuery(db.select().from(users));



    return (
        <View style={{ flex: 1, marginTop: 20, display: 'flex', gap: 20 }}>


            {/* header section */}
            <View style={{ width: '100%', paddingHorizontal: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', }}>
                <Header title='Hello, Admin' />
                <CustomButton varient='default' title='logout' onPress={async () => {
                    await SecureStore.deleteItemAsync('token');
                    router.replace('/');
                }} />

            </View>



            {/* heros section */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50, marginVertical: 10 }}>

                <UsersHero />
                <QuestionsHero />
                {/* <View style={{ display: 'flex' }}>
                    <Text style={{ fontFamily: "Space-Grotesk", fontSize: 72 }}>{data.length}</Text>
                    <Text style={{ fontFamily: "Space-Grotesk", fontSize: 24, textAlign: 'center' }}>Users</Text>
                </View> */}
                {/* <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: "Space-Grotesk", fontSize: 72 }}>11</Text>
                    <Text style={{ fontFamily: "Space-Grotesk", fontSize: 24, textAlign: 'center' }}>Questions</Text>
                </View> */}

            </View>





            {/* list of few users with show all button */}

            <UserTable varient='mini' />
            <QuestionsTable varient='mini' />

            {/* list of few questions with show all button */}

            {/* <View>
                <Header title='List of questions' />
            </View> */}

            {/* <Text>
                {JSON.stringify(data)}

            </Text> */}

            {/* <CustomButton title='create user' varient='default' onPress={async () => {
                try {
                    await db.insert(users).values({ username: 'user6@gmail.com', password: 'user6' });
                    console.log('user created..!!!');

                } catch (error) {
                    console.log(error);

                    alert('error in creating user');
                }
            }} />

            <CustomButton title='create question' varient='default' onPress={async () => {
                try {
                    await db.insert(questions).values({ questionText: 'where is everest?', options: '{"A":"nepal","B":"pakistan"}', correctOption: "A" });
                    console.log('question created..!!!');

                } catch (error) {
                    console.log(error);

                    alert('error in creating questions');
                }
            }} />
 */}



        </View>
    );
};

export default AdminScreen;