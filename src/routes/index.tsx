import { useContext, useEffect, useState } from "react";
import { useTheme, Box } from "native-base"; //pegar o thema padrão definido no App.tsx
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"; // DefaultTheme como o nome sugere definir um tema padrão

import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

import OneSignal, { NotificationReceivedEvent, OSNotification } from "react-native-onesignal";
import { Notification } from "@components/Notification";

const linking = {
    prefixes: ['com.anonymous.aula03ignitegym://', 'aula03-ignitegym://', 'exp+aula03-ignitegym://'],
    config: {
        screens: {
            exercise: {
                path: 'exercise/:exerciseId',
                parse: {
                    exerciseId: (exerciseId: string) => exerciseId
                }
            },
            signUp: {
                path: 'signUp',
            }
        }
    }
}

export function Routes() {
    const [notification, setNotification] = useState<OSNotification>();

    const { colors } = useTheme();
    const { user, isLoadingUserStorageData } = useAuth();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    if (isLoadingUserStorageData) { // esperando o asyncStorage recuperar as infos do usuario (mostrar a tela de loading)
        return <Loading />
    }

    OneSignal
        .setNotificationWillShowInForegroundHandler((NotificationReceivedEvent: NotificationReceivedEvent) => {
            const response = NotificationReceivedEvent.getNotification();

            setNotification(response);
        })

    return (
        <Box flex={1} bg="gray.700" /*Box foi criada para prevenir glitch de tela branca na transição de telas*/>
            <NavigationContainer
                theme={theme}
                linking={linking}
            >
                {user.id ? <AppRoutes /> : <AuthRoutes />}

                {
                    notification?.title &&
                    <Notification
                        data={notification}
                        onClose={() => setNotification(undefined)}
                    />
                }
            </NavigationContainer>
        </Box>
    )
}