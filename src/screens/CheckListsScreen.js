import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
const fontSfProTextRegular = 'SFProText-Regular';
import Swipeable from 'react-native-gesture-handler/Swipeable';




const CheckListsScreen = ({ setSelectedScreen, selectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [modalVisible, setModalVisible] = useState(false);
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [checklists, setChecklists] = useState([]);
    const [activeSwipeableId, setActiveSwipeableId] = useState(null);
    const swipeableRefs = useRef(new Map());






    const loadChecklists = async () => {
        try {
            const existingChecklists = await AsyncStorage.getItem('checklists');
            if (existingChecklists) {
                setChecklists(JSON.parse(existingChecklists));
            }
        } catch (error) {
            console.error('Error loading checklists:', error);
        }
    };

    const removeChecklist = async (checklistToRemove) => {
        try {
            const updatedChecklists = checklists.filter(list =>
                !(list.heading === checklistToRemove.heading && list.description === checklistToRemove.description && list.id === checklistToRemove.id)
            );
            await AsyncStorage.setItem('checklists', JSON.stringify(updatedChecklists));
            setChecklists(updatedChecklists);
        } catch (error) {
            console.error('Error removing checklist:', error);
            Alert.alert('Error', 'Failed to remove checklist from checklists.');
        }
    };

    useEffect(() => {
        loadChecklists();
    }, [checklists, selectedScreen]);


    const saveChecklist = async () => {
        try {
            const existingChecklists = await AsyncStorage.getItem('checklists');
            const checklists = existingChecklists ? JSON.parse(existingChecklists) : [];

            const maxId = checklists.length > 0 ? Math.max(...checklists.map(list => list.id)) : 0;

            const newChecklist = { id: maxId + 1, heading, description };

            checklists.unshift(newChecklist);

            await AsyncStorage.setItem('checklists', JSON.stringify(checklists));

            setModalVisible(false);
            setHeading('');
            setDescription('');
        } catch (error) {
            console.error('Error saving checklist', error);
        }
    };


    useEffect(() => {
        const loadChecklists = async () => {
            try {
                const existingChecklists = await AsyncStorage.getItem('checklists');
                if (existingChecklists) {
                    setChecklists(JSON.parse(existingChecklists));
                }
            } catch (error) {
                console.error('Error loading checklists', error);
            }
        };

        loadChecklists();
    }, [checklists, selectedScreen]);


    const renderRightCheckListActions = (item) => (
        <TouchableOpacity
            onPress={() => removeChecklist(item)}
            style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                width: 70,
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
                    marginLeft: dimensions.width * 0.22,
                }}
                >
                    My checklists
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

            {checklists.length !== 0 ? (
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        flex: 1,
                        marginTop: dimensions.height * 0.02,
                        marginBottom: dimensions.height * 0.16,
                    }}>
                        {checklists.map((list, index) => (
                            <Swipeable
                                key={list.id}
                                ref={(ref) => {
                                    if (ref) {
                                        swipeableRefs.current.set(list.id, ref);
                                    } else {
                                        swipeableRefs.current.delete(list.id);
                                    }
                                }}
                                renderRightActions={() => renderRightCheckListActions(list)}
                                onSwipeableOpen={() => handleSwipeableOpen(list.id)}
                                onSwipeableClose={() => handleSwipeableClose(list.id)}
                            >

                                <View key={index} style={{
                                    width: '91%',
                                    alignSelf: 'center',
                                    backgroundColor: '#151515',
                                    borderRadius: dimensions.width * 0.046,
                                    position: 'relative',
                                    zIndex: 1,
                                    alignItems: 'center',
                                    paddingVertical: dimensions.width * 0.05,
                                    paddingHorizontal: dimensions.width * 0.055,
                                    marginVertical: dimensions.height * 0.01,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <View style={{
                                        maxWidth: '86%'
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: dimensions.width * 0.043,
                                                fontFamily: fontSfProTextRegular,
                                                color: 'white',
                                                textAlign: 'left',
                                                alignSelf: 'flex-start',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontWeight: 800,
                                                paddingHorizontal: dimensions.width * 0.012,
                                            }}>
                                            {list.heading}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: dimensions.width * 0.037,
                                                fontFamily: fontSfProTextRegular,
                                                color: 'white',
                                                opacity: 0.7,
                                                textAlign: 'left',
                                                alignSelf: 'flex-start',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontWeight: 400,
                                                paddingHorizontal: dimensions.width * 0.012,
                                                marginTop: dimensions.height * 0.01,
                                            }}>
                                            {list.description}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDotsPress(list.id)}
                                        style={{
                                            zIndex: 100,
                                            right: dimensions.width * 0.014,
                                            alignItems: 'center',
                                            maxWidth: '10%',

                                        }}>
                                        <Image
                                            source={require('../assets/icons/tablerDotsIcon.png')}
                                            style={{
                                                width: dimensions.height * 0.05,
                                                height: dimensions.height * 0.05,
                                                textAlign: 'center'
                                            }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Swipeable>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View>
                    <Image
                        resizeMode='contain'
                        source={require('../assets/icons/emptyChecklist.png')}
                        style={{
                            width: dimensions.width * 0.34,
                            height: dimensions.width * 0.34,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.19,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: dimensions.width * 0.037,
                            fontFamily: fontSfProTextRegular,
                            color: 'white',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontWeight: 500,
                            marginTop: dimensions.height * 0.03,
                            paddingHorizontal: dimensions.width * 0.19,
                        }}>
                        There aren’t any checklists yet, create something
                    </Text>




                </View>


            )}




            <TouchableOpacity
                onPress={() => { setModalVisible(true) }}
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
                    Create new checklist
                </Text>
            </TouchableOpacity>


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
                            New checklist
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
                            Description
                        </Text>


                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
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

                    </View>

                    <TouchableOpacity
                        disabled={heading === '' || description === ''}
                        onPress={saveChecklist}
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
                            opacity: heading === '' || description === '' ? 0.5 : 1,
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

export default CheckListsScreen;
