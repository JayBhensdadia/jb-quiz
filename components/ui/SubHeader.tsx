import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SubHeader = ({ title }: { title: string; }) => {
    return (
        <View>
            <Text style={styles.subHeader}>{title}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    subHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 30
    },
})

