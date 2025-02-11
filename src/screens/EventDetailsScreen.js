import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    TextInput,
    Alert,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontRobotoBold = 'Roboto-Bold';
const fontRobotoReg = 'Roboto-Regular';
const fontSfProTextRegular = 'SFProText-Regular';

const EventDetailsScreen = ({ setSelectedScreenPage, setSelectedScreen, selectedPlace, savedPolandPlaces, setSavedPolandPlaces, selectedCategory, setSelectedCategory }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);



    const savePlace = async (place) => {
        try {
            const savedPlace = await AsyncStorage.getItem('savedPolandPlaces');
            const parsedTheesePlaces = savedPlace ? JSON.parse(savedPlace) : [];

            const thisPlaceIndex = parsedTheesePlaces.findIndex((loc) => loc.id === place.id);

            if (thisPlaceIndex === -1) {
                const updatedPlacesList = [place, ...parsedTheesePlaces];
                await AsyncStorage.setItem('savedPolandPlaces', JSON.stringify(updatedPlacesList));
                setSavedPolandPlaces(updatedPlacesList);
                console.log('place was saved');
            } else {
                const updatedPlacesList = parsedTheesePlaces.filter((loc) => loc.id !== place.id);
                await AsyncStorage.setItem('savedPolandPlaces', JSON.stringify(updatedPlacesList));
                setSavedPolandPlaces(updatedPlacesList);
                console.log('place was deleted');
            }
        } catch (error) {
            console.error('error of save/delete Poland place:', error);
        }
    };
    const isPlaceSaved = (location) => {
        return savedPolandPlaces.some((loc) => loc.id === location.id);
    };

    return (
        <SafeAreaView style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1
        }} >
            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '97%',
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedScreen('Home');
                    }}
                    style={{
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ChevronLeftIcon size={dimensions.height * 0.034} color='#0875E6' />
                    <Text style={{
                        fontFamily: fontSfProTextRegular,
                        color: '#0875E6',
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.043,
                        alignItems: 'center',
                        alignSelf: 'center',
                        textAlign: 'center',
                    }}
                    >
                        Back
                    </Text>
                </TouchableOpacity>

                <Text style={{
                    fontFamily: fontSfProTextRegular,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.043,
                    alignItems: 'center',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginRight: dimensions.width * 0.05,
                }}
                >
                    Event
                </Text>


                <TouchableOpacity onPress={() => savePlace(selectedPlace)} style={{ zIndex: 1000, }}>

                    <Image
                        source={require('../assets/icons/blueHeartIcon.png')}
                        style={{
                            width: dimensions.height * 0.046,
                            height: dimensions.height * 0.046,
                            textAlign: 'center',
                            marginRight: dimensions.width * 0.02,
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <View style={{
                width: dimensions.width * 0.97,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.02,
            }}>
                <Image
                    source={require('../assets/images/eventImage.png')}
                    style={{
                        width: dimensions.width * 0.97,
                        height: dimensions.height * 0.3,
                        textAlign: 'center',
                        borderRadius: dimensions.width * 0.046,
                    }}
                    resizeMode="stretch"
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: dimensions.height * 0.01,
                    paddingHorizontal: dimensions.width * 0.02,
                }}>
                    <Text
                        style={{
                            fontFamily: 'SFPro-Medium',
                            fontSize: dimensions.width * 0.037,
                            color: '#999999',
                            opacity: 0.7,
                            fontWeight: 500
                        }}
                    >
                        May 15, 2025
                    </Text>


                    <Text
                        style={{
                            fontFamily: 'SFPro-Medium',
                            fontSize: dimensions.width * 0.037,
                            color: '#999999',
                            opacity: 0.7,
                            fontWeight: 500
                        }}
                    >
                        10:00 AM
                    </Text>

                </View>
                <Text
                    style={{
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.055,
                        color: 'white',
                        padding: dimensions.width * 0.021,
                        fontWeight: 600,
                        marginTop: dimensions.height * 0.01,
                    }}
                >
                    Copenhagen Ecological Market
                </Text>


                <Text
                    style={{
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.04,
                        color: 'white',
                        padding: dimensions.width * 0.021,
                        fontWeight: 400,
                    }}
                >
                    This market brings together local producers and eco-friendly suppliers, offering a wide range of organic products, handmade goods, and sustainable solutions. Visitors can enjoy fresh fruits, vegetables, bread, and local delicacies, as well as participate in workshops on ecology and sustainable living. The festive atmosphere is enhanced by live music and activities for children.  
                </Text>

            </View>

        </SafeAreaView>
    );
};

export default EventDetailsScreen;
