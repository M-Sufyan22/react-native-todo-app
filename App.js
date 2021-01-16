import React,{useState,useEffect} from 'react';
import {StyleSheet,Text, View,TextInput,TouchableOpacity,FlatList,SafeAreaView,Alert ,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from './config/firebase';
import { Entypo, AntDesign,Octicons ,MaterialCommunityIcons  } from '@expo/vector-icons'; 

export default function App() {

  const[todos,setTodos] = useState({value: '' });
  const[UpdateTodo,setUpdateTodo] = useState({value: '' });
  const[AllTodos,setAllTodos] = useState([]);
  const[editBtn,seteditBtn] = useState({EditItemKey: '' });
  const[successMessage,setsuccessMessage] = useState({
    enable: false,
    msg: '',
    type: ''
  });

  useEffect(()=>{
    getdata();
    },[]);
     
  const getdata = () =>{
      let dataList = [];
      firebase.database().ref('todos').on('value',function(snapshot){ 
          snapshot.forEach(snap => {
          dataList.push(snap.val());
          });
          dataList.reverse();
          setAllTodos(dataList)
      });
  };

  const add_todo = () =>{
    if(todos.value.split(' ').join('') === ''){
      Alert.alert(
        "Alert!",
        "Enter A todo Work it's empty!",
        [{
            text: "ok",
            onPress: password => console.log("OK Pressed, password: " + password)
          }
        ],
        "secure-text"
      );
    }
    else if( todos.value.split(' ').join('').length <3){
      Alert.alert(
        "Oops!",
        "Todo word length must be greater than 2",
        [{text: "OK",}],
        "secure-text"
      );
    }else{
    
      var key = firebase.database().ref('/').push().key;
      let obj = {
        todo: todos.value,
        key: key
      }
      firebase.database().ref('todos').child(key).set(obj);
      setTodos({value:""});
      getdata();
      showSuccesMessages('Item added..','success')
    }

  }

  const del_todo = (e) =>{
    firebase.database().ref('todos').child(e).remove();
    getdata();
    showSuccesMessages('Removed Item!' ,'delete')
  }

  const edit_todo = (e,s) =>{
    seteditBtn({EditItemKey: s});
    setUpdateTodo({value:e})
  }

  const update_todo_item = (e) => {
    if(UpdateTodo.value.split(' ').join('') === ''){
      Alert.alert(
        "Empty ! Not Updated!",
        "Enter A todo Work it's empty!",
        [{
            text: "ok",
            onPress: password => console.log("OK Pressed, password: " + password)
          }
        ],
        "secure-text"
      );
    }
    else if(UpdateTodo.value.split(' ').join('').length <3){
      Alert.alert(
        "Oops!",
        "Todo word length must be greater than 2",
        [{
            text: "OK",
            onPress: password => console.log("OK Pressed, password: " + password)
          }
        ],
        "secure-text"
      );
    }else{
      let newData = {
        todo: UpdateTodo.value,
        key:  e
      }
      firebase.database().ref('todos').child(e).update(newData);
      setTodos({value:""});
      seteditBtn({EditItemKey: ''});
      setUpdateTodo({value:''});
      getdata();
      showSuccesMessages('Successfully Updated!' ,'success')
    }
  
  }

  const  dell_All = ()  =>{
    firebase.database().ref('todos/').remove();
    getdata();
    showSuccesMessages('All Todos has been Deleted...','delete')
  }

  const showSuccesMessages = (msg,types) =>{
    setsuccessMessage({
      enable: true,
      msg: msg,
      type: types
    });
    setTimeout(
      function() {
        setsuccessMessage({
          enable: false,
          msg: '',
          type: ''
        });
      }, 1500);
  }
 
  return (
    <LinearGradient style={styles.container} colors={['#5db9de','#4891f0','#5d77de',]}>
      <ScrollView>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.top_sec}>
        <Text style={styles.appHeading}>ToDo App </Text>
         <TextInput
            style={styles.input_field}
            placeholder="Add todos work's"
            value={todos.value}
            onChangeText={(e) => setTodos({value:e})}></TextInput>
          <TouchableOpacity activeOpacity={0.8} style={styles.adbtn} onPress={add_todo}>
            <Text style={{ color: '#fff',textAlign: 'center' }}><Octicons  name="diff-added" size={25} color="#fff" /></Text>
          </TouchableOpacity>
          {successMessage.type ==='delete'   ? <View style={{...styles.successMessage,backgroundColor:'red'}}><Text style={{color:'#fff'}}>{successMessage.msg}</Text> 
        <Entypo  name="check" size={14} color="#fff" />
        </View> : null}
          {AllTodos.length  ? 
        <>
          {successMessage.type === 'success'  ? <View style={{...styles.successMessage,backgroundColor:'green'}}><Text style={{color:'#fff'}}>{successMessage.msg}</Text>
          <Entypo  name="check" size={14} color="#fff" />
          </View> : null}
          <TouchableOpacity activeOpacity={0.8} style={styles.delAllbtn} onPress={dell_All}>
            <Text style={styles.delAllbtnText}><Entypo name="trash" size={14} color="#fff" /> Clear All</Text>
          </TouchableOpacity>
          </>
          :null}
        </View>
        <View style={styles.bottom_sec}>
          {AllTodos.length  ? 
          <SafeAreaView>
            <FlatList data={AllTodos} renderItem={(item) => {
                return(
                  <View key={item} style={editBtn.EditItemKey === item.item.key ? styles.edit_list_items : styles.list_items}>
                    <View  style={styles.list_text}>
                    {editBtn.EditItemKey === item.item.key ? 
                    <TextInput 
                    value={UpdateTodo.value} 
                    keyboardType={'default'}  
                    placeholder="Edit todo work.. and Save it...."
                    onChangeText={(e) => setUpdateTodo({value:e})}
                    autoFocus = {true}
                    />
                     :<Text style={styles.fontSize}>{item.item.todo}</Text> }
                    </View>
                    <View style={styles.btns_sec}>
                      {editBtn.EditItemKey === item.item.key ?
                        <TouchableOpacity activeOpacity={0.8} style={{...styles.list_btn,backgroundColor:'orange'}} onPress={()=>update_todo_item(item.item.key)}>
                          <Text style={{color:"#fff"}}><MaterialCommunityIcons  name="check-bold" size={16} color="#fff" /></Text></TouchableOpacity>
                      : <TouchableOpacity activeOpacity={0.8} style={{...styles.list_btn,backgroundColor:'#27c279'}} onPress={()=>edit_todo(item.item.todo, item.item.key)}>
                        <Text style={{color:"#fff"}}><AntDesign name="edit" size={14} color="#fff" /></Text></TouchableOpacity>
                      }
                      <TouchableOpacity activeOpacity={0.8} style={{...styles.list_btn,backgroundColor:'#ff2600'}} onPress={()=>del_todo(item.item.key)}>
                        <Text   style={{color:"#fff"}}><Entypo  name="trash" size={14} color="#fff" /></Text></TouchableOpacity>
                    </View>
                </View>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
          :<>
          <Text style={{...styles.heading,color:"yellow"}}>No TODO Work Found! <Entypo name="emoji-happy" size={24} color="yellow" /></Text>
          <Text style={{...styles.heading,fontSize: 16}}>Wellcome To Todo App  </Text>
          </>
          }
        </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex:1,
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
  top_sec: {
    paddingVertical: 8,
    flexWrap:'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bottom_sec: {
    alignItems:'center',
    paddingVertical: 8,
  },
  appHeading:{
    width:'100%',
    marginTop: 20,
    marginBottom:5,
    textAlign:'center',
    fontSize: 20,
    color:'#fff',
   fontWeight:'bold'
  },  
  adbtn: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    width: '15%',
    height: 40,

  },
  delAllbtn: {
    alignItems:'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    marginTop:8,
  },
  delAllbtnText: {
    color: '#fff',
    textAlign: 'center' ,
    backgroundColor:"#ff2600",
    padding: 7,
    justifyContent:'center',
  },
  input_field: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '85%',
    height: 40,
    padding: 10
  },
  list_items:{
    backgroundColor:'#fff',
    width:'100%',
    flex: 1,
    minHeight: 35 ,
    marginTop: 5 ,
    marginBottom: 5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
  },
  edit_list_items:{ 
    backgroundColor:'#fff',
    width:'100%',
    minHeight: 35 ,
    marginTop: 5 ,
    marginBottom: 5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
    borderBottomWidth: 3,
    borderBottomColor: '#4891f0',
    shadowColor: "#000",
   shadowOffset: {
    width: 0,
    height: 8,
   },
   shadowOpacity: 0.44,
   shadowRadius: 10.32,
   elevation: 16,
},
  list_text:{
    color: '#fff',
    width:'79%',
    color:'#000',
    fontSize: 35,
    padding: 8
  },
  btns_sec:{
    width:'20%',
    height:'100%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-end',
  },
  list_btn:{
    flex: 1,
    textAlign:"center",
    alignItems:'center',
    justifyContent:'center',
    height:35
  },
  heading:{
    fontSize:25,
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center',
    paddingTop: 25,
    marginTop:100
  },
  successMessage:{
    alignItems:'flex-start',
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical:5,
    paddingHorizontal:10,
    marginTop:8,
    marginBottom: 5,
  }

});
