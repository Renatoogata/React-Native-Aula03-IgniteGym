import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { VStack, FlatList, HStack, Heading, Text } from "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";


export function Home() {
    const [group, setGroups] = useState(['Costas', 'BICEps', 'Tríceps', 'ombro']);
    const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra']);
    const [groupSelected, setGroupSelected] = useState('costas');

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

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
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }} // espacaçamento depois que a flastlist
                />

            </VStack>
        </VStack>
    )
}