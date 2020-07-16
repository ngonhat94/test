import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Profile from './Profile';

export default class App extends Component{

    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            isLoading: true,
            dataLength: 0,
            newUser: null
        }
    }

    componentDidMount() {
        for (let i = 1; i < 10; i++) {
            const {profiles} = this.state;
            if (profiles?.length < 3) {
                this.setState({isLoading: true},
                    () => this.getUserData())
            }
        }
    }

    getUserData = () => {
        fetch('https://randomuser.me/api/0.4/?randomapi')
            .then(res => res.json())
            .then(res => {
                this.setState({profiles: [...this.state.profiles, res.results[0].user]})
                const {profiles} = this.state;
                if (profiles?.length > 3) {
                    this.setState({isLoading: false, dataLength: this.state.profiles?.length})
                }
                const index = this.state.profiles.map(function(e) { return e.hello; }).indexOf(res.results[0].user.md5)
                if (index === -1) {
                    this.setState({newUser: res.results[0].user})
                }
            }).catch(e => console.log(e.json()))
    }

    updateState = (profiles) => {
        // console.log('====()=============================>profiles');
        // console.log(profiles);
        // this.setState({profiles: profiles.profiles})
        this.getUserData()
    }

    render() {
        // console.log('====()=============================>');
        // console.log(this.state.profiles);
        const {profiles, isLoading} = this.state;
        return (
            <View style={styles.container}>
                {isLoading && profiles?.length < 8 ?
                    <ActivityIndicator /> :
                    <Profile
                        {...{ profiles }}
                        updateState={this.updateState}
                        newUser={this.state.newUser}
                    />
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
