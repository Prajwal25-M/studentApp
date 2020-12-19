import React,{useState} from 'react';
import { StyleSheet, Text, View,Modal,Alert,KeyboardAvoidingView} from 'react-native';
import {TextInput,Button} from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


const CreateStudent = ({navigation,route})=>{
    const getDetails = (type)=> {
        if(route.params){
            switch(type){
                case "name":
                    return route.params.name
                case "phone":
                    return route.params.phone
                case "email":
                    return route.params.email
                case "USN":
                    return route.params.USN
                case "picture":
                    return route.params.picture
                case "semester":
                    return route.params.semester
                    
            }
        }
        return ""
    }

    
    const [name,setName] = useState(getDetails("name"))
    const [phone,setphone] = useState(getDetails("phone"))
    const [USN,setUSN] = useState(getDetails("USN"))
    const [email,setEmail] = useState(getDetails("email"))
    const [picture,setPicture] = useState(getDetails("picture"))
    const [semester,setsemester] = useState(getDetails("semester"))
    const [modal,setModal] = useState(false)
    const [enableshift,setenableShift] = useState(false)

   
        const submitData = ()=>{
            fetch("http://10.0.2.2:3000/send-data",{
                method:"post",
                headers:{
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                name,
                phone,
                USN,
                email,
                picture,
               semester
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert(`${data.name}is saved successfully`)
            navigation.navigate("Home")
        })
        .catch(err=>{
            Alert.alert("somethis went wrong")
     })
    }
    const updateDetails = ()=>{
        fetch("http://10.0.2.2:3000/update",{
            method:"post",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id:route.params._id,
                name,
                email,
                phone,
                picture,
                USN,
                semester
            })
        })
        .then(res=>res.json())
        .then(data=>{
            Alert.alert(`${data.name}is updated successfully`)
            navigation.navigate("Home")
        })
        .catch(err=>{
            Alert.alert("somethis went wrong in updateing")
     })

    }
    const pickFromGallery = async()=>{
    const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
          let data =  await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                aspect:[1,1],
                quality:0.5
            })
            if(!data.cancelled){
                let newfile ={
                    uri:data.uri,
                    type:`test/${data.uri.split(".")[1]}`,
                    name:`test.${data.uri.split(".")[1]}`
                }
                handleUpload(newfile)
            }
        }
        else{
            Alert.alert("you need to give permission to work")
        }
    }

    const pickFromCamra = async()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
            if(granted){
              let data =  await ImagePicker.launchCameraAsync({
                    mediaTypes:ImagePicker.MediaTypeOptions.Images,
                    allowsEditing:true,
                    aspect:[1,1],
                    quality:0.5
                })
                if(!data.cancelled){
                    let newfile ={
                        uri:data.uri,
                        type:`test/${data.uri.split(".")[1]}`,
                        name:`test.${data.uri.split(".")[1]}`
                    }
                    handleUpload(newfile)
                }
            }
            else{
                Alert.alert("you need to give permission to work")
            }
        }

        const handleUpload =(image)=>{
            const data =new FormData()
            data.append('file',image)
            data.append('upload_preset','studentApp')
            data.append("cloud_name","falcon123")

            fetch("https://api.cloudinary.com/v1_1/falcon123/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json()).
            then(data=>{
                setPicture(data.url)
                setModal(false)
            }).catch(err=>{
                Alert.alert("error while uploading")
              })
        }

    return(
        <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}> 
        <View >
           <TextInput
                label='Name'
                style={styles.inputStyle}
                theme={theme}
                value={name}
                
                mode="outlined"
                onChangeText={text => setName(text)}
             />
             <TextInput
                label='phone'
                style={styles.inputStyle}
                theme={theme}
                keyboardType="number-pad"
                value={phone}
                
                mode="outlined"
                onChangeText={text => setphone(text)}
             />
              <TextInput
                label='E-mail'
                style={styles.inputStyle}
                theme={theme}
                value={email}
                
                mode="outlined"
                onChangeText={text => setEmail(text)}
             />
              <TextInput
                label='USN'
                style={styles.inputStyle}
                theme={theme}
                value={USN}
                onFocus={()=>setenableShift(true)}
                mode="outlined"
                onChangeText={text => setUSN(text)}
             />
             <TextInput
                label='semester'
                style={styles.inputStyle}
                theme={theme}
                value={semester}
                onFocus={()=>setenableShift(true)}
                mode="outlined"
                onChangeText={text => setsemester(text)}
             />
            <Button style={styles.inputStyle}
            icon={picture==""?"upload":"check"}
            mode="contained"
            theme={theme}
            onPress={() => setModal(true)}>
               Upload Image
             </Button>

              {route.params?
               <Button
               style={styles.inputStyle}
               icon="content-save"
               mode="contained" 
               theme={theme}
               onPress={() => updateDetails()}>
                 Update details
                </Button>
                :
                <Button
               style={styles.inputStyle}
               icon="content-save"
               mode="contained" 
               theme={theme}
                onPress={() => submitData()}>
                 save
                </Button>
              }
            
             <Modal
             animationType="slide"
             transparent={true}
             visible={modal}
             onRequestClose={()=>{
                 setModal(false)
             }}
             >
                <View style={styles.modalView}>
                    <View style={styles.modalButtonView}>
                    <Button icon="camera" 
                    theme={theme}
                     mode="contained"
                     onPress={() => pickFromCamra()}>
                    camera
                    </Button>
                    <Button icon="image-area" 
                    theme={theme} mode="contained"
                     onPress={() => pickFromGallery()}>
                    gallary
                     </Button>
                     </View>

                <Button 
                 theme={theme} 
                 icon="cancel"  onPress={() => setModal(false)}>
                cancel
                </Button>
                </View>
             </Modal>
            


        </View> 
        </KeyboardAvoidingView>  
    )
}
const theme ={
    colors:{
        primary:"blue"
    }
}
const styles=StyleSheet.create({
    root:{
        flex:1
    },

    inputStyle:{
         margin:5
    },
    modalView:{
        position:"absolute",
        bottom:2,
        width:"100%",
        backgroundColor:"white"
    },
    modalButtonView:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10
    }
})


export default CreateStudent