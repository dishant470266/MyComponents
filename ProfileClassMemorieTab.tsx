import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ClassMemorieesApi from '../apis/ClassMemorieesAPI';
import MemoryCarousel from '../components/MemoryCarousel';
import {formatDate} from '../rnlil/packages/utils/DateUtil';

interface ProfilePersonalTabProps {
  themeDetail: any;
  user: any;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const currentMonthDay = new Date().getMonth();
let currentMon = new Date().getMonth();

const ProfileClassMemorieTab = ({
  themeDetail,
  user,
}: ProfilePersonalTabProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({});
  const [memory, setMemory] = useState({});
  const [current, setCurrent] = useState(0);
  const [indicator, setIndicator] = useState(false);
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({
    startDate: '',
    endDate: '',
    month: -1,
    name: '',
  });

  console.log(currentMonth, 'i am current Mount');

  console.log('i am start', memory, 'i am the data');

  useEffect(() => {
    // getClassMemory();
    getFirstandLastDayOfMonth();
  }, []);

  const getFirstandLastDayOfMonth = () => {
    const month = [
      {
        date: 0,
        name: 'January',
      },
      {
        date: 1,
        name: 'Feburary',
      },
      {
        date: 2,
        name: 'March',
      },
      {
        date: 3,
        name: 'April',
      },
      {
        date: 4,
        name: 'May',
      },
      {
        date: 5,
        name: 'June',
      },
      {
        date: 6,
        name: 'July',
      },
      {
        date: 7,
        name: 'August',
      },
      {
        date: 8,
        name: 'September',
      },
      {
        date: 9,
        name: 'October',
      },
      {
        date: 10,
        name: 'November',
      },
      {
        date: 11,
        name: 'December',
      },
    ];
    let array: any = [];
    month.forEach(item => {
      const date = new Date();
      let firstDay = new Date(
        date.getFullYear(),
        date.getMonth() + item.date - 1,
        1,
      );
      let lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + item.date,
        0,
      );
      const obj = {
        startDate: firstDay,
        endDate: lastDay,
        month: item.date,
        name: item.name,
      };
      array.push(obj);
      setDates(array);
    });
    const index = array.findIndex(item => item.month === currentMonthDay);
    if (index > -1) {
      setCurrentMonth(array[index]);
      getClassMemory(array[index]);
    }
  };

  const getClassMemory = async (ob: any) => {
    try {
      const obj = {
        endDate: ob.endDate,
        startDate: ob.startDate,
        skip: 0,
        limit: 10,
      };

      // setIndicator(true);

      const dataList = await ClassMemorieesApi.getClassMemories(obj);
      setMemory(dataList.data.result);

      dataList.data.result.forEach(ele => {
        ele.date = formatDate(ele.creationTime, 'dd-MMM-yy');
      });
      // setIndicator(false);
    } catch (error) {
      // setIndicator(false);
      console.log(error, 'ndcjc');
    }
  };

  const handle = ({item}) => {
    setModalVisible(true);
    setData(item);
  };

  const getFirstWord = (name: String) => {
    if (name) {
      let matches = name && name.match(/\b(\w)/g);
      const acronym = matches && matches.join('');
      return acronym;
    }
  };

