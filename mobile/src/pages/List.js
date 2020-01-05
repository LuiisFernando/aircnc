import React, { useState, useEffect } from 'react';
import { 
    SafeAreaView,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    Alert,
    StyleSheet
} from 'react-native';

import socketio from 'socket.io-client';

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List({ navigation }) {
    const [techs, setTechs] = useState([]);


    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://10.0.2.2:3333', {
                query: { user_id }
            });

            socket.on('booking_response', booking => {
                Alert.alert(`Your book on ${booking.spot.company} in ${booking.date} was ${booking.approved ? 'APPROVED' : 'REJECTED'}`);
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());
            setTechs(techsArray);
        })
    }, []);

    function handleLogout() {
        AsyncStorage.clear().then(() => console.log('limpado'))

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10
    }
})