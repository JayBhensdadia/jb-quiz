import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export const CustomSwitch = ({ title, value, setValue }: { title: string, value: boolean, setValue: ((value: boolean) => void | Promise<void>) | null | undefined; }) => {
    return (
        <View style={styles.switchContainer}>
            <Text style={styles.input}>{title}</Text>
            <Switch value={value} onValueChange={setValue} />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        color: 'black'
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 20,
    },
});
