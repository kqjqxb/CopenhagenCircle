import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';

const fontSfProTextRegular = 'SFProText-Regular';

const HoroscopeDetailsScreen = ({ setSelectedScreen, selectedZodiac }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [selectedCategory, setSelectedCategory] = useState('Today');
    const [horoscopeData, setHoroscopeData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchHoroscope = async (sign, category) => {
        let endpoint = '';
        switch (category) {
            case 'Yesterday':
            case 'Today':
            case 'Tomorrow':
                endpoint = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=${category.toUpperCase()}`;
                break;
            case 'Weekly Horoscope':
                endpoint = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${sign}`;
                break;
            case 'Monthly Horoscope':
                endpoint = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${sign}`;
                break;
            default:
                return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setHoroscopeData(data.data.horoscope_data);
        } catch (error) {
            console.error('Error fetching horoscope data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHoroscope(selectedZodiac.title, selectedCategory);
    }, [selectedCategory, selectedZodiac]);


    const checkIfFavorite = async () => {
        try {
            const existingFavorites = await AsyncStorage.getItem('favorites');
            if (existingFavorites) {
                const favorites = JSON.parse(existingFavorites);
                const isFav = favorites.some(fav => 
                    fav.zodiac === selectedZodiac.title && 
                    fav.category === selectedCategory &&
                    fav.horoscope === horoscopeData
                );
                setIsFavorite(isFav);
            }
        } catch (error) {
            console.error('Error checking favorites:', error);
        }
    };
    useEffect(() => {
        checkIfFavorite();
    }, [horoscopeData]);

    const toggleFavorite = async () => {
        try {
            const favorite = {
                zodiac: selectedZodiac.title,
                horoscope: horoscopeData,
                category: selectedCategory,
            };

            const existingFavorites = await AsyncStorage.getItem('favorites');
            let newFavorites = existingFavorites ? JSON.parse(existingFavorites) : [];

            if (isFavorite) {
                newFavorites = newFavorites.filter(fav => 
                    !(fav.zodiac === favorite.zodiac && fav.category === favorite.category && fav.horoscope === favorite.horoscope)
                );
                // Alert.alert('Removed', 'Horoscope removed from favorites.');
            } else {
                newFavorites.unshift(favorite);
                // Alert.alert('Success', 'Horoscope saved to favorites!');
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorites.');
        }
    };

    return (
        <View style={{
            width: dimensions.width,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1
        }} >
            <View style={{
                zIndex: 50,
                position: 'absolute',
                top: 0,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                marginTop: dimensions.height * 0.1,
            }}>
                <TouchableOpacity
                    onPress={() => setSelectedScreen('Home')}
                    style={{
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                    }}>
                    <Image
                        source={require('../assets/icons/leftIconInCircle.png')}
                        style={{
                            width: dimensions.height * 0.088,
                            height: dimensions.height * 0.088,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleFavorite}
                    style={{
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                    }}>
                    <Image
                        source={isFavorite ? require('../assets/icons/heartInCircleIcon.png') : require('../assets/icons/emptyHeartIcon.png')}
                        style={{
                            width: dimensions.height * 0.088,
                            height: dimensions.height * 0.088,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{

                }}>
                <View style={{
                    marginBottom: dimensions.height * 0.16,
                }}>


                    <Image
                        source={selectedZodiac.image}
                        style={{
                            width: dimensions.width,
                            height: dimensions.height * 0.43,
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderBottomLeftRadius: dimensions.width * 0.07,
                            borderBottomRightRadius: dimensions.width * 0.07,
                        }}
                        resizeMode="stretch"
                    />

                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.07,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 800,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,
                            marginTop: dimensions.height * 0.0021,
                        }}
                    >
                        {selectedZodiac.title}
                    </Text>

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{
                            paddingHorizontal: dimensions.width * 0.03,
                            marginHorizontal: dimensions.width * 0.01,
                        }}
                    >
                        {['Yesterday', 'Today', 'Tomorrow', 'Weekly Horoscope', 'Monthly Horoscope'].map((day, index) => (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(day)}
                                key={index} style={{
                                    paddingVertical: dimensions.height * 0.01,
                                    paddingHorizontal: dimensions.width * 0.05,
                                    borderRadius: dimensions.width * 0.5,
                                    backgroundColor: '#0C6EE6',
                                    marginHorizontal: dimensions.width * 0.01,
                                    opacity: selectedCategory === day ? 1 : 0.5,
                                }}>
                                <Text
                                    style={{
                                        fontFamily: fontSfProTextRegular,
                                        fontSize: dimensions.width * 0.04,
                                        color: 'white',
                                        textAlign: 'left',
                                        fontWeight: 400,
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: dimensions.width * 0.03,
                                        paddingVertical: dimensions.height * 0.01,
                                        marginTop: dimensions.height * 0.0021,
                                    }}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>


                    <View style={{
                        width: '100%',

                    }}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0C6EE6" style={{marginTop: dimensions.height * 0.1}}/>
                        ) : (
                            <Text
                                style={{
                                    fontFamily: fontSfProTextRegular,
                                    fontSize: dimensions.width * 0.04,
                                    color: 'white',
                                    textAlign: 'left',
                                    fontWeight: 500,
                                    alignSelf: 'flex-start',
                                    paddingHorizontal: dimensions.width * 0.05,
                                    paddingVertical: dimensions.height * 0.01,
                                    marginTop: dimensions.height * 0.01,

                                }}
                            >
                                {horoscopeData}
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HoroscopeDetailsScreen;
