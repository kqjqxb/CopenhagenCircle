import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const fontSfProTextRegular = 'SFProText-Regular';

import picnicPlaces from '../components/picnicPlaces';
import { ScrollView } from 'react-native-gesture-handler';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import { set } from 'date-fns';
import Swipeable from 'react-native-gesture-handler/Swipeable';





const PicnicsScreen = ({ setSelectedScreen, selectedScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const [selectedEventCategory, setSelectedEventCategory] = useState('General');
    const [selectedPicnicPlace, setSelectedPicnicPlace] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [heading, setHeading] = useState('');
    const [date, setDate] = useState('');


    const [picnics, setPicnics] = useState([]);
    const [activeSwipeableId, setActiveSwipeableId] = useState(null);
    const swipeableRefs = useRef(new Map());

    const loadPicnics = async () => {
        try {
            const existingPicnics = await AsyncStorage.getItem('picnics');
            if (existingPicnics) {
                setPicnics(JSON.parse(existingPicnics));
            }
        } catch (error) {
            console.error('Error loading picnics:', error);
        }
    };

    useEffect(() => {
        loadPicnics();
    }, [picnics, selectedScreen]);

    const savePicnic = async () => {
        try {
            const existingPicnics = await AsyncStorage.getItem('picnics');
            const picnics = existingPicnics ? JSON.parse(existingPicnics) : [];

            const maxId = picnics.length > 0 ? Math.max(...picnics.map(goal => goal.id)) : 0;

            const newPicnic = { id: maxId + 1, heading, date, selectedPicnicPlace: selectedPicnicPlace };

            picnics.unshift(newPicnic);

            await AsyncStorage.setItem('picnics', JSON.stringify(picnics));

            setPicnics(picnics);

            setModalVisible(false);
            setHeading('');
            setDate('');
            setSelectedPicnicPlace(null);
            setSelectedEventCategory('Created');
        } catch (error) {
            console.error('Error saving goal', error);
        }
    };


    const handleDateChange = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');

        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
        }
        if (cleaned.length > 4) {
            formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
        }

        if (cleaned.length >= 8) {
            const day = parseInt(cleaned.slice(0, 2), 10);
            const month = parseInt(cleaned.slice(2, 4), 10);
            const year = parseInt(cleaned.slice(4, 8), 10);

            const inputDate = new Date(year, month - 1, day);
            const currentDate = new Date();

            const isLeapYear = (year) => {
                return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            };

            const daysInMonth = (month, year) => {
                return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
            };

            if (month < 1 || month > 12) {
                Alert.alert('Error', 'Invalid month. Please enter a valid month (01-12).');
                formatted = '';
            } else if (day < 1 || day > daysInMonth(month, year)) {
                Alert.alert('Error', `Invalid day for the selected month. Please enter a valid day (01-${daysInMonth(month, year)}).`);
                formatted = '';
            } else if (inputDate < currentDate) {
                Alert.alert('Error', 'The date cannot be earlier than today.');
                formatted = '';
            } else if (year < 1950 || year > 2050) {
                formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.`;
            }
        }

        setDate(formatted);
    };


    const renderRightActions = (item) => (
        <TouchableOpacity
            onPress={() => removePicnic(item)}
            style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                width: dimensions.width * 0.19,
                bottom: '14%',
                height: '100%',
            }}
        >
            <Image
                source={require('../assets/icons/trashCopenIcon.png')}
                style={{
                    width: dimensions.height * 0.037,
                    height: dimensions.height * 0.037,
                }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );


    const removePicnic = async (picnicToRemove) => {
        try {
            const updatedPicnics = picnics.filter(fav =>
                !(fav.id === picnicToRemove.id)
            );
            await AsyncStorage.setItem('picnics', JSON.stringify(updatedPicnics));
            setPicnics(updatedPicnics);
        } catch (error) {
            console.error('Error removing checklist:', error);
            Alert.alert('Error', 'Failed to remove checklist from checklists.');
        }
    };


    const handleDotsPress = (id) => {
        swipeableRefs.current.forEach((ref, key) => {
            if (key !== id && ref) {
                ref.close();
            }
        });

        const currentRef = swipeableRefs.current.get(id);
        if (currentRef) {
            if (activeSwipeableId === id) {
                currentRef.close();
                setActiveSwipeableId(null);
            } else {
                currentRef.openRight();
                setActiveSwipeableId(id);
            }
        }
    };

    const handleSwipeableOpen = (id) => {
        swipeableRefs.current.forEach((ref, key) => {
            if (key !== id && ref) {
                ref.close();
            }
        });
        setActiveSwipeableId(id);
    };

    const handleSwipeableClose = (id) => {
        if (activeSwipeableId === id) {
            setActiveSwipeableId(null);
        }
    };

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
                    marginLeft: dimensions.width * 0.12,
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


            {selectedEventCategory === 'General' ? (
                <>

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

                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        disabled={selectedPicnicPlace === null}
                        style={{
                            width: dimensions.width * 0.95,
                            height: dimensions.height * 0.07,
                            backgroundColor: '#0875E6',
                            borderRadius: dimensions.width * 0.037,
                            position: 'absolute',
                            bottom: '16%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            opacity: selectedPicnicPlace === null ? 0.9 : 1,
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
                </>
            ) : selectedEventCategory === 'Created' && picnics.length > 0 ? (
                <ScrollView>
                    <View style={{
                        width: dimensions.width,
                        flex: 1,
                        marginBottom: dimensions.height * 0.3,
                        paddingTop: dimensions.width * 0.04,
                    }}>

                        {picnics.map((item, index) => (
                            <Swipeable
                                key={item.id}
                                ref={(ref) => {
                                    if (ref) {
                                        swipeableRefs.current.set(item.id, ref);
                                    } else {
                                        swipeableRefs.current.delete(item.id);
                                    }
                                }}
                                renderRightActions={() => renderRightActions(item)}
                                onSwipeableOpen={() => handleSwipeableOpen(item.id)}
                                onSwipeableClose={() => handleSwipeableClose(item.id)}
                            >

                                <View
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
                                        source={item.selectedPicnicPlace.image}
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
                                    <TouchableOpacity
                                        onPress={() => handleDotsPress(item.id)}
                                        style={{
                                            zIndex: 100,
                                            right: dimensions.width * 0.014,
                                            alignItems: 'center',
                                            maxWidth: '10%',
                                            position: 'absolute',
                                            top: '5%',
                                            right: '5%',

                                        }}>
                                        <Image
                                            source={require('../assets/icons/tablerDotsIcon.png')}
                                            style={{
                                                width: dimensions.height * 0.043,
                                                height: dimensions.height * 0.043,
                                                textAlign: 'center'
                                            }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Text
                                            style={{
                                                fontFamily: fontSfProTextRegular,
                                                fontSize: dimensions.width * 0.043,
                                                color: 'white',
                                                padding: dimensions.width * 0.021,
                                                fontWeight: 600,
                                                maxWidth: dimensions.width * 0.7, 
                                            }}
                                            numberOfLines={1} 
                                            ellipsizeMode="tail" 
                                        >
                                            {item.heading}
                                        </Text>


                                        {/* <Text
                                            style={{
                                                fontFamily: fontSfProTextRegular,
                                                fontSize: dimensions.width * 0.043,
                                                color: 'white',
                                                padding: dimensions.width * 0.021,
                                                fontWeight: 600,
                                            }}
                                        >
                                            •
                                        </Text> */}


                                        <Text
                                            style={{
                                                fontFamily: fontSfProTextRegular,
                                                fontSize: dimensions.width * 0.037,
                                                color: 'white',
                                                fontStyle: 'italic',

                                                fontWeight: 500,
                                                paddingHorizontal: dimensions.width * 0.021,
                                                textDecorationLine: 'underline',
                                            }}
                                        >
                                            {item.date}
                                        </Text>

                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: fontSfProTextRegular,
                                            fontSize: dimensions.width * 0.039,
                                            color: 'white',
                                            paddingHorizontal: dimensions.width * 0.021,
                                            paddingVertical: dimensions.height * 0.003,
                                            fontWeight: 600,
                                            opacity: 0.8
                                        }}
                                    >
                                        {item.selectedPicnicPlace.title}
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
                                        {item.selectedPicnicPlace.address}
                                    </Text>

                                    {/* <Text
                                        style={{
                                            fontFamily: fontSfProTextRegular,
                                            fontSize: dimensions.width * 0.037,
                                            color: '#999999',
                                            opacity: 0.7,
                                            fontWeight: 500,
                                            paddingHorizontal: dimensions.width * 0.021,
                                        }}
                                    >
                                        {item.date}
                                    </Text> */}
                                </View>
                            </Swipeable>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View>

                </View>
            )}



            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <SafeAreaView
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingHorizontal: dimensions.width * 0.05,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        width: dimensions.width,
                        zIndex: 1000,
                        backgroundColor: '#000000',
                        height: dimensions.height,
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
                                setSelectedPicnicPlace(null);
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
                            New picnic
                        </Text>

                        <Text style={{
                            fontFamily: fontSfProTextRegular,
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.04,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.025,
                        }}
                        >
                            Heading
                        </Text>

                        <TextInput
                            placeholder="Heading"
                            value={heading}
                            onChangeText={setHeading}
                            placeholderTextColor="#999999"
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: dimensions.width * 0.035,
                                paddingHorizontal: dimensions.width * 0.04,
                                backgroundColor: '#161616',
                                borderRadius: dimensions.width * 0.03,
                                width: '100%',
                                color: 'white',
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.041,
                                fontWeight: 400,
                                textAlign: 'left',
                                marginTop: dimensions.height * 0.01,
                            }}
                        />

                        <Text style={{
                            fontFamily: fontSfProTextRegular,
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.04,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.025,
                        }}
                        >
                            Date
                        </Text>

                        <TextInput
                            placeholder="DD.MM.YYYY"
                            value={date}
                            onChangeText={handleDateChange}
                            placeholderTextColor="#999999"
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: dimensions.width * 0.035,
                                paddingHorizontal: dimensions.width * 0.04,
                                backgroundColor: '#161616',
                                borderRadius: dimensions.width * 0.03,
                                width: '100%',
                                color: 'white',
                                fontFamily: fontSfProTextRegular,
                                fontSize: dimensions.width * 0.041,
                                fontWeight: 400,
                                textAlign: 'left',
                                marginTop: dimensions.height * 0.01,
                            }}
                        />


                        <Text style={{
                            fontFamily: fontSfProTextRegular,
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.04,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.025,
                        }}
                        >
                            Location
                        </Text>
                        <View
                            onPress={() => {
                                setSelectedPicnicPlace(item);
                            }}
                            style={{
                                alignSelf: 'center',
                                width: dimensions.width * 0.95,
                                marginTop: dimensions.height * 0.016,
                                zIndex: 500,
                            }}
                        >


                            <Image
                                source={selectedPicnicPlace?.image}
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

                            <Text
                                style={{
                                    fontFamily: fontSfProTextRegular,
                                    fontSize: dimensions.width * 0.043,
                                    color: 'white',
                                    padding: dimensions.width * 0.021,
                                    fontWeight: 600,
                                }}
                            >
                                {selectedPicnicPlace?.title}
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
                                {selectedPicnicPlace?.address}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        disabled={heading === '' || date === ''}
                        onPress={savePicnic}
                        style={{
                            width: dimensions.width * 0.93,
                            height: dimensions.height * 0.07,
                            backgroundColor: '#0875E6',
                            borderRadius: dimensions.width * 0.037,
                            position: 'absolute',
                            bottom: '7%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            opacity: heading === '' || date === '' ? 0.5 : 1,
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
                            Save
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

        </View>
    );
};

export default PicnicsScreen;
