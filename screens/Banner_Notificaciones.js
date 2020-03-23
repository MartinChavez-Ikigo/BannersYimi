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

  static navigationOptions = {
    title: 'Banner-Notificaciones-Metas',
    /* No more header config here! */
  };

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
    comando:"",
    getValue: '',
    check_not:''
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
    this.setState({ show: false });
  };

  Save_Notifications(data){
    //alert("Almacena Local"+JSON.stringify(data));
    console.log("Guarda en la base local "+data);
    
    AsyncStorage.setItem('not', JSON.stringify(data));
    
  }

  getValueFunction = () => {
    //function to get the value from AsyncStorage
    AsyncStorage.getItem('not').then(
      value =>
        //AsyncStorage returns a promise so adding a callback to get the value
        this.setState({ getValue : JSON.parse(value) })

      //Setting the value in Text
    );
    alert(JSON.stringify(this.state.getValue))
  };

  async boot_notifi (){
    //function to get the value from AsyncStorage
    //alert("Llena el array");
    await AsyncStorage.getItem('not').then(
      value =>
        //AsyncStorage returns a promise so adding a callback to get the value
        this.setState({ check_not : JSON.parse(value) })

      //Setting the value in Text
    );
    console.log("Fin 1");
    console.log(this.state.check_not);
    if(this.state.check_not==undefined){
        alert("Sin notifiaciones");
    }else{
        this.setState({pila_notificaciones:this.state.check_not});
    }
    
    
    //alert(this.state.check_not);
  };

  async componentDidMount(){
    
     let variable= await this.boot_notifi();
      console.log("Fin 2");
      
  
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
            //alert("Comando de validacion de cuenta");
            this.setState({ codigo_validacion: data.codigo,comando: data.comando });
        }
        if(data.comando=="002"){
            //alert("Comando de viaje nuevo");
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
          this.Save_Notifications(this.state.pila_notificaciones);
          console.log(data);
          
        }
        if(data.comando=="005"){
          //alert("Comando de informacion de pago");
          this.state.pila_notificaciones.push(data);
          this.Save_Notifications(this.state.pila_notificaciones);
          console.log(data);
          
        }

        
        global.notificacion=0;
        this.setState({ codigo_validacion: data.codigo });
    }
    
  }

  render(){

    return (
      <View style={{flex:1,backgroundColor:"#FFF"}}>
          <View style={{position:"absolute",zIndex:1,left:'80%'}}>
              <Button
                  title="Detalle"
                  onPress={() => this.props.navigation.navigate('Detalle_View')}
              />
              
              
          </View>
            

            <View style={styles.header}>
                <View style={{backgroundColor:'#000000',width:'100%',height:'50%',zIndex: 0,borderWidth:0,flexDirection:"row",position:"absolute"}}>
                    <Text style={{color:"#FFF",fontSize:24}}>{"  <  "}</Text>
                    <Text style={{color:"#FFF",fontSize:20,paddingTop:'0%',paddingLeft:'25%'}}>Notificaciones</Text>
                </View>
            </View>

            <View style={{width:'100%',top:'-5%',height:'3%',borderWidth:0}} >
                    <View style={{width:'10%',alignItems:"flex-start",position:"absolute",zIndex: 0}}>
                        <Switch></Switch>
                        
                    </View>
                    <View style={{width:'30%',left:'10%'}}>
                        <Text style={{fontSize:20}}>    Conectado</Text>
                    </View>
                    
                    <View style={{width:50, height:50,left:'55%',zIndex: 0, position: 'absolute'}}>
                        <Image
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: 'https://www.stickpng.com/assets/images/58afdad6829958a978a4a693.png' }}
                        />
                    </View>

                    <View style={{width:50, height:50,left:'70%',zIndex: 0, position: 'absolute'}}>
                        <Image
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: 'https://image.flaticon.com/icons/png/512/61/61671.png' }}
                        />
                    </View>

                    <View style={{width:50, height:50,left:'85%',zIndex: 0, position: 'absolute'}}>
                        <Image
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: 'https://cdn0.iconfinder.com/data/icons/google-material-design-3-0/48/ic_settings_48px-512.png' }}
                        />
                    </View>
              
            </View>
              

            <View style={{borderWidth:0,width:'100%',height:'84%',top:'1%'}}>
              <Text>Token Id:</Text>
              <TextInput value={this.state.token}></TextInput>
              
              <ScrollView style={{backgroundColor:"#FFF"}}>
                  
                  {
                    this.state.pila_notificaciones.map((u, i) => {
                      console.log("Datos map "+u);
                      
                      return (
                        
                          <TouchableOpacity>
                              <Card key={i} containerStyle={{padding: 0}}>
                                  <View key={i} style={{backgroundColor:"#eeeeee",paddingLeft:10,paddingBottom:10}}>
                                      <Text style={{fontWeight:"bold"}}>Información de pago</Text>
                                      <View style={{zIndex: 0, position: 'relative',flexDirection: 'row',width:'80%'}}>
                                      {u.imagen_per ? (
                                          <View style={{width:50, height:50,left:'5%',zIndex: 0, position: 'relative'}}>
                                              <Image
                                              style={{ width: '100%', height: '100%' }}
                                              source={{ uri: u.imagen_per }}
                                              />
                                          </View>
                                      ) : null}
                                          <Text style={{paddingLeft:5,paddingBottom:10}}>{u.datos_pago+"\n"+u.telefono}</Text>

                                          

                                      </View>
                                    
                                    
                                      <View style={{flex:1}}>
                                          <View style={{flexDirection: 'row',paddingLeft:0,width:'100%'}}>
                                              <Text style={{fontWeight:"bold",justifyContent:"flex-start",paddingLeft:5}}>{u.fecha}</Text>
                                              {u.state_buttons? (    
                                              <View style={{flexDirection: 'row',borderWidth:0,justifyContent: "flex-end",alignItems: 'center',width:'70%'}}>
                                                  <Button
                                                  color="#ff0000"
                                                  title=" Aceptar "
                                                  />

                                                  <Text style={{paddingRight:10}}></Text>

                                                  <Button
                                                  color="#008F39"
                                                  title="Rechazar"
                                                  />

                                              </View> 
                                              ) : null}
                                          </View>
                                      </View>
                                  </View>
                              </Card>
                          </TouchableOpacity> 
                      );
                    })
                  }
                </ScrollView>
            </View>

                  {this.state.show ? (
                    <View style={{position:"absolute", top:'85%',borderWidth:1, width: '100%',height:'15%',backgroundColor: '#FFF'}}>
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

      </View>

      
    );
  }
  
}



const styles = StyleSheet.create({
  header:{
    backgroundColor: '#FFF',
    width:'100%',
    height:'11%',
    borderWidth:0
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
    
  },
});
