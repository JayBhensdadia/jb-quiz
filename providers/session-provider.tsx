import React from 'react';
import { useStorageState } from './use-storage-state';
import { router } from 'expo-router';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';
import { SelectUser } from '@/db/schema';

const AuthContext = React.createContext<{
    signIn: (username: string, password: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: (username: string, password: string) => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email: string, password: string) => {
                    // Perform sign-in logic here

                    const adminEmail = process.env.EXPO_PUBLIC_ADMIN_USERNAME;
                    const adminPassword = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;

                    if (email === adminEmail && password === adminPassword) {
                        setSession('admin-session');
                        // router.navigate("/home");
                    } else {

                        try {
                            const user = await db.query.users.findFirst({
                                where: (users, { and }) => and(eq(users.username, email), eq(users.password, password)),
                            });

                            if (user) {
                                setSession('user-session');
                                // router.navigate("/home");
                            } else {
                                alert("Invalid username or password");
                            }
                        } catch (error) {
                            console.error("Error signing in:", error);
                            alert("An error occurred while signing in. Please try again.");
                        }



                    }

                    setSession('my-session');

                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
