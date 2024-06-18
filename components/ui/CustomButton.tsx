import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export function CustomButton({ onPress, title, varient = 'default' }: {
    onPress: () => void,
    title: string,
    varient: 'default' | 'outline';

}) {
    return (
        <Pressable style={varient == 'default' ? styles.button : styles.backButton} onPress={onPress}>
            <Text style={varient == 'default' ? styles.text : styles.backBtnText}>{title}</Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: 'black',

    },
    text: {
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },

    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 10,
    },
    backBtnText: {
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },

});
