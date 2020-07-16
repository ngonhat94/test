import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../configs/colors';

export default function Profiles() {
    return(
        <View style={styles.container}>
            <Text>UserPointInfo</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    }
})
