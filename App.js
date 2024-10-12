import { StatusBar } from "expo-status-bar"; 
import { 
    Button, 
    StyleSheet, 
    Text, 
    View, 
    Share, 
    Alert, 
    Linking, 
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableHighlight
} from "react-native"; 

import * as Location from 'expo-location'; 
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

import { useEffect, useState } from "react"; 
import SearchContact from "./screens/SearchContact";



export default function App() { 

    const [contacts, setContacts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // State variable to store the user's location 
    const [location, setLocation] = useState(null); 

    // Function to fetch the user's location 
    const fetchLocation = async () => { 
        await Location.requestForegroundPermissionsAsync(); 

        const { 
            coords: { latitude, longitude }, 
        } = await Location.getCurrentPositionAsync(); 
        setLocation({ latitude, longitude }); 

        // Show an alert when the location is updated 
        Alert.alert("Safety App", "Location Updated", [ 
            { 
                text: "Close", 
                onPress: () => console.log("Close Pressed"), 
                style: "destructive", 
            }, 
        ]); 
    }; 

    // Function to share the user's location 
    const shareLocation = async () => { 
        try { 
            const result = await Share.share({ 
                // Create a Google Maps link using the user's location 
                message: 
`https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}`, 
            }); 

            if (result.action === Share.sharedAction) { 
                if (result.activityType) { 
                    console.log("shared with activity type of ", 
                        result.activityType); 
                } else { 
                    console.log("shared"); 
                } 
            } else if (result.action === Share.dismissedAction) { 
                console.log("dismissed"); 
            } 
        } catch (error) { 
        
            // Show an alert if there's an error while sharing location 
            Alert.alert( 
                "Safety App", 
                "Something went wrong while sharing location", 
                [ 
                    { 
                        text: "Close", 
                        onPress: () => console.log("Close Pressed"), 
                        style: "destructive", 
                    }, 
                ] 
            ); 
        } 
    }; 


    const loadContacts = async () => { 
        // setShowAppOptions(true);
        
        alert('Please select contacts.');
        
        let { status } = await Contacts.requestPermissionsAsync();

        alert(status);

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
            });
    
            if (data.length > 0) {
            setContacts(data);
            }
        }

        alert('contac fetched');

        return (
        <View style={styles.container}>
            {/* <View style={styles.imageContainer}>
            <ImageViewer imgSource={PlaceholderImage} selecrtedImage={selectedImage} />
            </View> */}
            {console.log("insdie return")}
            {showAppOptions ? (
            <View>
                    <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View>
                        <Text>{item.firstName}</Text>
                        {item.phoneNumbers && item.phoneNumbers.map((phone, index) => (
                            <Text key={index}>{phone.number}</Text>
                        ))}
                        </View>
                    )}
                    />
                </View>
            ) : ''}
        </View>
        );

    }; 

    //move this to component
    const showModal = () =>{
        return (
            <View style={{marginTop: 22}}>
              <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                  alert('Modal has been closed.');
                }}>
                <View style={{marginTop: 22}}>
                  <View>
                    <Text>Hello World!</Text>
      
                    <TouchableHighlight
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      <Text>Hide Modal</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
      
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Text>Show Modal</Text>
              </TouchableOpacity>
            </View>
            );
        

    }

    const sendSMS = async () =>{
      
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        // do your SMS stuff here
        const { result } = await SMS.sendSMSAsync(
          ['xxxxxxxxxx'],
          'My sample HelloWorld message',
          {
            attachments: {
              uri: 'path/myfile.png',
              mimeType: 'image/png',
              filename: 'myfile.png',
            },
          }
        );
      } else {
        // misfortune... there's no SMS available on this device
      }
    }

    const sendWhatsApp = () => {
      let msg = "type something";
      let phoneWithCountryCode = "xxxxxxxxxx";
    
      let mobile = 'xxxxxxxxx'
        // Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
      if (mobile) {
        if (msg) {
          let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
          Linking.openURL(url)
            .then(data => {
              console.log("WhatsApp Opened");
            })
            .catch(() => {
              alert("Make sure WhatsApp installed on your device");
            });
        } else {
          alert("Please insert message to send");
        }
      } else {
        alert("Please insert mobile no");
      }
    };

    // Fetch the user's location when the component mounts 
    useEffect(() => { 
        // requestAllPermissions();
        fetchLocation(); 
    }, []); 

    return ( 
        <View style={styles.container}> 
            <Text style={styles.heading}> 
                Your Safety App ;D
            </Text> 
            <Text style={styles.heading2}> 
                Share Location
            </Text> 
            {location ? ( 
                <View> 
                    <Text style={styles.text1}> 
                        Latitude: {location?.latitude} 
                    </Text> 
                    <Text style={styles.text1}> 
                        Longitude: {location?.longitude} 
                    </Text> 
                    <Button 
                        onPress={() => { 
                        
                            // Open Google Maps with the user's location 
                            Linking.openURL( 
`https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}` 
                            ); 
                        }} 
                        title="Open in Google Maps"
                    /> 
                </View> 
            ) : ( 
                <Text style={styles.text1}> 
                    Loading... 
                </Text> 
            )} 
        
        {/* <View>
          <TouchableOpacity 
            onPress={give_permissions} 
            style={{
                padding: 10,
                justifyContent: 'center'
            }}>
        
                <Text>Give Permission</Text>
            </TouchableOpacity>
        </View> */}

            <Button title="Update Location" onPress={fetchLocation} /> 
            <Button title="Share Location"  onPress={shareLocation} /> 

            <Button title="Share to Emergency Contacts"  onPress={sendSMS} /> 

            <Button title="Share to Whatsapp"  onPress={sendWhatsApp} />
            

            <Button theme="primary" title="Emergency Contact" onPress={loadContacts} />
 
            <Button theme="primary" title="Show Modal" onPress={() => {return showModal()} } />
            
            <StatusBar style="auto" /> 
        </View> 
    ); 
} 

const styles = StyleSheet.create({ 
    container: { 
        display: "flex", 
        alignContent: "center", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        backgroundColor: "#fff", 
        height: "100%", 
    }, 
    heading: { 
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 10, 
        color: "green", 
        textAlign: "center", 
    }, 
    heading2: { 
        fontSize: 22, 
        fontWeight: "bold", 
        marginBottom: 10, 
        color: "black", 
        textAlign: "center", 
    }, 
    text1: { 
        fontSize: 16, 
        marginBottom: 10, 
        color: "black", 
        fontWeight: "bold", 
    }, 
});

