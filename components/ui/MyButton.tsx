import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default function Button({ onPress, title }: {
    onPress: () => void,
    title: string
}) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 40,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',

    },
    text: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
