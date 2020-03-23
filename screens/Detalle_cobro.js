import React from 'react';
import { StyleSheet, Text, View, TextInput,AppState,Vibration,TouchableOpacity,Switch,ScrollView,Button} from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements'
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

const users = [
  {
     datos_pago:"Pago por pasajero Leonel Pago servicio por el monto de MX$289, para ver mas detalle accede a mis ganancias",
     fecha:"2020-02-18",
     imagen_per:"https://www.stickpng.com/assets/images/58afdad6829958a978a4a693.png",
     state_buttons:true

  },
  {
    datos_pago:"Pago por pasajero Leonel Pago servicio por el monto de MX$289, para ver mas detalle accede a mis ganancias",
    fecha:"2020-02-18"
 },
 {
  datos_pago:"Pago por pasajero Leonel Pago servicio por el monto de MX$289, para ver mas detalle accede a mis ganancias",
  fecha:"2020-02-18"
},
]

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      pila_banner:[],
      pila_notificaciones:[]
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

      Notifications.createChannelAndroidAsync('Notificacion_Pago', {
        name: 'Notificacion de pago',
        priority: 'max',
        vibrate: [250, 250, 250, 250],
        //sound: true,
      });

      Notifications.createChannelAndroidAsync('Notificacion_Colaborar', {
        name: 'Notificacion (Solicitud de colaboración)',
        priority: 'max',
        vibrate: [250, 250, 250, 250],
        //sound: true,
      });
    }

    
    this.setState({ token: token_get });
    this._notificationSubscription = Notifications.addListener(this.listen);
  }


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
          //alert("Comando de Banner nuevo (Promociones)");
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
        if(data.comando=="004"){
          //alert("Comando de informacion de pago");
          this.state.pila_notificaciones.push(data);
          console.log(data);
          
        }
        if(data.comando=="005"){
          //alert("Comando de informacion de pago");
          this.state.pila_notificaciones.push(data);
          console.log(data);
          
        }

        
        global.notificacion=0;
        this.setState({ codigo_validacion: data.codigo });
    }/*else{//segundo mensaje de notificacion
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
        if(data.comando=="004"){
          //alert("Comando de informacion de pago");
          this.state.pila_notificaciones.push(data);
          console.log(data);
          
        }
        
      global.notificacion=0;
      
      
    }*/
    
  }

  render(){

    return (
      <View style={{flex:1,paddingRight:20,paddingLeft:20,paddingTop:'5%'}}>
        
        <Text style={{ fontSize: 17, fontWeight: '500',paddingBottom:20 }}>Recibo de Migo</Text>
                <View style={styles.recibo} >
                    <Text>Tarifa base</Text>
                    <Text>${"7.00"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Tiempo</Text>
                    <Text>${"24.87"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Distancia</Text>
                    <Text>${"15.21"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Subtotal</Text>
                    <Text>${"47.08"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Contribución gubernamental</Text>
                    <Text>${"0.78"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Cuota de solicitud</Text>
                    <Text>${"4.71"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Total</Text>
                    <Text>${"52.57"}</Text>
                </View>
                <View style={styles.recibo} >
                    <Text>Propina al conductor</Text>
                    <Text>${0.00}</Text>
                </View>
                
                <View style={styles.recibo_icon}>
                        
                        <View style={{borderWidth:0,flexDirection:"row"}}>
                          <Icon
                              name='cash'
                              type='material-community'
                              size={50}
                          />
                          <Text style={{paddingTop:14}}>Pagado en efectivo</Text>
                        </View>

                        <View style={{borderWidth:0}}>
                          <Text style={{fontWeight: '400'}} >${"52.57"}</Text>
                        </View>
                        

                        
                        

                </View>
                
      </View>

      
    );
  }
  
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#FFFFFF',
    width:'100%',
    height:'10%',
    borderWidth:0
  },
  recibo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 0,
    borderWidth:0,
    borderBottomColor: '#bababa'
  },
  recibo_icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 0,
    borderWidth:0,
    borderBottomColor: '#bababa'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
    
  },
});
