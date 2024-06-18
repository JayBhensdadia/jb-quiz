import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Header = ({ title }: { title: string; }) => {
    return (
        <View>
            <Text style={styles.header}>{title}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingTop: 20
    },
})

