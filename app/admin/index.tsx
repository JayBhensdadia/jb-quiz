import { Button, Pressable, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';
import UserTable from '@/components/UserTable';
import UsersHero from '@/components/UsersHero';
import QuestionsHero from '@/components/QuestionsHero';
import QuestionsTable from '@/components/QuestionsTable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AdminScreen = () => {

    console.log('admin screen loading.....');




    return (
        <View style={{ width: '100%', height: '100%', marginTop: 30, display: 'flex', gap: 20 }}>


            {/* header section */}
            <View style={{ width: '100%', paddingHorizontal: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', }}>
                <Header title='Hello, Admin' />
                <Pressable style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 20,
                    elevation: 3,
                    backgroundColor: '#015055',

                }} onPress={async () => {
                    await SecureStore.deleteItemAsync('token');
                    router.replace('/');
                }}>
                    <MaterialCommunityIcons name="logout-variant" size={24} color="white" />
                </Pressable>
                {/* <CustomButton varient='default' title='logout' onPress={async () => {
                    await SecureStore.deleteItemAsync('token');
                    router.replace('/');
                }} /> */}

            </View>



            {/* heros section */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50, marginVertical: 10 }}>

                <UsersHero />
                <QuestionsHero />


            </View>






            <UserTable varient='mini' />
            <QuestionsTable varient='mini' />



        </View>
    );
};

export default AdminScreen;