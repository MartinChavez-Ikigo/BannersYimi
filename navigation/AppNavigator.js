import React from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Banner_Notificaciones from "../screens/Banner_Notificaciones";
import Detalle from "../screens/Detalle_cobro";

const AppNavigator = createStackNavigator({

    Home:Banner_Notificaciones,
    Detalle_View:Detalle
});

export default createAppContainer(AppNavigator);