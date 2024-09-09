import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { NewGroup } from '@screens/NewGroup';

import { Loading } from '@components/Loading';

import theme from '@theme/index';

export default function App() {
  const [ loaded ] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      /> 
      { loaded ? <NewGroup/> : <Loading/> } 
    </ThemeProvider>
  );
}