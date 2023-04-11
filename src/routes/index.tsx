import { useContext } from "react";
import { useTheme, Box } from "native-base"; //pegar o thema padrão definido no App.tsx
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"; // DefaultTheme como o nome sugere definir um tema padrão

import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

export function Routes() {
    const { colors } = useTheme();
    const { user, isLoadingUserStorageData } = useAuth();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    if (isLoadingUserStorageData) { // esperando o asyncStorage recuperar as infos do usuario (mostrar a tela de loading)
        return <Loading />
    }

    return (
        <Box flex={1} bg="gray.700" /*Box foi criada para prevenir glitch de tela branca na transição de telas*/>
            <NavigationContainer
                theme={theme}>
                {user.id ? <AppRoutes /> : <AuthRoutes />}
            </NavigationContainer>
        </Box>
    )
}