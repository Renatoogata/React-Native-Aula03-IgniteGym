import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading } from "native-base"; //Skeleton é uma mascara para quando um componente nãoe estiver sido carregado mostrar ele

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33; // como o skeleton e a propria foto de perfil utilizam o msm tamanho desse jeito facilita a manutenção do código

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false); // esse estado representa se a photo está carregando ou não

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 36 }} // criando um espaçamento no final para o botao nao ficar grudado
            >
                <Center
                    mt={6}
                    px={10}
                >
                    {
                        photoIsLoading ? // se photoIsLoading for true mostrar o skeleton, se for false mostrar a foto de perfil do usuário
                            <Skeleton
                                w={PHOTO_SIZE}  //fazer o msm tamanho do componente que vai utilizar essa mascara nesse caso a foto de perfil (33)
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500" // definindo a cor que vai piscar
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto
                                source={{ uri: 'https://img.quizur.com/f/img628d02b79ce434.31201082.jpg?lastEdited=1653408443' }}
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                            />
                    }
                    <TouchableOpacity>
                        <Text
                            color="green.500"
                            fontWeight="bold"
                            fontSize="md"
                            mt={2}
                            mb={8}
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input
                        bg="gray.600"
                        placeholder="Nome"
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Email"
                        isDisabled // desabilita o input (pode servir para mostrar algum dado que não pode ser modificado)
                    />

                    <Heading
                        color="gray.200"
                        fontSize="md"
                        mb={2}
                        alignSelf="flex-start"
                        mt={12}
                    >
                        Alterar senha
                    </Heading>

                    <Input
                        bg="gray.600"
                        placeholder="Senha antiga"
                        secureTextEntry // ocultar senha do usuario
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Nova senha"
                        secureTextEntry // ocultar senha do usuario
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Confirme a nova senha"
                        secureTextEntry // ocultar senha do usuario
                    />

                    <Button
                        mt={4}
                        title="Atualizar"
                    />
                </Center>
            </ScrollView>
        </VStack>
    )
}