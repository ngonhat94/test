import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';

const {width} = Dimensions.get('window');

Card.defaultProps = {
    likeOpacity: 0,
    nopeOpacity: 0
}

export default function Card(props) {
    const {profile, likeOpacity, nopeOpacity} = props;
    return(
        <View style={[styles.container, props.style, StyleSheet.absoluteFill]}>
            <Text style={{...StyleSheet.absoluteFillObject, width: null, height: null}}/>
            <View style={styles.headerBackground}>
                <Animated.View style={[styles.like, {opacity: likeOpacity}]}>
                    <Text style={styles.likeLabel}>LIKE</Text>
                </Animated.View>
                <Animated.View style={[styles.nope, {opacity: nopeOpacity}]}>
                    <Text style={styles.nopeLabel}>NOPE</Text>
                </Animated.View>
            </View>
            <View style={styles.avatar}>
                <View style={styles.borderImage}>
                    <Image
                        source={{uri: profile.picture}}
                        style={styles.image}
                    />
                </View>
            </View>
            <Text style={styles.title}>My address is</Text>
            <Text style={styles.address}>{profile.location.street}</Text>
            <View style={styles.info}>
                <Image
                    source={require('../assets/icons/icon-customer.png')}
                    style={styles.icon}
                />
                <Image
                    source={require('../assets/icons/icon-calendar.png')}
                    style={{width: 22, height: 22, marginHorizontal: 8}}
                />
                <Image
                    source={require('../assets/icons/icon-mapmarker.png')}
                    style={styles.icon}
                />
                <Image
                    source={require('../assets/icons/iconphone.png')}
                    style={{width: 30, height: 30}}
                />
                <Image
                    source={require('../assets/icons/icon-lock.png')}
                    style={styles.icon}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: width - 30,
        height: 500,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 128,
        height: 128,
        borderRadius: 64
    },
    borderImage: {
        borderWidth: 1,
        borderColor: '#D4D4D4',
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    headerBackground: {
        backgroundColor: '#F9F9F9',
        height: 120,
        borderBottomWidth: 1,
        borderColor: '#D4D4D4',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'flex-start',
        padding: 10
    },
    avatar: {
        position: 'absolute',
        top: 18,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    title: {
        color: '#999999',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 70
    },
    address: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 20
    },
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 8
    },
    like: {
        borderWidth: 2,
        borderRadius: 5,
        padding: 8,
        borderColor: "#6ee3b4",
    },
    likeLabel: {
        fontSize: 22,
        color: "#6ee3b4",
        fontWeight: "bold",

    },
    nope: {
        borderWidth: 2,
        borderRadius: 5,
        padding: 8,
        borderColor: "#ec5288",
    },
    nopeLabel: {
        fontSize: 22,
        color: "#ec5288",
        fontWeight: "bold",
    },
})
