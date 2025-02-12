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

const EventDetailsScreen = ({  setSelectedScreen, selectedScreen, selectedPlace, selectedEvent }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        const fetchStorageFavourites = async () => {
          try {
            const saved = await AsyncStorage.getItem('favorites');
            setFavorites(saved ? JSON.parse(saved) : []);
          } catch (error) {
            console.error('Помилка  favorites:', error);
          }
        };
    
        fetchStorageFavourites();
    
      }, [selectedScreen,]);

    const saveFavourite = async (favourite) => {
        try {
            const savedFav = await AsyncStorage.getItem('favorites');
            const parsedFav = savedFav ? JSON.parse(savedFav) : [];

            const favIndex = parsedFav.findIndex((fav) => fav.id === favourite.id);

            if (favIndex === -1) {
                const updatedFavs = [favourite, ...parsedFav];
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavs));
                setFavorites(updatedFavs);
                console.log('favourite збережена');
            } else {
                const updatedFavs = parsedFav.filter((fav) => fav.id !== favourite.id);
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavs));
                setFavorites(updatedFavs);
                console.log('favourite видалена');
            }
        } catch (error) {
            console.error('Помилка збереження/видалення локації:', error);
        }
    };

    const isThisFavourite = (favourite) => {
        return favorites.some((fav) => fav.id === favourite.id);
    };

    useEffect(() => {
        console.log('favorites:', favorites);
        console.log('selectedPlace:', selectedPlace);
    }, [selectedScreen])

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


                <TouchableOpacity onPress={() => saveFavourite(selectedEvent)} style={{ zIndex: 1000, }}>

                    <Image
                        source={isThisFavourite(selectedEvent)
                            ? require('../assets/icons/fullBlueHeartIcon.png')
                            : require('../assets/icons/blueHeartIcon.png')}
                        style={{
                            width: dimensions.height * 0.064,
                            height: dimensions.width * 0.064,
                            marginTop: dimensions.height * 0.01,
                            textAlign: 'center',
                            alignItems: 'center',
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
                    source={selectedEvent.image}
                    style={{
                        width: dimensions.width * 0.97,
                        height: dimensions.height * 0.25,
                        textAlign: 'center',
                        borderRadius: dimensions.width * 0.046,
                    }}
                    resizeMode="stretch"
                />

                <View style={{
                    paddingHorizontal: dimensions.width * 0.02,
                    flexDirection: 'row',
                    marginTop: dimensions.height * 0.01,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
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
                        {selectedEvent.date}
                    </Text>


                    <Text
                        style={{
                            fontFamily: 'SFPro-Medium',
                            fontWeight: 500,
                            fontSize: dimensions.width * 0.037,
                            color: '#999999',
                            opacity: 0.7,
                        }}
                    >
                        {selectedEvent.time}
                    </Text>

                </View>
                <Text
                    style={{
                        fontWeight: 600,
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.055,
                        color: 'white',
                        padding: dimensions.width * 0.021,
                        marginTop: dimensions.height * 0.01,
                    }}
                >
                    {selectedEvent.title}
                </Text>


                <Text
                    style={{
                        fontFamily: fontSfProTextRegular,
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.04,
                        color: 'white',
                        padding: dimensions.width * 0.021,
                    }}
                >
                    {selectedEvent.description}
                </Text>

            </View>

        </SafeAreaView>
    );
};

export default EventDetailsScreen;
