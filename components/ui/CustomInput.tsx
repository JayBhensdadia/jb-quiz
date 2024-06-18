import React, { ReactElement } from 'react';
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

    let element: ReactElement;
    switch (type) {
        case 'password':
            return (<View>

                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    style={styles.input}
                    secureTextEntry
                />
            </View>);
            break;
        default:
            return (<View>

                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    style={styles.input}

                />
            </View>);
            break;
    }



};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10
    },
});