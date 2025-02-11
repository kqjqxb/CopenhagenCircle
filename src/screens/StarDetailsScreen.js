import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Share,
    ScrollView,

} from 'react-native';
import { ArrowLeftIcon,  } from 'react-native-heroicons/solid';



const fontSfProTextRegular = 'SFProText-Regular';

const StarDetailsScreen = ({ setSelectedScreen, selectedStar, setEntertainments, entertainments }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);



    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1
        }} >
            <View style={{
                width: '100%',
                alignSelf: 'center',
                alignItems: 'center',
                padding: dimensions.width * 0.02,
                backgroundColor: '#0C6EE6',
                borderRadius: dimensions.width * 0.05,
                paddingHorizontal: dimensions.width * 0.05,
                paddingBottom: dimensions.height * 0.03,
                paddingTop: dimensions.height * 0.035,
            }}>
                <Image
                    source={require('../assets/images/starDetailsImage.png')}
                    style={{
                        width: dimensions.height * 0.28,
                        height: dimensions.height * 0.28,
                        textAlign: 'center',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.025,
                    }}
                    resizeMode="contain"
                />
            </View>
            <View style={{
                zIndex: 50,
                position: 'absolute',
                top: '-3%',
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                marginTop: dimensions.height * 0.1,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (!isTextClosed) {
                            setIsTextClosed(true);
                        } else setSelectedScreen('Map');
                    }}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.66)',
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                    }}>
                    <ArrowLeftIcon size={dimensions.height * 0.044} color='black' />
                </TouchableOpacity>

            </View>
            <ScrollView style={{ width: '100%', }}>
                <View style={{
                    marginBottom: dimensions.height * 0.25,
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                }}>




                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.064,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 800,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,
                            marginTop: dimensions.height * 0.0021,


                        }}
                    >
                        {selectedStar.title}
                    </Text>
                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingTop: dimensions.height * 0.01,


                        }}
                    >
                        Constellation
                    </Text>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>

                        <Text
                            style={{
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 500,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.05,
                                paddingVertical: dimensions.height * 0.01,


                            }}
                        >
                            {selectedStar.constellation}
                        </Text>
                    </View>


                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.01,


                        }}
                    >
                        Type
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.012,


                        }}
                    >
                        {selectedStar.type}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.01,


                        }}
                    >
                        Brightness
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.012,


                        }}
                    >
                        {selectedStar.brightness}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.01,


                        }}
                    >
                        Distance from Earth
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.012,


                        }}
                    >
                        {selectedStar.distanceFromEarth}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.01,


                        }}
                    >
                        Discovery
                    </Text>
                    <Text
                        style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 500,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.012,


                        }}
                    >
                        {selectedStar.discovery}
                    </Text>




                </View>

            </ScrollView>
        </View>
    );
};

export default StarDetailsScreen;
