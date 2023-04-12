import { useEffect, useState } from "react";
import { Heading, HStack, Icon, Text, VStack, Image, Box, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";

import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";


type RouteParamsProps = {
    exerciseId: string
}

export function Exercise() {
    const [isLoading, setIsLoading] = useState(true);
    const [sendingRegister, setSendingRegister] = useState(false);
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const route = useRoute();
    const { exerciseId } = route.params as RouteParamsProps

    const toast = useToast()

    async function fetchExerciseDetailsById() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${exerciseId}`)
            setExercise(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível carregar o dados do exercicios'
            toast.show({
                title,
                placement: 'top',
                bg: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistoryRegister() {
        try {
            setSendingRegister(true);

            await api.post('/history', { exercise_id: exerciseId }) // fazendo um registro no banco de dados passando a chave e valor

            toast.show({
                title: `Parabens por realizar o exercício(a): ${exercise.name}`,
                placement: 'top',
                bg: 'green.700',
            })

            navigation.navigate('history')

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível adicionar ao histórico'
            toast.show({
                title,
                placement: 'top',
                bg: 'red.500'
            })
        } finally {
            setSendingRegister(false);
        }
    }

    function handleGoBack() {
        navigation.goBack()
    }

    useEffect(() => {
        fetchExerciseDetailsById();
    }, [exerciseId])

    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12}>
                <TouchableOpacity
                    onPress={handleGoBack}
                >
                    <Icon
                        as={Feather}
                        name="arrow-left"
                        color="green.500"
                        size={6}
                    />
                </TouchableOpacity>

                <HStack
                    justifyContent="space-between"
                    mt={4}
                    mb={8}
                    alignItems="center"
                >
                    <Heading
                        color="gray.100"
                        fontFamily="heading"
                        fontSize="lg"
                        flexShrink={1} // preveni que se o texto for muito grande ele empurre os outros componentes
                    >
                        {exercise.name}
                    </Heading>
                    <HStack alignItems="center">
                        <BodySvg />
                        <Text color="gray.200" ml={1} textTransform="capitalize">
                            {exercise.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
            {
                isLoading ? <Loading /> :
                    <VStack p={8}>
                        <Box // quando for um gif a ser carrego a tag <Image /> não consegue aplicar as estilizações (ex: rounded)
                            rounded="lg"
                            mb={3}
                            overflow="hidden"
                        >
                            <Image
                                w="full"
                                h={80}
                                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                                alt="Nome do exercício"
                                resizeMode="cover" // quando a imagem for pequena ela vai esticar para ocupar todo o espaço do container
                                rounded="lg"
                            />
                        </Box>

                        <Box bg="gray.600" rounded="md" pb={4} px={4}>
                            <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                                <HStack>
                                    <SeriesSvg />
                                    <Text color="gray.200" ml={2}>
                                        {exercise.series} séries
                                    </Text>
                                </HStack>

                                <HStack>
                                    <RepetitionsSvg />
                                    <Text color="gray.200" ml={2}>
                                        {exercise.repetitions} repetições
                                    </Text>
                                </HStack>
                            </HStack>

                            <Button
                                title="Marcar como realizado"
                                onPress={handleExerciseHistoryRegister}
                                isLoading={sendingRegister}
                            />
                        </Box>
                    </VStack>
            }
        </VStack>
    )
}