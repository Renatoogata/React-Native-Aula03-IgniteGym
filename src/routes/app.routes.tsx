import { Platform } from 'react-native'; //usado para saber em qual ambiente a aplicação está rodando
import { useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

import { Home } from '@screens/Home';
import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Profile } from '@screens/Profile';

import { tagUserInfoCreate } from '@notifications/notificationTags';

type AppRoutes = {
    home: undefined
    exercise: { exerciseId: string }
    profile: undefined
    history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();


export function AppRoutes() {
    const { sizes, colors } = useTheme(); //definindo e usando tamanho padrão para os icones
    const iconSize = sizes[6];

    tagUserInfoCreate();

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false, // tirar o nome das screens no Tab bar (menu)
            tabBarActiveTintColor: colors.green[500], // mudar cor do menu quando estiver ativo
            tabBarInactiveTintColor: colors.gray[200], // mudar a cor do menu quando não estiver ativo
            tabBarStyle: {
                backgroundColor: colors.gray[600], // cor de fundo da Tab bar (menu)
                borderTopWidth: 0, // tirar borda de cima do Tab bar (menu)
                height: Platform.OS === "android" ? 'auto' : 96, // definindo altura de acordo com o sistema (IOS x Android)
                paddingBottom: sizes[8], // ajeitando o fundo da Tab bar ( menus )
                paddingTop: sizes[8],   // ajeitando o fundo da Tab bar ( menus )
            }
        }}>
            <Screen
                name='home'
                component={Home}
                options={{                          //Definindo qual imagem no menu do tab navigator
                    tabBarIcon: ({ color }) => (
                        <HomeSvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )

                }}
            />

            <Screen
                name='history'
                component={History}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HistorySvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />

            <Screen
                name='profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <ProfileSvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />

            <Screen
                name='exercise'
                component={Exercise}
                options={{
                    tabBarButton: () => null //esconder essa rota da Tab bar (menu)
                }}
            />
        </Navigator>
    )
}