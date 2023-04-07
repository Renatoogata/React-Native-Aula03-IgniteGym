import { useTheme, Box } from "native-base"; //pegar o thema padrão definido no App.tsx
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"; // DefaultTheme como o nome sugere definir um tema padrão

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

export function Routes() {
    const { colors } = useTheme();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    return (
        <Box flex={1} bg="gray.700" /*Box foi criada para prevenir glitch de tela branca na transição de telas*/>
            <NavigationContainer
                theme={theme}>
                <AuthRoutes />
            </NavigationContainer>
        </Box>
    )
}