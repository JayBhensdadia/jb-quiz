import { CustomButton } from '@/components/ui/CustomButton';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { questions, quizResults, SelectQuizResult, SelectUser, users } from '@/db/schema';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';

const UserScreen = () => {


    const [id, setId] = useState<string | null>(null);

    const [user, setUser] = useState<SelectUser | null | undefined>(null);

    const [myQuiz, setMyQuiz] = useState<SelectQuizResult[] | null | undefined>(null);



    useEffect(() => {


        const loaduser = async () => {
            setId(await SecureStore.getItemAsync('userId'));

            if (id) {

                try {

                    const tempUser = await db.query.users.findFirst({ where: eq(users.id, parseInt(id)) });

                    setUser(tempUser);

                } catch (error) {
                    console.log('error fetching user data');
                    console.log(error);

                }


            }
        };


        loaduser();

    }, []);


    useEffect(() => {

        const loadQuiz = async () => {



            if (id) {
                try {

                    const tempQuiz = await db.query.quizResults.findMany({ where: eq(quizResults.userId, parseInt(id)) });

                    // tempQuiz.filter((quiz) => quiz.userId === parseInt(id));

                    setMyQuiz(tempQuiz);


                } catch (error) {
                    console.log('error fetching user data');
                    console.log(error);

                }

            }
        };

        loadQuiz();
    }, []);



    //check if user previously played

    if (myQuiz?.length == 0) {
        console.log('user not played!');

    }


    // resume quiz



    //OR

    //see results









    if (!user) {

        return <View>
            <Text>user data could not be loaded!</Text>
        </View>;
    }

    return (
        <View style={{ flex: 1, marginTop: 50, padding: 10 }}>


            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 20 }}>
                        Hello,
                    </Text>

                    <Text style={{ fontFamily: 'Space-Grotesk-Bold', fontSize: 32 }}>{user.name}</Text>
                </View>


                <CustomButton varient='default' title='logout' onPress={async () => {
                    await SecureStore.deleteItemAsync('token');
                    router.replace('/');
                }} />

            </View>



            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", paddingVertical: 30 }}>
                <Image source={{ uri: user.profilePhoto!, height: 300, width: 300 }} style={{ borderRadius: 150 }} />
            </View>

            <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 36, textAlign: 'center' }}>What are you planning to learn today?</Text>


            <View style={{ flex: 1, display: 'flex', gap: 20, paddingVertical: 50, paddingHorizontal: 30 }}>
                <CustomButton varient='default' title={myQuiz?.length == 0 ? 'Start Quiz' : 'Resume Quiz'} onPress={() => {

                    router.push(`/user/quiz/${user.id}`);
                }} />


                {myQuiz?.length != 0 && <CustomButton varient='outline' title='See Report of previos one' onPress={() => { }} />}

            </View>

        </View>
    );
};

export default UserScreen;