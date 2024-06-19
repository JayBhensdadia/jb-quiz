import { Link, router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { Header } from '@/components/ui/Header';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';
import { SubHeader } from '@/components/ui/SubHeader';

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
        if (token === 'admin-token') {
            router.replace('/admin');
        } else if (token === 'user-token') {
            router.replace('/user');
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
            await SecureStore.setItemAsync('token', 'admin-token');
            router.push("/admin");
            return;
        }

        //check user


        try {
            const user = await db.query.users.findFirst({
                where: (users, { and }) => and(eq(users.username, username), eq(users.password, password)),
            });

            if (user) {
                await SecureStore.setItemAsync('token', 'user-token');
                await SecureStore.setItemAsync('userId', String(user.id));
                // setSession('user-session');
                router.push("/user");
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header title='Sign in' />
                <SubHeader title='Good to see you again!!' />

                <View style={styles.form}>
                    <CustomInput type='text' placeholder='email' value={username} setValue={setUsername} />
                    <CustomInput type='password' placeholder='password' value={password} setValue={setPassword} />

                    <CustomButton
                        varient='default'
                        title='Signin'
                        onPress={handleSignin}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E1F396', // Apply background color to the SafeAreaView

    },
    container: {
        flex: 1,
        marginTop: 150,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#E1F396',
        // Ensure background color is applied here too
        gap: 10, // Use margin or padding for consistent spacing
    },
    form: {
        width: '100%',
        flex: 1,
        display: 'flex',
        gap: 20,
        paddingHorizontal: 30,

    }
});