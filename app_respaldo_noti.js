import React from 'react';
import { StyleSheet, Text, View, TextInput,AppState,Vibration,TouchableOpacity } from 'react-native';
import { Notifications } from "expo";
import * as Permissions from  "expo-permissions";
import Expo, { Constants } from "expo";
import { Audio } from 'expo-av';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { AsyncStorage,Image } from 'react-native';



global.notificacion=0;
const getToken=async()=>{
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if(status !== "granted"){
    return;
  }
  const token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
  return token;
}


BackgroundFetch.setMinimumIntervalAsync(5);

//const taskName = 'test-background-fetch';
TaskManager.defineTask(taskName, async () => {
  
  try {
    await AsyncStorage.setItem('TASKS', 'I like to save it.');
  } catch (error) {
    alert('tanımlama hatası');
    // Error saving data
  }
  

  return BackgroundFetch.Result.NewData;
});



const taskName = 'test-background-fetch';
TaskManager.defineTask('test-background-fetch', async () => {
  alert('background featch running');
  return BackgroundFetch.Result.NewData;
});


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      pila_banner:[]
    };
  }
  state = {
    notification: {},
    token:"",
    codigo_validacion:"",
    comando:""
  };
  
  ShowHideComponent = () => {
    this.state.pila_banner.pop();
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  Hidde_Banner = () => {
    alert("Cerro el banner");
  };

  async componentDidMount(){
    console.log("Estatus de Background");
    this.registerTaskAsync();  


      let token_get= await getToken();
    console.log(token_get);
    if (Platform.OS === 'android') {
      console.log("SISTEMA ANDROID");
      Notifications.createChannelAndroidAsync('confirmarCuenta', {
        name: 'Confirmar Cuenta',
        priority: 'max',
        vibrate: [250, 250, 250, 250],
        sound: true,
      });

      Notifications.createChannelAndroidAsync('NuevoViaje', {
        name: 'Nuevo Viaje',
        priority: 'max',
        vibrate: [250, 250, 250, 250],
        //sound: true,
      });
    }

    
    this.setState({ token: token_get });
    this._notificationSubscription = Notifications.addListener(this.listen);
  }


  registerTaskAsync = async () => {
    await BackgroundFetch.registerTaskAsync(taskName);
    
    alert('task registered');
  };


  async Getir() {
    try {
      const value = await AsyncStorage.getItem('TASKS');

      alert('Valor :' + value);
    } catch (error) {
      alert('okuma hatası');
    }
  }

  /*registerTaskAsync = async () => {
    await BackgroundFetch.registerTaskAsync(taskName);
    console.log('task registered');

    const status = await BackgroundFetch.getStatusAsync();

    switch (status) {
      case BackgroundFetch.Status.Restricted:
        alert('Restrict');
        break;
      case BackgroundFetch.Status.Denied:
        alert('Background execution is disabled');
        break;

      case BackgroundFetch.Status.Available:
        alert('Avaible');
        break;

      default: {
        alert('Background execution allowed');

        let tasks = await TaskManager.getRegisteredTasksAsync();
        if (tasks.find(f => f.taskName === taskName) == null) {
          alert('Registering task');
          console.log("Tarea resgitrada");
          await BackgroundFetch.registerTaskAsync(taskName);

          tasks = await TaskManager.getRegisteredTasksAsync();
          alert('Tanımlananlar', tasks);
        } else {
          alert(`Task ${taskName} already registered, skipping`);
          console.log("Tarea se encuentra registada");
          
        }

        //await BackgroundFetch.setMinimumIntervalAsync(1);
        
        break;
      }
    }
  };
*/



 listen = async  ( {origin, data} ) => {

    if(global.notificacion==0){//primer mensaje
        if(data.comando=="001"){
            alert("Comando de validacion de cuenta");
            this.setState({ codigo_validacion: data.codigo,comando: data.comando });
        }
        if(data.comando=="002"){
            alert("Comando de viaje nuevo");
            this.setState({ comando: data.comando });
        }
        if(data.comando=="003"){
          alert("Comando de Banner nuevo (Promociones)");
         // this.setState({ pila_banner: '' });
          this.state.pila_banner.push(data);
          //this.setState({ pila_banner: JSON.stringify(data) });
          this.setState({ comando: data.comando });
          this.setState({ show: true });
          //console.log(this.state.pila_banner);
          console.log(this.state.pila_banner[0].promocion_var1);
          console.log(this.state.pila_banner[0].promocion_var2);
          console.log(this.state.pila_banner[0].promocion_var3);
          console.log(this.state.pila_banner[0].promocion_var4);
          console.log(this.state.pila_banner[0].promocion_var5);
          
          
        }
        
        global.notificacion=1;
        this.setState({ codigo_validacion: data.codigo });
    }else{//segundo mensaje de notificacion
        if(data.comando=="001"){
          alert("Comando de validacion de cuenta");
          this.setState({ codigo_validacion: data.codigo,comando: data.comando });
        }
        if(data.comando=="002"){
            alert("Comando de viaje nuevo");
            this.setState({ comando: data.comando });
        }
        if(data.comando=="003"){
          alert("Comando de Banner nuevo (Promociones)");
          //this.setState({ pila_banner: '' });
          this.state.pila_banner.push(data);
          this.setState({ comando: data.comando });
          this.setState({ show: true });
          console.log(this.state.pila_banner[0].promocion_var1);
          console.log(this.state.pila_banner[0].promocion_var2);
          console.log(this.state.pila_banner[0].promocion_var3);
          console.log(this.state.pila_banner[0].promocion_var4);
          console.log(this.state.pila_banner[0].promocion_var5);
        }
        
      global.notificacion=0;
      
      
    }
    
   /* try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        require('./assets/sounds/hello.mp3'),
        { shouldPlay: true }
      );
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
    */
    
  }

  render(){

    return (
      <View style={styles.container}>

        {this.state.show ? (
        <View style={{ zIndex: 0, position: 'absolute',top:'85%',borderWidth:1, width: '99%',height:'12%',backgroundColor: '#FFFFFF'}}>
          <TouchableOpacity  style={{ zIndex: 1, position: 'absolute',width: '7%',height:'25%',borderWidth:2,left:'93%'}}>
          <View ><Text onPress={this.Hidde_Banner} style={{textAlign:"center", fontSize:14, fontWeight:'bold'}}>X</Text></View>
          </TouchableOpacity>
              <TouchableOpacity onPress={this.ShowHideComponent}>
                <View style={{borderWidth:0,width:'70%',height:'100%'}}>
                  
                  <Text style={{textAlign:"center", fontSize:10, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var1}</Text>
                  <Text style={{textAlign:"center", fontSize:14, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var2}</Text>
                  <Text style={{textAlign:"center", fontSize:10, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var3}</Text>
                  <Text style={{textAlign:"center", fontSize:10, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var4}</Text>
                  <Text style={{textAlign:"center", fontSize:9, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var5}</Text>
                </View>
                  <View style={{ left:'70%', zIndex: 0, position: 'absolute',borderWidth:0,width:'30%',height:'100%' }}>
                      <Image
                      style={{ width: '100%', height: '100%' }}
                      source={{ uri: this.state.pila_banner[0].imagen }}
                      />
                  </View>
                  
              </TouchableOpacity>
          </View>
        ) : null}

        

        <Text>App notificaciones yimi</Text>
        <Text>Token:  </Text>
        <TextInput value={this.state.token} ></TextInput>
        <Text>Codigo de validación: </Text>
        <TextInput value={this.state.codigo_validacion} ></TextInput>
        <Text>Comando recibido: </Text>
        <TextInput value={this.state.comando} ></TextInput>
        <Text>Valores de pila</Text>
        <TextInput value={JSON.stringify(this.state.pila_banner)}></TextInput>
        <Text>Banner pendientes : {this.state.pila_banner.length}</Text>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
