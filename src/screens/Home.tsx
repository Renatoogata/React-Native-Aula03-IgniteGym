import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { VStack, FlatList, HStack, Heading, Text, useToast } from "native-base";

import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { AppError } from "@utils/AppError";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { Loading } from "@components/Loading";


export function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const [group, setGroups] = useState<string[]>([]);
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [groupSelected, setGroupSelected] = useState('costas');

    const toast = useToast();

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups') // buscando os grupos musculares no backend
            setGroups(response.data) // atualizando o estado com informações da api

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares'
            toast.show({
                title,
                placement: 'top',
                bg: 'red.500'
            })
        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading
            const response = await api.get(`/exercises/bygroup/${groupSelected}`); // separando exercicios por grupo
            setExercises(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios'
            toast.show({
                title,
                placement: 'top',
                bg: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    useFocusEffect(useCallback(() => { // toda vez que o focus for para tela home o useFocusEffect será disparado (usar com o useCallBack())
        fetchExercisesByGroup();
    }, [groupSelected])) // está de olho no estado groupSelect, se ele mudar também será feita uma nova renderização

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={group}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={(groupSelected).toLocaleUpperCase() === (item).toLocaleUpperCase()}  // verificando se o estado é igual o valor declarado(costa) BOOLEANO
                        //.toLocaleUpperCase() transforma a string toda em maiúcula localmente (está comparando a string maiuscula com maiuscula)
                        onPress={() => setGroupSelected(item)} // Boa logica para selecionar um componente entre varios
                    />
                )}
                horizontal  // deixar componentes na horizontal
                showsHorizontalScrollIndicator={false} //desabilitar barra de rolagem horizontal
                _contentContainerStyle={{ px: 8 }} //espacamento interno
                my={10} //margin top&bottom
                maxH={10} // a flatlist ocupa todo o espaço disponivel, com o maxHeight eu garanto que ele só vai ter o tamanho estipulado(10)
                minH={10} // para a lista de grupo não sumir colocar altura minima
            />

            {
                isLoading ? <Loading /> :
                    <VStack flex={1} px={8}>
                        <HStack justifyContent="space-between" mb={5}>
                            <Heading color="gray.200" fontSize="md" fontFamily="heading">
                                Exercícios
                            </Heading>

                            <Text color="gray.200" fontSize="sm">
                                {exercises.length}
                            </Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ExerciseCard
                                    data={item}
                                    onPress={handleOpenExerciseDetails}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ paddingBottom: 20 }} // espacaçamento depois que a flastlist
                        />

                    </VStack>
            }
        </VStack>
    )
}