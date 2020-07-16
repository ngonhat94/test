import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
import Card from './components/Card';

const {
    add,
    multiply,
    neq,
    spring,
    cond,
    eq,
    event,
    lessThan,
    greaterThan,
    and,
    call,
    set,
    clockRunning,
    startClock,
    stopClock,
    Clock,
    Value,
    concat,
    interpolate,
    Extrapolate,
} = Animated;
const {width, height} = Dimensions.get('window');
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth = width * Math.sin(toRadians(90 - 15)) + height * Math.sin(toRadians(15));
function runSpring(clock, value, dest) {
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
    };

    const config = {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 1,
        restDisplacementThreshold: 0.5,
        toValue: new Value(0),
    };

    return [
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.velocity, 0),
            set(state.position, value),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        spring(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
    ];
}

export default class Profile extends Component{

    constructor(props) {
        super(props);
        this.translationX = new Value(0);
        this.translationY = new Value(0);
        this.velocityX = new Value(0);
        this.offsetX = new Value(0);
        this.offsetY = new Value(0);
        this.gestureState = new Value(State.UNDETERMINED)
        this.onGestureEvent = event([{nativeEvent: {
                translationX: this.translationX,
                translationY: this.translationY,
                velocityX: this.velocityX,
                state: this.gestureState
            }}], {useNativeDriver: true})
        const { profiles } = props;
        console.log(profiles)
        this.state = {profiles};
        this.init();
    }

    init = () => {
        const clockX = new Clock();
        const clockY = new Clock();
        const {translationX, translationY, velocityX, gestureState, offsetY, offsetX} = this;
        gestureState.setValue(State.UNDETERMINED);
        translationX.setValue(0);
        translationY.setValue(0);
        velocityX.setValue(0);
        offsetY.setValue(0);
        offsetX.setValue(0);
        const finalTranslateX = add(translationX, multiply(0.2, velocityX));
        const translationThreshold = width / 4;
        const snapPoint = cond(
            lessThan(finalTranslateX, -translationThreshold),
            -rotatedWidth,
            cond(
                greaterThan(
                    finalTranslateX, translationThreshold
                ),
                rotatedWidth,
                0
            ),
        );
        this.translateX = cond(
            eq(gestureState, State.END),
            [
                set(translationX, runSpring(clockX, translationX, snapPoint)),
                set(offsetX, translationX),
                cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
                    call([translationX], this.swipped),
                ]),
                translationX,
            ],
            cond(eq(gestureState, State.BEGAN), [stopClock(clockX), translationX], translationX),

        );
        this.translateY = cond(
            eq(gestureState, State.END),
            [
                set(translationY, runSpring(clockY, translationY, 0)),
                set(offsetY, translationY),
                translationY,
            ],
            cond(eq(gestureState, State.BEGAN), [stopClock(clockY), translationY], translationY),
        )
    }

    swipped = async ([translationX]) => {
        // console.log({ likes: translationX > 0 });
        const { profiles: [lastProfile, ...profiles] } = this.state;
        this.setState({ profiles }, () => {
            this.init();
            this.props.updateState(this.state.profiles);
        });
        if (this.props.newUser) {
            this.setState({profiles: [...this.state.profiles, this.props.newUser]})
        }
        if (translationX > 0) {
            let users = await AsyncStorage.getItem('@MyApp_user');
            if (users === null) {
                await AsyncStorage.setItem('@MyApp_user', JSON.stringify([lastProfile]))
            } else {
                let dataUser = JSON.parse(users)
                dataUser.push(lastProfile)
                await AsyncStorage.setItem('@MyApp_user', JSON.stringify(dataUser))
            }
            // await AsyncStorage.mergeItem('@MyApp_user', JSON.stringify({...parseUser, lastProfile}))
        }
    }

    getItemStorage = async () => {
        const data = await AsyncStorage.getItem('@MyApp_user');
        if (data) {
            console.log("Data Like User :", JSON.parse(data));
        }
    }

    render() {
        const { onGestureEvent, translateX, translateY } = this;
        const rotateZ = concat(
            interpolate(translateX, {
                inputRange: [-width / 2, width / 2],
                outputRange: [15, -15],
                extrapolate: Extrapolate.CLAMP,
            }),
            "deg",
        );
        const likeOpacity = interpolate(translateX, {
            inputRange: [0, width / 4],
            outputRange: [0, 1],
        });
        const nopeOpacity = interpolate(translateX, {
            inputRange: [-width / 4, 0],
            outputRange: [1, 0],
        });
        const { profiles: [lastProfile, ...profiles] } = this.state;
        const style = {
            ...StyleSheet.absoluteFillObject,
            zIndex: 900,
            transform: [
                { translateX },
                { translateY },
                { rotateZ },
            ],
        };
        return(
            <View style={styles.container}>
                <View style={styles.header}/>
                <View style={styles.card}>
                    <View style={style.cards}>
                        {profiles.reverse().map((profile, index) => (
                            <Card key={index} {...{profile}}/>
                        ))}
                        <PanGestureHandler
                            onHandlerStateChange={onGestureEvent}
                            {...{ onGestureEvent }}
                        >
                            <Animated.View {...{ style }}>
                                <Card profile={lastProfile} {...{likeOpacity, nopeOpacity}}/>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </View>
                <Text onPress={this.getItemStorage} style={{marginTop: 450}}>Get User Liked</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fbfaff",
    },
    header: {
        backgroundColor: '#000',
        height: 100,
        marginBottom: 50
    },
    card: {
        position: 'absolute',
        top: 50,
        left: 15,
        right: 10,
        flex: 1
    },
    cards: {
        flex: 1,
        margin: 8,
        zIndex: 100,
    },
})
