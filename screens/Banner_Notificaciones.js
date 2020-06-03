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
      show2: false,
      show3: false,
      pila_banner:[],
      pila_notificaciones:[],
      pila_banner_alarm:[],
      pila_hibrida:[],
      i:0,
      banner_global:''
    };
  }
  state = {
    notification: {},
    token:"",
    codigo_validacion:"",
    comando:"",
    getValue: '',
    getValue_Ban: '',
    check_not:'',
    check_not_Ban:''
  };

  
  
  ShowHideComponent = () => {
    //this.state.pila_banner.pop();
    this.setState({ show: false });
    this.setState({ show2: false });
  };

  Alert_confirmar= () => {
    alert('Confirmó');
  }

  Alert_Cancelo= () => {
    alert('Cancelo');
  }

  Hidde_Banner = () => {
    clearInterval(this.timer);
    this.setState({i:0})
    let banner_drop=[];
    let last_type_banner='';
    if(this.state.pila_banner.length>0){
       last_type_banner=this.state.pila_banner[0].promocion_var6;
    }
    banner_drop=this.state.pila_banner;
    banner_drop.reverse();
    banner_drop.pop();
    banner_drop.reverse();
    this.setState({pila_banner:banner_drop})
    console.log("Nuevo tamaño array : "+this.state.pila_banner.length);
    if(this.state.pila_banner.length<=0){
      this.setState({show:false})
      this.setState({show2 :false})
      this.setState({pila_banner:[]})
                            
    }else{
      if(last_type_banner==false){
        this.setState({show:true})
      }else{
        this.setState({show2:true})
      }
                            
    }
    //this.setState({ show: false });
    //this.setState({ show2: false });
  };

  Hidde_Banner_alarm = () => {
    
    this.setState({ show3: false });
    //this.setState({ show2: false });
  };

  Save_Notifications(data){
    //alert("Almacena Local"+JSON.stringify(data));
    console.log("Guarda en la base local "+data);
    
    AsyncStorage.setItem('not', JSON.stringify(data));
    
  }

  Save_Banners(data){
    //alert("Almacena Local"+JSON.stringify(data));
    console.log("Guarda en la base local "+data);
    
    AsyncStorage.setItem('ban', JSON.stringify(data));
    
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

  getValueFunction = () => {
    //function to get the value from AsyncStorage
    AsyncStorage.getItem('ban').then(
      value =>
        //AsyncStorage returns a promise so adding a callback to get the value
        this.setState({ getValue_Ban : JSON.parse(value) })

        //Setting the value in Text
    );
    alert(JSON.stringify(this.state.getValue_Ban))
  };

  async boot_notifi (){
    await AsyncStorage.getItem('not').then(
      value =>
        this.setState({ check_not : JSON.parse(value) })
    );
    console.log("Fin 1");
    console.log(this.state.check_not);
    if(this.state.check_not==undefined){
        //alert("Sin notifiaciones");
    }else{
        this.setState({pila_notificaciones:this.state.check_not});
        this.state.pila_hibrida.push(this.state.pila_notificaciones)
    }
  };

  async boot_banner (){
    await AsyncStorage.getItem('ban').then(
      value =>
        this.setState({ check_not_Ban : JSON.parse(value) })
    );
    console.log("Fin 1");
    console.log(this.state.check_not_Ban);
    if(this.state.check_not_Ban==undefined){
        //alert("Sin Banners");
    }else{
      
        this.setState({pila_banner:this.state.check_not_Ban});
        this.state.pila_hibrida.push(this.state.pila_banner)
    }
    //console.log("Banners guardados: "+JSON.stringify(this.state.pila_banner));
    console.log("Banner contador : "+this.state.pila_banner.length);
    
    
  };

  async componentDidMount(){
    
     let variable= await this.boot_notifi();
      console.log("Fin 2");
     let variable_banner= await this.boot_banner();
     this.state.pila_notificaciones.reverse();
     //console.log(JSON.stringify(this.state.pila_hibrida));
     console.log("Banners pendientes ---> "+JSON.stringify(this.state.pila_banner));
  
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

      Notifications.createChannelAndroidAsync('Notificacion_generales', {
        name: 'Notificacion (Solicitud de colaboración)',
        priority: 'max',
        vibrate: [250, 250, 250, 250],
        //sound: true,
      });

      Notifications.createChannelAndroidAsync('Notificacion_Alarma', {
        name: 'Notificacion Viaje programado',
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
        if(data.comando=="003"){console.log("Comando 3");
        
          clearInterval(this.timer);
          this.setState({i:0})
          this.setState({show:false})
          this.setState({show2 :false})
          const timer=this.interval = setInterval(() => {this.state.i++;
              try{
                    console.log("Timer vivo: "+ this.state.i);
                    /**
                     * 3 min validacion
                     */
                    if(this.state.i>=3){
                          console.log("Borra ultimo banner "+this.state.pila_banner.length);
                          let banner_drop=[];
                          let last_type_banner='';
                          if(this.state.pila_banner.length>0){
                            console.log("te mames xd");
                            
                            last_type_banner=this.state.pila_banner[0].promocion_var6;
                            /*if(last_type_banner==false){
                              this.setState({show:false})
                            }else{
                              this.setState({show2:false})
                            }*/
                          }
                          banner_drop=this.state.pila_banner;
                          banner_drop.reverse();
                          banner_drop.pop();
                          banner_drop.reverse();
                          
                          console.log("Nuevo tamaño array : "+banner_drop.length);
                          if(banner_drop.length<=0){
                            console.log("o aqui xd");
                            
                            //this.setState({show2:false,show :false, pila_banner:banner_drop})
                            
                            (async () => {
                              try {
                               await this.setState({show2:false,show :false})
                               await this.setState({pila_banner:banner_drop, banner_global:banner_drop})
                               this.setState({ load: false });
                              } catch (e) {
                               this.setState({load: false, notify: "error"});
                              }
                           })();
                           
                            console.log("Show :"+this.state.show);
                            console.log("Show2 :"+this.state.show2);
                            
                            //this.setState({pila_banner:[]})
                            /**
                             * Cierra timer
                             */
                            clearInterval(timer);
                            
                          }else{console.log("LLego aqui");
                              //this.setState({})
                              if(last_type_banner==false){
                              this.setState({show:true})
                            }else{
                              console.log("mmmmm");
                              
                              this.setState({show2:true})
                            }
                            
                          }
                          console.log("Resultado del borrado: "+JSON.stringify(this.state.pila_banner));
                          this.setState({i:0})
                    }else{
                      /*if(this.state.pila_banner.length>0){console.log("Baner else *************");
                        console.log("result : "+JSON.stringify(this.state.banner_global));
                        
                        this.setState({pila_banner:this.state.banner_global})
                      }*/
                    }
              }catch(e){
                  console.log("error : "+e);
                  
              }
              
          }, 6000)
         console.log("data -------> : "+data.promocion_var6);
         
          var aux_banner=[]
          aux_banner=this.state.pila_banner;
          aux_banner.push(data);
          aux_banner.reverse()
          console.log("Banner Json :"+JSON.stringify(aux_banner));
          
          this.setState({pila_banner:aux_banner})
          
          this.state.pila_notificaciones.push(data);
          this.Save_Notifications(this.state.pila_notificaciones);
          //this.setState({ pila_banner: JSON.stringify(data) });
          this.setState({ comando: data.comando });
          
          if(data.promocion_var6==false){//alert("Banner simple imagen izquierda");
            this.setState({ show: true });
          }else{alert("Banner full image");
            this.setState({ show2: true });
          }
          
          console.log("Cantidad pila: "+this.state.pila_banner.length);
          console.log("JSON : "+JSON.stringify(this.state.pila_banner));
          
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

        if(data.comando=="006"){
          //alert("Comando de informacion de pago");
          this.state.pila_notificaciones.push(data);
          this.Save_Notifications(this.state.pila_notificaciones);
          console.log(data);
          
        }

        if(data.comando=="007"){
          //alert("Comando de informacion de pago");
          this.state.pila_banner_alarm.push(data);
          this.state.pila_notificaciones.push(data);
          this.Save_Notifications(this.state.pila_banner_alarm);
          console.log("Alarma de viaje programdo: ",data);
          if(data.flag_alarm==true){//alert("Banner simple imagen izquierda");
            this.setState({ show3: true });
          }
          
        }
        /**
         * Invertir array
         */
        this.state.pila_notificaciones.reverse();

        
        global.notificacion=0;
        this.setState({ codigo_validacion: data.codigo });
    }
    
  }

  render(){

    return (
      <View style={{flex:1,backgroundColor:"#FFF"}}>
          <View style={{position:"absolute",zIndex:1,left:'80%',borderBottomWidth:0,top:'-0.9%'}}>
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

            <View style={{width:'100%',top:'-5%',height:'10%',borderWidth:0}} >
                    <View style={{width:'10%',alignItems:"flex-start",position:"absolute",zIndex: 0}}>
                        <Switch></Switch>
                        
                    </View>
                    <View style={{width:'50%',left:'10%'}}>
                        <Text style={{fontSize:20}}>  Conectado</Text>
                    </View>
                    
                    <View style={{width:50, height:50,left:'54%',zIndex: 0, position: 'absolute'}}>
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
              

            <View style={{borderWidth:1,width:'100%',height:'84%',top:'-2%'}}>
              <Text>Token Id:</Text>
              <TextInput value={this.state.token}></TextInput>
              
              <ScrollView style={{backgroundColor:"#FFF"}}>
                  
                  {
                    //Invertir array
                    
                    this.state.pila_notificaciones.map((u, i) => {
                      //console.log("Datos map "+JSON.stringify(u));
                      
                      return (
                        
                          <TouchableOpacity>
                              <Card key={i} containerStyle={{padding: 0}}>
                                  {u.flag_banner ? ( //Bandera que reconoce como banner en barra de notificaciones
                                      <View key={i} style={{backgroundColor:"#eeeeee",paddingLeft:'0%',paddingBottom:10,height:110,paddingBottom:15}}>
                                        <View style={{position:"relative", top:'7%', borderWidth:0, width: '100%',alignSelf: 'flex-start'}}>
                                              
                                                  <TouchableOpacity onPress={this.ShowHideComponent}>
                                                    <View style={{borderWidth:0,width:'70%',height:'100%'}}>
                                                      
                                                      <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{u.promocion_var1}</Text>
                                                      <Text style={{textAlign:"center", fontSize:14+2, fontWeight:'bold', fontStyle:'italic'}}>{u.promocion_var2}</Text>
                                                      <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{u.promocion_var3}</Text>
                                                      <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{u.promocion_var4}</Text>
                                                      <Text style={{textAlign:"center", fontSize:9+2, fontWeight:'bold', fontStyle:'italic'}}>{u.promocion_var5}</Text>
                                                    </View>
                                                      <View style={{ left:'70%', zIndex: 0, position: 'absolute',borderWidth:0,width:'30%',height:'100%' }}>
                                                          <Image
                                                          style={{ width: '100%', height: '100%' }}
                                                          source={{ uri: u.imagen }}
                                                          />
                                                      </View>
                                                      
                                                  </TouchableOpacity>
                                          </View>
                                      </View>
                                  ) : null}
                                  {u.flag_notifi ? ( 
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
                                  ) : null}


                                  {u.flag_alarma ? (
                                    <View key={i} style={{backgroundColor:"#eeeeee",paddingLeft:10,paddingBottom:10}}>
                                          <Text style={{fontWeight:"bold"}}>Notificacion de viaje programado</Text>
                                          <View style={{zIndex: 0, position: 'relative',flexDirection: 'row',width:'80%'}}>
                                          
                                              <View style={{width:50, height:50,left:'5%',zIndex: 0, position: 'relative'}}>
                                                  <Image
                                                  style={{ width: '100%', height: '100%' }}
                                                  source={{ uri: 'https://i.ya-webdesign.com/images/bell-notification-youtube-png.png' }}
                                                  />
                                              </View>
                                          
                                              <Text style={{paddingLeft:5,paddingBottom:10}}>{u.line1+"\n"+u.line2+"\n"+u.date}</Text>

                                              

                                          </View>
                                        
                                        
                                          <View style={{flex:1}}>
                                              <View style={{flexDirection: 'row',paddingLeft:0,width:'100%',}}>
                                                  
                                                    
                                                  <View style={{flexDirection: 'row',borderWidth:0,justifyContent: "flex-end",alignItems: 'center',width:'70%',left:'22%'}}>
                                                      
                                                      <Button
                                                      color="#ff0000"
                                                      title=" Cancelar "
                                                      
                                                      />
                                                    

                                                      <Text style={{paddingRight:10}}></Text>
                                                      
                                                      <Button
                                                      color="#008F39"
                                                      title="Confirmar"
                                                      
                                                      />
                                                     

                                                  </View> 
                                                  
                                              </View>
                                          </View>
                                      </View>
                                  ) : null}


                              </Card>
                          </TouchableOpacity> 
                      );
                    })
                  }
                </ScrollView>
            </View>

                  {this.state.show ? (
                    <View style={{position:"absolute", top:'85%',borderWidth:1, width: '100%',backgroundColor: '#FFF',alignSelf: 'flex-start'}}>
                          <TouchableOpacity  style={{ zIndex: 1, position: 'absolute',width: '7%',height:'25%',borderWidth:2,left:'93%'}}>
                          <View ><Text onPress={this.Hidde_Banner} style={{textAlign:"center", fontSize:14, fontWeight:'bold'}}>X</Text></View>
                          </TouchableOpacity>
                              <TouchableOpacity onPress={this.ShowHideComponent}>
                                <View style={{borderWidth:0,width:'70%',height:'100%'}}>
                                  
                                  <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var1}</Text>
                                  <Text style={{textAlign:"center", fontSize:14+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var2}</Text>
                                  <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var3}</Text>
                                  <Text style={{textAlign:"center", fontSize:10+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var4}</Text>
                                  <Text style={{textAlign:"center", fontSize:9+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner[0].promocion_var5}</Text>
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


                  {this.state.show2 ? (
                    <View style={{position:"absolute", top:'85%',borderWidth:1, width: '100%',height:'15%',alignSelf:'flex-start'}}>
                          <TouchableOpacity  style={{ zIndex: 1, position: 'absolute',width: '7%',height:'25%',borderWidth:2,left:'93%',alignSelf: 'flex-start'}}>
                          <View ><Text onPress={this.Hidde_Banner} style={{textAlign:"center", fontSize:14, fontWeight:'bold'}}>X</Text></View>
                          </TouchableOpacity>
                              <TouchableOpacity onPress={this.ShowHideComponent}>
                               
                                  
                                      <Image
                                      style={{ width: '100%', height: '100%' }}
                                      source={{ uri: this.state.pila_banner[0].imagen}}
                                      />
                                  
                                  
                              </TouchableOpacity>
                    </View>
                  ) : null}  

                  

                  {this.state.show3 ? (
                    <View style={{position:"absolute", top:'5%',borderWidth:1, width: '100%',backgroundColor: '#FFF',alignSelf: 'flex-start'}}>
                          <TouchableOpacity  style={{ zIndex: 1, position: 'absolute',width: '7%',height:'30%',borderWidth:2,left:'93%'}}>
                          <View ><Text onPress={this.Hidde_Banner_alarm} style={{textAlign:"center", fontSize:14, fontWeight:'bold'}}>X</Text></View>
                          </TouchableOpacity>
                              <TouchableOpacity onPress={this.ShowHideComponent}>
                              <View style={{ left:'0%', zIndex: 0, position: 'absolute',borderWidth:0,width:'30%',height:'100%', top:"15%" }}>
                                      <Image
                                      style={{ width: '60%', height: '60%' }}
                                      source={{ uri: 'https://i.ya-webdesign.com/images/bell-notification-youtube-png.png' }}
                                      />
                                  </View>
                                <View style={{borderWidth:0,width:'70%',height:'100%',left:'24%'}}>
                                  
                                  <Text style={{textAlign:"justify", fontSize:14+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner_alarm[0].line1}</Text>
                                  <Text style={{textAlign:"justify", fontSize:14+2, fontWeight:'bold', fontStyle:'italic'}}>{this.state.pila_banner_alarm[0].line2}</Text>
                                  
                                                  <View style={{flexDirection: 'row',borderWidth:0,justifyContent: "flex-end",width:'70%',left:"90%"}}>
                                                     <TouchableOpacity >
                                                      <Button
                                                      color="#ff0000"
                                                      title=" Cancelar "
                                                      onPress={this.Alert_Cancelo}
                                                      />
                                                      </TouchableOpacity>

                                                      <Text style={{paddingRight:10}}></Text>
                                                      <TouchableOpacity >
                                                      <Button
                                                      color="#008F39"
                                                      title="Confirmar"
                                                      onPress={this.Alert_confirmar}
                                                      />
                                                      </TouchableOpacity>

                                                  </View>
 
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
