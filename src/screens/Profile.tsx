import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base"; //Skeleton é uma mascara para quando um componente nãoe estiver sido carregado mostrar ele
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33; // como o skeleton e a propria foto de perfil utilizam o msm tamanho desse jeito facilita a manutenção do código

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false); // esse estado representa se a photo está carregando ou não
    const [userPhoto, setUserPhoto] = useState('https://img.quizur.com/f/img628d02b79ce434.31201082.jpg?lastEdited=1653408443')

    const toast = useToast()

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true) // ativar o skeleton
        try {
            const photoSelect = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // tipo de conteudo que vai ser aceito da galeria do usuario
                quality: 1, // qualidade vai de 0 a 1,
                aspect: [4, 4], //deixar a imagem quadrada
                allowsEditing: true // recortar a imagem 
            });

            if (photoSelect.canceled) {
                return; // quando o usuario cancela o upload de imagem essa propriedade retorna true e a gente pode parar a função
            }

            if (photoSelect.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelect.assets[0].uri) //pega as informações da foto (local, tamanho etc)

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 0.1) { // transformar de bytes pra megabytes
                    return toast.show({
                        title: 'Tamanho da Imagem Invalido',
                        _title: { alignSelf: 'center' },
                        description: 'Essa Imagem é muito grande. Escolha uma imagem de até 5 MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }

                setUserPhoto(photoSelect.assets[0].uri)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false)
        }

    }


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
                                source={{ uri: userPhoto }}
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                            />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
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
                        fontFamily="heading"
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