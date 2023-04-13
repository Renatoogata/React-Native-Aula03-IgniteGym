import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base"; //Skeleton é uma mascara para quando um componente nãoe estiver sido carregado mostrar ele
import { Controller, useForm } from "react-hook-form";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const PHOTO_SIZE = 33; // como o skeleton e a propria foto de perfil utilizam o msm tamanho desse jeito facilita a manutenção do código

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const updateProfileSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome'),
    password: yup
        .string()
        .min(6, 'A senha deve ter no mínimo 6 dígitos')
        .nullable()
        .transform((value) => !!value ? value : null), // Quando não tiver nenhum valor digitado ele retorna o campo para null ao invés de string vazia
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null) // Quando não tiver nenhum valor digitado ele retorna o campo para null ao invés de string vazia
        .oneOf([yup.ref('password')], 'A confirmação de senha não confere')
        .when('password', {
            is: (Field: any) => Field,
            then: (updateProfileSchema) => updateProfileSchema
                .nullable()
                .required('Informe a confirmação de senha') //quando o usuario digitar a senha no campo nova senha, esse campo sempre se tornará obrigatorio
                .transform((value) => !!value ? value : null),
        })
});

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false); // esse estado representa se a photo está carregando ou não
    const [userPhoto, setUserPhoto] = useState('https://img.quizur.com/f/img628d02b79ce434.31201082.jpg?lastEdited=1653408443')

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({ // passando valores padrões para o formulário
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(updateProfileSchema),
    });

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

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true)

            const userUpdated = user; // pegando os dados do usuário
            userUpdated.name = data.name // atualizando o novo nome do usuário

            await api.put('/users', data);

            await updateUserProfile(userUpdated) // chamando a função que atuliza o nome do usuario no contexto

            toast.show({
                title: 'Pefil atulizado com sucesso',
                placement: 'top',
                bgColor: 'green.500',
            })
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Erro ao atualizar dados do usuário. Tente novamente mais tarde.'
            toast.show({
                title,
                placement: 'top',
                bg: 'red.500'
            })
        } finally {
            setIsUpdating(false);
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

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) =>
                            <Input
                                bg="gray.600"
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        }
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) =>
                            <Input
                                bg="gray.600"
                                placeholder="Email"
                                onChangeText={onChange}
                                value={value}
                                isDisabled// desabilita o input (pode servir para mostrar algum dado que não pode ser modificado)
                                isReadOnly // não poder escrever no input
                                _disabled={{ bg: 'gray.500' }} // mudando a cor de fundo 
                            />
                        }
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

                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { onChange } }) =>
                            <Input
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry // ocultar senha do usuario
                                onChangeText={onChange}
                                errorMessage={errors.old_password?.message}
                            />

                        }
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) =>
                            <Input
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry // ocultar senha do usuario
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        }
                    />

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange } }) =>
                            <Input
                                bg="gray.600"
                                placeholder="Confirme a nova senha"
                                secureTextEntry // ocultar senha do usuario
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                            />
                        }
                    />
                    <Button
                        mt={4}
                        title="Atualizar"
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                    />
                </Center>
            </ScrollView>
        </VStack>
    )
}