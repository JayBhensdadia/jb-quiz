import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const CustomInput = ({
    placeholder,
    value,
    setValue,
    type
}: {
    placeholder: string,
    value: string,
    setValue: (text: string) => void;
    type: 'text' | 'password' | 'number';
}) => {
    return (
        <View>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                style={styles.input}
                secureTextEntry={type === 'password'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        fontFamily: 'Space-Grotesk-SemiBold',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10
    },
});
