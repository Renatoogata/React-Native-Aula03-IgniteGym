import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Entypo } from '@expo/vector-icons'

type Props = TouchableOpacityProps & {

}

export function ExerciseCard({ ...rest }: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" marginBottom={3}>
                <Image
                    source={{ uri: 'https://thumb.mais.uol.com.br/16669847-large.jpg?ver=0' }}
                    alt="Imagem do Exercicio"
                    w={16}
                    h={16}
                    rounded="md"
                    mr={4}
                    resizeMode="center" // sempre manter a imagem centralizada
                />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white">
                        Remana unilateral
                    </Heading>

                    <Text
                        fontSize="sm"
                        color="gray.200"
                        mt={1}
                        numberOfLines={2} //MÁXIMO DE LINHAS QUE O TEXTO PODE TER
                    >
                        3 series x 12 repetições
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