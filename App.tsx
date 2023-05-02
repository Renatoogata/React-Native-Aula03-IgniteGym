import { StatusBar } from 'react-native';
import OneSignal from 'react-native-onesignal';

import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { AuthContextProvider } from '@contexts/AuthContext';

import { THEME } from './src/theme';
import { Loading } from '@components/Loading';

import { ONE_SIGNAL_KEY } from '@env';

OneSignal.setAppId(ONE_SIGNAL_KEY);
OneSignal.promptForPushNotificationsWithUserResponse();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })



  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />

      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}


