import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    TextInput,
    SafeAreaView,
    Linking,
    Switch,
    Modal,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon, CheckIcon, PlusIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'react-native-image-picker';
import { set } from 'date-fns';


const fontSfProTextRegular = 'SFProText-Regular';


const privacyAndTermsButtons = [
    {
        id: 1,
        title: 'Terms of Use',
        link: 'https://www.termsfeed.com/live/3c5660de-8725-41a1-ba75-5566a701b5db',
        icon: require('../assets/icons/termsIcon.png')
    },
    {
        id: 2,
        title: 'Privacy Policy',
        link: 'https://www.termsfeed.com/live/b37ab603-57d4-4adb-831b-b422d55440e3',
        icon: require('../assets/icons/privacyIcon.png')
    },

]

const SettingsScreen = ({ selectedScreen, isNotificationEnabled, setNotificationEnabled, favorites, setFavorites }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [modalVisible, setModalVisible] = useState(false);




    const handleDeleteFavourite = async (id) => {
        try {
            const updatedFavs = favorites.filter(rec => rec.id !== id);
            setFavorites(updatedFavs);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavs));
        } catch (error) {
            console.error("Error deleting Favorite:", error);
        }
    };




    const toggleNotificationSwitch = () => {
        const newValue = !isNotificationEnabled;
        setNotificationEnabled(newValue);
        saveSettings('isNotificationEnabled', newValue);
    };


    const saveSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    const loadSettings = async () => {
        try {
            const notificationValue = await AsyncStorage.getItem('isNotificationEnabled');
            if (notificationValue !== null) setNotificationEnabled(JSON.parse(notificationValue));
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    };

    useEffect(() => {
        loadSettings();
    }, [isNotificationEnabled, selectedScreen]);

    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            zIndex: 1,
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            justifyContent: 'flex-start',
        }} >
            <View style={{
                width: '100%',
                backgroundColor: '#151515',
                borderRadius: dimensions.width * 0.05,
                alignItems: 'center',
                paddingHorizontal: dimensions.width * 0.05,
                paddingVertical: dimensions.height * 0.01,
                flexDirection: 'row',
                alignSelf: 'center',
                padding: dimensions.width * 0.01,
                paddingTop: dimensions.height * 0.057,
                justifyContent: 'space-between',
            }}>
                <Text style={{
                    fontFamily: fontSfProTextRegular,
                    color: 'white',
                    marginLeft: dimensions.width * 0.3,
                    fontWeight: 700,
                    alignSelf: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    fontSize: dimensions.width * 0.064,
                }}
                >
                    Settings
                </Text>
                <TouchableOpacity
                    disabled={true}
                    style={{
                        opacity: 0,
                    }}
                    onPress={() => {

                    }}>
                    <Image
                        source={require('../assets/icons/calendarIcon.png')}
                        style={{
                            width: dimensions.height * 0.03,
                            textAlign: 'center',
                            height: dimensions.height * 0.03,
                            alignSelf: 'center',
                            margin: dimensions.height * 0.014,
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

            </View>
            <View style={{
                marginTop: dimensions.height * 0.02,
                width: '100%',
            }}>
                {privacyAndTermsButtons.map((button) => (

                    <TouchableOpacity
                        key={button.id}
                        onPress={() => {
                            Linking.openURL(button.link);
                        }}
                        style={{
                            backgroundColor: '#151515',
                            alignItems: 'center',
                            borderRadius: dimensions.width * 0.05,
                            marginTop: dimensions.height * 0.008,
                            alignSelf: 'center',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingVertical: dimensions.height * 0.028,
                            paddingHorizontal: dimensions.width * 0.05,
                        }}
                    >
                        <Image
                            source={button.icon}
                            style={{
                                width: dimensions.height * 0.03,
                                height: dimensions.height * 0.03,
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginRight: dimensions.width * 0.03,
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{ fontFamily: fontSfProTextRegular, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 700 }}>
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                ))}


                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true);
                    }}
                    style={{
                        backgroundColor: '#151515',
                        width: '95%',
                        borderRadius: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.008,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.05,
                        paddingVertical: dimensions.height * 0.028,
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('../assets/icons/favouritesIcon.png')}
                        style={{
                            width: dimensions.height * 0.03,
                            height: dimensions.height * 0.03,
                            textAlign: 'center',
                            alignSelf: 'center',
                            marginRight: dimensions.width * 0.03,
                        }}
                        resizeMode='contain'
                    />
                    <Text
                        style={{ fontFamily: fontSfProTextRegular, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 700 }}>
                        Favourites
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => {
                    }}
                    style={{
                        backgroundColor: '#151515',
                        flexDirection: 'row',
                        borderRadius: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.008,
                        alignSelf: 'center',
                        width: '95%',
                        paddingVertical: dimensions.height * 0.028,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: dimensions.width * 0.05,
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                        <Image
                            source={require('../assets/icons/notificationsIcon.png')}
                            style={{
                                width: dimensions.height * 0.03,
                                height: dimensions.height * 0.03,
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginRight: dimensions.width * 0.03,
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{ fontFamily: fontSfProTextRegular, color: 'white', fontSize: dimensions.width * 0.04, textAlign: 'center', fontWeight: 700 }}>
                            Notifications
                        </Text>
                    </View>



                    <Switch
                        trackColor={{ false: '#948ea0', true: '#0875E6' }}
                        thumbColor={'#FFFFFF'}
                        ios_backgroundColor="#3E3E3E"
                        onValueChange={toggleNotificationSwitch}
                        value={isNotificationEnabled}
                    />
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <SafeAreaView
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        height: dimensions.height,
                        width: '100%',
                        paddingHorizontal: dimensions.width * 0.05,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        width: dimensions.width,
                        backgroundColor: '#000000',
                        zIndex: 1000,
                        shadowOpacity: 0.25,
                    }}
                >
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
                                setModalVisible(false);
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
                    </View>

                    <View style={{
                        width: dimensions.width * 0.93,
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}>
                        <Text style={{
                            fontFamily: fontSfProTextRegular,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: dimensions.width * 0.068,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.01,
                        }}
                        >
                            Favourites
                        </Text>
                        {favorites.length === 0 ? (
                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.059,
                                    fontFamily: fontSfProTextRegular,
                                    color: 'white',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontWeight: 800,
                                    marginTop: dimensions.height * 0.3,
                                }}>
                                No favorites yet.
                            </Text>
                        ) : (

                            <View style={{
                                width: dimensions.width * 0.93,
                                alignSelf: 'center',

                            }}>
                                <ScrollView style={{ width: '100%', }}>
                                    <View style={{
                                        width: dimensions.width * 0.93,
                                        alignSelf: 'center',
                                        flex: 1,
                                        marginTop: dimensions.height * 0.02,
                                        marginBottom: dimensions.height * 0.16,
                                    }}>

                                        {favorites.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => {

                                                }}
                                                style={{
                                                    alignSelf: 'center',
                                                    width: dimensions.width * 0.93,
                                                    marginBottom: dimensions.height * 0.014,
                                                    zIndex: 500,
                                                    backgroundColor: '#151515',
                                                    padding: dimensions.width * 0.02,
                                                    borderRadius: dimensions.width * 0.05,
                                                }}
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    alignSelf: 'center',
                                                }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: fontSfProTextRegular,
                                                            fontSize: dimensions.width * 0.043,
                                                            color: 'white',
                                                            padding: dimensions.width * 0.021,
                                                            fontWeight: 600,
                                                            maxWidth: dimensions.width * 0.6,
                                                        }}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {item.title}
                                                    </Text>

                                                    <TouchableOpacity onPress={() => handleDeleteFavourite(item.id)} style={{ zIndex: 1000, }}>

                                                        <Image
                                                            source={require('../assets/icons/fullBlueHeartIcon.png')}
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
                                                    flexDirection: 'row',
                                                    alignSelf: 'flex-start',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    paddingTop: 0,
                                                    paddingHorizontal: dimensions.width * 0.021,
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
                                                        {item.date}
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            fontFamily: 'SFPro-Medium',
                                                            fontSize: dimensions.width * 0.037,
                                                            color: '#999999',
                                                            opacity: 0.7,
                                                            paddingHorizontal: dimensions.width * 0.016,
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        •
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
                                                        {item.time}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        )}

                    </View>
                </SafeAreaView>
            </Modal>

        </View>
    );
};

export default SettingsScreen;
