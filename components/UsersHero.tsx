import { db } from '@/db/client';
import { users } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React from 'react';
import { Text, View } from 'react-native';

const UsersHero = () => {

  const { data } = useLiveQuery(db.select().from(users));
  return (

    <View style={{ display: 'flex' }}>
      <Text style={{ fontFamily: "Space-Grotesk", fontSize: 72 }}>{data.length}</Text>
      <Text style={{ fontFamily: "Space-Grotesk", fontSize: 24, textAlign: 'center' }}>Users</Text>
    </View>



  );
};

export default UsersHero;