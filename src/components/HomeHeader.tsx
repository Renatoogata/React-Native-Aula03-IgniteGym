import { HStack, Text, Heading, VStack, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

import { useAuth } from "@hooks/useAuth";

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { UserPhoto } from "./UserPhoto";
import { api } from "@services/api";

export function HomeHeader() {
    const { user, signOut } = useAuth()

    return (
        <HStack
            bg="gray.600"
            pt={16}
            pb={5}
            px={8}
            alignItems="center"
        >
            <UserPhoto
                source={
                    user.avatar
                        ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } // pegando no backend a imagem do usuario
                        : defaultUserPhotoImg} // se a imagem não existir, mostrar uma imagem padrão
                alt="Imagem do usuário"
                size={16}
                mr={4}
            />

            <VStack flex="1">
                <Text color="gray.100" fontSize="md">Olá,</Text>

                <Heading color="gray.100" fontSize="md" fontFamily="heading">
                    {user.name}
                </Heading>
            </VStack>

            <TouchableOpacity onPress={signOut}>
                <Icon //utilizando o Icon do native base eu posso usar icones do Material Icons por exemplo e puxar as medidas de tamanho do nosso tema criado com o native base
                    as={MaterialIcons} // descrever qual biblioteca de icones utilizar
                    name="logout"      // nome do icone
                    color="gray.200"
                    size={7}
                />
            </TouchableOpacity>
        </HStack>
    )
}