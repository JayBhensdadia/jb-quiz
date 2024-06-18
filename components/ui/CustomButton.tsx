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
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#015055',

    },
    text: {
        fontFamily: "Space-Grotesk-Bold",
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
        fontFamily: "Space-Grotesk",
        letterSpacing: 0.25,
        color: '#015055',
    },

});
