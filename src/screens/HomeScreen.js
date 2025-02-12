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



import SettingsScreen from './SettingsScreen';
import EventDetailsScreen from './EventDetailsScreen';
import CalendarScreen from './CalendarScreen';
import PicnicsScreen from './PicnicsScreen';
import CheckListsScreen from './CheckListsScreen';
import GoalsScreen from './GoalsScreen';

import marketsData from '../components/marketsData';
import festivalsData from '../components/festivalsData';
import bikeRidesData from '../components/bikeRidesData';
import cleaningData from '../components/cleaningData';


const homePagesButtons = [
  { screen: 'Home', iconImage: require('../assets/icons/buttons/eventsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedEvents.png') },
  { screen: 'Picnics', iconImage: require('../assets/icons/buttons/picnicsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedPicnics.png') },
  { screen: 'Checklists', iconImage: require('../assets/icons/buttons/checklistsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedChecklists.png') },
  { screen: 'Goals', iconImage: require('../assets/icons/buttons/goalsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedGoals.png') },
  { screen: 'Settings', iconImage: require('../assets/icons/buttons/settingsIcon.png'), selectedIconImage: require('../assets/icons/selectedBut/selectedSettings.png') },
];

const allData = [...marketsData, ...festivalsData, ...bikeRidesData, ...cleaningData];


const fontSfProTextRegular = 'SFProText-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedEventCategory, setSelectedEventCategory] = useState('Markets');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchStorageFavourites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Error  favorites:', error);
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
    console.log('allData:', allData);
  }, [])


  const loadSettings = async () => {
    try {
      const notificationValue = await AsyncStorage.getItem('isNotificationEnabled');

      if (notificationValue !== null) setNotificationEnabled(JSON.parse(notificationValue));
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };


  const getDataByCategory = (category) => {
    switch (category) {
      case 'Markets':
        return marketsData;
      case 'Festivals':
        return festivalsData;
      case 'Bike Rides':
        return bikeRidesData;
      case 'Cleaning':
        return cleaningData;
      default:
        return [];
    }
  };

  const data = getDataByCategory(selectedEventCategory);


  useEffect(() => {
    console.log('favorites:', favorites);
  }, [favorites]);

  useEffect(() => {
    loadSettings();
  }, [isNotificationEnabled, selectedScreen]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedEventCategory]);





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
            alignSelf: 'center',
            paddingTop: dimensions.height * 0.057,
            paddingHorizontal: dimensions.width * 0.05,
            paddingVertical: dimensions.height * 0.01,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: dimensions.width * 0.01,
            alignItems: 'center',
            backgroundColor: '#151515',
            borderRadius: dimensions.width * 0.05,
          }}>
            <Text style={{
              textAlign: 'center',
              fontFamily: fontSfProTextRegular,
              fontWeight: 700,
              fontSize: dimensions.width * 0.064,
              alignItems: 'center',
              alignSelf: 'center',
              color: 'white',
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
                  textAlign: 'center',
                  height: dimensions.height * 0.03,
                  margin: dimensions.height * 0.014,
                  alignSelf: 'center',
                  width: dimensions.height * 0.03,
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
                    setSelectedEventCategory(`${category}`);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fontSfProTextRegular,
                      fontSize: dimensions.width * 0.043,
                      color: selectedEventCategory === category ? '#DD0326' : '#999999',
                      paddingTop: dimensions.width * 0.04,
                      textDecorationLine: selectedEventCategory === category ? 'underline' : 'none',
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

              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedEvent(item);
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
                    source={item.image}
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
                        maxWidth: dimensions.width * 0.8,
                      }}
                    >
                      {item.title}
                    </Text>

                    <TouchableOpacity onPress={() => saveFavourite(item)} style={{ zIndex: 1000, }}>

                      <Image
                        source={isThisFavourite(item)
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
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isNotificationEnabled={isNotificationEnabled} setNotificationEnabled={setNotificationEnabled} allData={allData}
          favorites={favorites} setFavorites={setFavorites}
        />
      ) : selectedScreen === 'EventDetails' ? (
        <EventDetailsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} favorites={favorites} setFavorites={setFavorites}
          selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
        />
      ) : selectedScreen === 'Calendar' ? (
        <CalendarScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Picnics' ? (
        <PicnicsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Checklists' ? (
        <CheckListsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Goals' ? (
        <GoalsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : null}


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
    </View>
  );
};

export default HomeScreen;
