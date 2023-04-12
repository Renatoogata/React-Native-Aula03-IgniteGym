import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { api } from "@services/api";

type Props = TouchableOpacityProps & {
    data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest }: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" marginBottom={3}>
                <Image
                    source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }} // pegando a url do servidor e acessando o caminho onde estão as fotos por fim o data.thumb é o nome da imagem
                    alt="Imagem do Exercicio"
                    w={16}
                    h={16}
                    rounded="md"
                    mr={4}
                    resizeMode="cover" // sempre manter a imagem centralizada
                />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" fontFamily="heading">
                        {data.name}
                    </Heading>

                    <Text
                        fontSize="sm"
                        color="gray.200"
                        mt={1}
                        numberOfLines={2} //MÁXIMO DE LINHAS QUE O TEXTO PODE TER
                    >
                        {data.series} series x {data.repetitions} repetições
                    </Text>
                </VStack>

                <Icon
                    as={Entypo}
                    name="chevron-thin-right"
                    color="gray.300"
                />
            </HStack>
        </TouchableOpacity>
    )
}