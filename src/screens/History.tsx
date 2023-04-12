import { useCallback, useState } from "react";
import { SectionList, Text, Heading, VStack, useToast } from "native-base";

import { api } from "@services/api";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

import { AppError } from "@utils/AppError";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function History() {
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    const toast = useToast();

    async function fetchHistory() {
        try {
            setIsLoading(true)
            const response = await api.get('/history');
            setExercises(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível carregar o histórico";
            toast.show({
                title,
                placement: 'bottom',
                bg: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercício" />

            <SectionList
                px={8}
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => ( // renderizando componente normal igual flat list
                    <HistoryCard
                        data={item}
                    />
                )}
                renderSectionHeader={({ section }) => ( // renderizando um header que nesse caso é o title
                    <Heading
                        color="gray.200"
                        fontSize="md"
                        fontFamily="heading"
                        mt={10}
                        mb={3}
                    >
                        {section.title}
                    </Heading>
                )}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }} // verifcando se não tiver componente o container vai ter essa estilização
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há exercícios registrados ainda. {'\n'}
                        Vamos fazer exercícios hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
        </VStack>
    )
}