import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';





import FavouritesScreen from './FavouritesScreen';
import HoroscopeDetailsScreen from './HoroscopeDetailsScreen';
import ProfileScreen from './ProfileScreen';
import StarDetailsScreen from './StarDetailsScreen';
import EventDetailsScreen from './EventDetailsScreen';
import CalendarScreen from './CalendarScreen';
import PicnicsScreen from './PicnicsScreen';
import CheckListsScreen from './CheckListsScreen';
import GoalsScreen from './GoalsScreen';


const homePagesButtons = [
  { screen: 'Home', iconImage: require('../assets/icons/buttons/eventsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedEvents.png') },
  { screen: 'Picnics', iconImage: require('../assets/icons/buttons/picnicsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedPicnics.png') },
  { screen: 'Checklists', iconImage: require('../assets/icons/buttons/checklistsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedChecklists.png') },
  { screen: 'Goals', iconImage: require('../assets/icons/buttons/goalsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedGoals.png') },
  { screen: 'Settings', iconImage: require('../assets/icons/buttons/settingsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedSettings.png') },
];




const fontSfProTextRegular = 'SFProText-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const [selectedStar, setSelectedStar] = useState(null);
  const [storageImage, setStorageImage] = useState(null);
  const [selectedZodiac, setSelectedZodiac] = useState(null);



  const [selectedEvent, setSelectedEvent] = useState('Markets');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedEvent]);


  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await AsyncStorage.getItem('UserProfile');
        if (userProfile !== null) {
          const { image } = JSON.parse(userProfile);

          setStorageImage(image);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [selectedScreen]);

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#000000',
      width: dimensions.width
    }}>

      {selectedScreen === 'Home' ? (
        <View style={{
          width: dimensions.width,
        }}>
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
              Copenhagen events
            </Text>
            <TouchableOpacity onPress={() => {
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


          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <View style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              {['Markets', 'Festivals', 'Bike Rides', 'Cleaning'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={{
                    paddingHorizontal: dimensions.width * 0.025,
                    borderRadius: dimensions.width * 0.1,

                    marginLeft: category === 'Markets' ? dimensions.width * 0.028 : 0,
                  }}
                  onPress={() => {
                    setSelectedEvent(`${category}`);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fontSfProTextRegular,
                      fontSize: dimensions.width * 0.043,
                      color: selectedEvent === category ? '#DD0326' : '#999999',
                      paddingTop: dimensions.width * 0.04,
                      textDecorationLine: selectedEvent === category ? 'underline' : 'none',
                      textDecorationStyle: 'solid',
                      fontWeight: 400
                    }}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: dimensions.height * 0.021,
              width: '100%',
            }}
          >
            <View style={{ marginBottom: dimensions.height * 0.25, width: '100%', }}>

              {/* {data.map((item, index) => ( */}
              <TouchableOpacity
                // key={index}
                onPress={() => {
                  // setSelectedEvent(item); 
                  setSelectedScreen('EventDetails')
                }}
                style={{
                  alignSelf: 'center',
                  width: dimensions.width * 0.95,
                  marginBottom: dimensions.height * 0.01,
                  zIndex: 500
                }}
              >


                <Image
                  source={require('../assets/images/eventImage.png')}
                  style={{
                    width: dimensions.width * 0.97,
                    height: dimensions.height * 0.23,
                    alignSelf: 'center',
                    textAlign: 'center',
                    borderRadius: dimensions.width * 0.055,
                  }}
                  resizeMode="stretch"
                />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: dimensions.width * 0.97,
                }}>
                  <Text
                    style={{
                      fontFamily: fontSfProTextRegular,
                      fontSize: dimensions.width * 0.043,
                      color: 'white',
                      padding: dimensions.width * 0.021,
                      fontWeight: 600,
                    }}
                  >
                    Copenhagen Ecological Market
                  </Text>

                  <TouchableOpacity onPress={() => savePlace(item)} style={{ zIndex: 1000, }}>

                    <Image
                      source={require('../assets/icons/blueHeartIcon.png')}
                      style={{
                        width: dimensions.height * 0.08,
                        height: dimensions.width * 0.08,
                        textAlign: 'center',
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
                    May 15, 2025
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
                    10:00 AM
                  </Text>
                </View>
              </TouchableOpacity>
              {/* ))} */}
            </View>
          </ScrollView>










        </View>
      ) : selectedScreen === 'Profile' ? (
        <ProfileScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Map' ? (
        <MapScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedStar={selectedStar} setSelectedStar={setSelectedStar} />
      ) : selectedScreen === 'StarDetails' ? (
        <StarDetailsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedStar={selectedStar} setSelectedStar={setSelectedStar} />
      ) : selectedScreen === 'Favourites' ? (
        <FavouritesScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'HoroscopeDetails' ? (
        <HoroscopeDetailsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : selectedScreen === 'EventDetails' ? (
        <EventDetailsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : selectedScreen === 'Calendar' ? (
        <CalendarScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : selectedScreen === 'Picnics' ? (
        <PicnicsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : selectedScreen === 'Checklists' ? (
        <CheckListsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : selectedScreen === 'Goals' ? (
        <GoalsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} selectedZodiac={selectedZodiac} setSelectedZodiac={setSelectedZodiac} />
      ) : null}

      {selectedScreen !== 'StarDetails' && selectedScreen !== 'HoroscopeDetails' && (

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            paddingBottom: dimensions.height * 0.03,
            paddingTop: dimensions.height * 0.019,
            paddingHorizontal: dimensions.width * 0.03,
            backgroundColor: '#151515',
            width: dimensions.width,


            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: dimensions.height * 0.004,
            zIndex: 5000

          }}
        >
          {homePagesButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedScreen(button.screen)}
              style={{
                borderRadius: dimensions.width * 0.5,
                padding: dimensions.height * 0.019,
                alignItems: 'center',
                marginHorizontal: dimensions.width * 0.001,

              }}
            >
              <Image
                source={selectedScreen === button.screen ? button.selectedIconImage : button.iconImage}
                style={{
                  width: dimensions.height * 0.03,
                  height: dimensions.height * 0.03,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontSfProTextRegular,
                  fontSize: dimensions.width * 0.028,
                  color: selectedScreen === button.screen ? '#0875E6' : '#999999',
                  marginTop: dimensions.height * 0.008,
                  fontWeight: 600
                }}
              >
                {button.screen}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
