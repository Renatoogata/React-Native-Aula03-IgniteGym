import { HStack, Text, Heading, VStack, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

import { UserPhoto } from "./UserPhoto";

export function HomeHeader() {
    return (
        <HStack
            bg="gray.600"
            pt={16}
            pb={5}
            px={8}
            alignItems="center"
        >
            <UserPhoto
                source={{ uri: 'https://img.quizur.com/f/img628d02b79ce434.31201082.jpg?lastEdited=1653408443' }}
                alt="Imagem do usuário"
                size={16}
                mr={4}
            />

            <VStack flex="1">
                <Text color="gray.100" fontSize="md">Olá,</Text>

                <Heading color="gray.100" fontSize="md" fontFamily="heading">
                    Renato
                </Heading>
            </VStack>

            <TouchableOpacity>
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