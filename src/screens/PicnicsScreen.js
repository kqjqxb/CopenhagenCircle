import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const fontSfProTextRegular = 'SFProText-Regular';

import picnicPlaces from '../components/picnicPlaces';
import { ScrollView } from 'react-native-gesture-handler';





const PicnicsScreen = ({ setSelectedScreen, routes, selectedScreen, selectedStar, setSelectedStar }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const [selectedEventCategory, setSelectedEventCategory] = useState('General');
    const [selectedPicnicPlace, setSelectedPicnicPlace] = useState(null);


    useEffect(() => {
        console.log('selectedStar:', selectedStar);
    }, [selectedStar])

    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1,
            position: 'relative',
        }} >
            <View style={{
                width: '100%',
                borderRadius: dimensions.width * 0.05,
                alignSelf: 'center',
                alignItems: 'center',
                paddingHorizontal: dimensions.width * 0.05,
                paddingVertical: dimensions.height * 0.01,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: dimensions.width * 0.01,
                backgroundColor: '#151515',
                paddingTop: dimensions.height * 0.057,
            }}>
                <Text style={{
                    fontFamily: fontSfProTextRegular,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.064,
                    alignItems: 'center',
                    alignSelf: 'center',
                    textAlign: 'center',
                }}
                >
                    Copenhagen picnics
                </Text>
                <TouchableOpacity
                    disabled={true}
                    style={{
                        opacity: 0,
                    }}
                    onPress={() => {
                        setSelectedScreen("Calendar")
                    }}>
                    <Image
                        source={require('../assets/icons/calendarIcon.png')}
                        style={{
                            width: dimensions.height * 0.03,
                            height: dimensions.height * 0.03,
                            margin: dimensions.height * 0.014,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

            </View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
            }}>

                {['General', 'Created'].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            paddingHorizontal: dimensions.width * 0.025,
                            borderRadius: dimensions.width * 0.1,


                        }}
                        onPress={() => {
                            setSelectedEventCategory(`${item}`);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.043,
                                color: selectedEventCategory === item ? '#DD0326' : '#999999',
                                paddingTop: dimensions.width * 0.04,
                                textDecorationLine: selectedEventCategory === item ? 'underline' : 'none',
                                textDecorationStyle: 'solid',
                                fontWeight: 400
                            }}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            <Text
                style={{
                    fontFamily: fontSfProTextRegular,
                    fontSize: dimensions.width * 0.043,
                    color: 'white',
                    paddingTop: dimensions.width * 0.04,
                    fontWeight: 600,
                    paddingHorizontal: dimensions.width * 0.05,
                    alignSelf: 'flex-start',
                    marginBottom: dimensions.height * 0.01,
                }}
            >
                Places for picnic
            </Text>

            <ScrollView>
                <View style={{
                    width: dimensions.width,
                    flex: 1,
                    marginBottom: dimensions.height * 0.3,
                    marginTop: dimensions.height * 0.01,
                }}>

                    {picnicPlaces.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedPicnicPlace(item);
                            }}
                            style={{
                                alignSelf: 'center',
                                width: dimensions.width * 0.95,
                                marginBottom: dimensions.height * 0.016,
                                zIndex: 500,
                            }}
                        >


                            <Image
                                source={item.image}
                                style={{
                                    width: dimensions.width * 0.97,
                                    height: dimensions.height * 0.23,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    borderRadius: dimensions.width * 0.055,
                                    position: 'relative',
                                }}
                                resizeMode="stretch"
                            />
                            <Image
                                source={selectedPicnicPlace === item
                                    ? require('../assets/icons/fullRadioButtonIcon.png')
                                    : require('../assets/icons/emptyRadioButtonIcon.png')
                                }
                                style={{
                                    width: dimensions.height * 0.028,
                                    height: dimensions.height * 0.028,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    borderRadius: dimensions.width * 0.055,
                                    position: 'absolute',
                                    top: '5%',
                                    right: '3%',
                                }}
                                resizeMode="contain"
                            />

                            <Text
                                style={{
                                    fontFamily: fontSfProTextRegular,
                                    fontSize: dimensions.width * 0.043,
                                    color: 'white',
                                    padding: dimensions.width * 0.021,
                                    fontWeight: 600,
                                }}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: fontSfProTextRegular,
                                    fontSize: dimensions.width * 0.037,
                                    color: '#999999',
                                    opacity: 0.7,
                                    fontWeight: 500,
                                    paddingHorizontal: dimensions.width * 0.021,
                                }}
                            >
                                {item.address}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity style={{
                width: dimensions.width * 0.95,
                height: dimensions.height * 0.07,
                backgroundColor: '#0875E6',
                borderRadius: dimensions.width * 0.037,
                position: 'absolute',
                bottom: '16%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
            }}
            >
                <Text
                    style={{
                        fontFamily: fontSfProTextRegular,
                        fontSize: dimensions.width * 0.037,
                        color: 'white',
                        fontWeight: 700,

                    }}
                >
                    Create new picnic
                </Text>
            </TouchableOpacity>





        </View>
    );
};

export default PicnicsScreen;
