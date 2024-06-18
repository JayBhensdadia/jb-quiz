import { Link, router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { Header } from '@/components/ui/Header';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';

export default function SignIn() {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log('loading...');

        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            setToken(storedToken);
            setIsLoading(false);
        };

        getToken();
    }, []);

    useEffect(() => {
        if (token) {
            router.push('/admin');
        }
    }, [token]);

    // console.log(token);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (token) {
        return null;
    }



    const handleSignin = async () => {


        //check admin

        const adminEmail = process.env.EXPO_PUBLIC_ADMIN_USERNAME;
        const adminPassword = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;


        if (username === adminEmail && password === adminPassword) {
            await SecureStore.setItemAsync('token', 'my-token');
            router.push("/admin");
            return;
        }

        //check user


        try {
            const user = await db.query.users.findFirst({
                where: (users, { and }) => and(eq(users.username, username), eq(users.password, password)),
            });

            if (user) {
                await SecureStore.setItemAsync('token', 'my-token');
                // setSession('user-session');
                router.push("/admin");
                return;

            } else {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            alert("An error occurred while signing in. Please try again.");
        }



    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'cyan', display: 'flex', gap: 10 }}>
            <Header title='Sign in' />


            <CustomInput type='text' placeholder='email' value={username} setValue={setUsername} />
            <CustomInput type='password' placeholder='password' value={password} setValue={setPassword} />

            <CustomButton
                varient='default'
                title='go to home'
                onPress={() => {
                    handleSignin();
                }}
            />
        </View>
    );
}