  const ty = type => {
    if (type === 'prev') {
      if (currentMon >= 0) {
        currentMon--;
        if (currentMon > -1) {
          const item = dates.filter(item => item.month === currentMon)[0];
          setCurrentMonth(item);
          getClassMemory(item);
        }
      }
    } else if (type === 'forward') {
      if (currentMon < currentMonthDay) {
        currentMon++;
        if (currentMon < 12) {
          const item = dates.filter(item => item.month === currentMon)[0];
          setCurrentMonth(item);
          getClassMemory(item);
        }
      }
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={styles.calendarContainer}>
          <TouchableOpacity
            style={[
              styles.arrow,
              {
                backgroundColor: currentMonth.month
                  ? themeDetail.bottomBar.bgColor
                  : 'grey',
                // current == 0 ? 'grey' : themeDetail.bottomBar.bgColor,
              },
            ]}
            disabled={currentMonth.month ? false : true}
            onPress={() => ty('prev')}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.calendartext}>{currentMonth.name}</Text>
          <TouchableOpacity
            style={[
              styles.arrow,
              {
                backgroundColor: currentMonth.month
                  ? 'grey'
                  : themeDetail.bottomBar.bgColor,
                // current == 11 ? 'grey' : themeDetail.bottomBar.bgColor,

                // opacity: currentMonth.month < currentMonthDay ? 1 : 0.5,
              },
            ]}
            disabled={currentMonth.month ? true : false}
            onPress={() => ty('forward')}>
            <Icon name="arrow-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {memory !== 'undefined' && !memory.length ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              marginTop: '50%',
            }}>
            <Text
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: 'grey',
              }}>
              No Merories
            </Text>
          </View>
        ) : (
          <View style={styles.calendarContainer2}>
            <FlatList
              data={memory}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => handle({item})}>
                  {item.image != undefined ? (
                    <View key={index} style={styles.imageContainer}>
                      <Image
                        resizeMode="cover"
                        source={{uri: item.image[0]}}
                        style={styles.image}
                      />
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {data ? (
        <View style={styles.centeredView}>
          <ScrollView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.modalView}>
                <View style={styles.modalheader}>
                  <View
                    style={[
                      styles.userContainer,
                      {backgroundColor: themeDetail.bannerBGColor},
                    ]}>
                    <Text style={styles.usermodal}>
                      {getFirstWord(data && data.roleName)}
                    </Text>
                  </View>
                  <View style={styles.userName}>
                    <Text style={styles.name} numberOfLines={1}>
                      {data.userName}
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <Text style={{marginLeft: 10}}>{data.date}</Text>
                    </View>
                  </View>
                  <View style={styles.closeIcon}>
                    <Icon
                      onPress={() => setModalVisible(!modalVisible)}
                      name="close"
                      color="#000"
                      size={40}
                      style={{alignSelf: 'center', marginTop: 5}}
                    />
                  </View>
                </View>
                <ScrollView
                  style={{flex: 1, width: '100%'}}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      margin: 10,
                      alignSelf: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={styles.title}>Classroom activities</Text>
                    {data.description ? (
                      <Text style={styles.description}>{data.description}</Text>
                    ) : null}
                    <MemoryCarousel data={data.image} />
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </ScrollView>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ProfileClassMemorieTab;

const styles = StyleSheet.create({
  arrow: {
    borderRadius: 50 / 2,
    height: 38,
    width: 38,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    justifyContent: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: (Dimensions.get('screen').width * 90) / 100,
    width: '95%',
    alignSelf: 'center',
    // left: (Dimensions.get('screen').width * 5) / 100,
    marginTop: 15,
  },
  calendarContainer2: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendartext: {
    textAlignVertical: 'center',
    fontSize: 18,
    paddingLeft: 20,
    borderRadius: 50,
    color: '#000',
    backgroundColor: '#CCC',
    paddingRight: 20,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 10,
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    left: (Dimensions.get('screen').width * 1) / 100,
  },
  image: {
    width: (Dimensions.get('screen').width * 29) / 100,
    height: (Dimensions.get('screen').width * 30) / 100,
    margin: 4,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },

  // ----------------------------------------ModalStyle

  centeredView: {
    flex: 1,
  },
  description: {
    marginTop: 15,
    fontSize: 15,
    textAlign: 'justify',
    left: 3,
    width: Dimensions.get('screen').width * 0.86,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  name: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalheader: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
  },
  userContainer: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  usermodal: {
    fontSize: 25,
    textAlign: 'center',
    color: '#fff',
    textAlignVertical: 'center',
  },
  userName: {
    flexDirection: 'column',
    alignSelf: 'center',
    flex: 1,
  },
  closeIcon: {
    width: '20%',
    height: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: -15,
  },
  title: {
    marginTop: 5,
    fontSize: 19,
    left: 3,
    width: Dimensions.get('screen').width * 0.86,
  },
});
