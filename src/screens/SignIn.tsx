import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base' //Componente de Layout (alinha um componente em baixo do outro)
import { useForm, Controller } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { useAuth } from '@hooks/useAuth';

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { AppError } from '@utils/AppError';

type FormDataProps = {
    email_login: string;
    password: string;
}

const logInSchema = yup.object({
    email_login: yup.string().required('Informe o email').email('Email digitado errado'),
    password: yup.string().required('Informe a senha'),
})

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const { sigIn } = useAuth();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(logInSchema)
    })

    const navigation = useNavigation<AuthNavigatorRoutesProps>(); //Como a app vai ter 2 tipos de rotas( usuario logado e não logado ) é bom definir e separar cada uma

    async function handleLogin({ email_login, password }: FormDataProps) {
        try {
            setIsLoading(true)
            await sigIn(email_login, password);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde' // estou verificando se é uma instancia de AppError, se for vai ter a propria mensagem customizada do backend, se não será lançada uma mensagem genérica

            setIsLoading(false)

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })


        }
    }

    function handleNewAccount() {
        navigation.navigate('signUp')
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }} // Preencher a tela 
            showsVerticalScrollIndicator={false} // Tirar barra de rolagem
        >
            <VStack flex={1} px={10}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg} // define que essa imagem é padrão para que a app carregue mais rapido
                    alt="Pessoas treinando"
                    resizeMode='contain' //se enquadra melhor na tela
                    position="absolute" //começar do inicio da tela e todos os outros componentes ficam em cima dela
                />

                <Center
                    my={24}/* my -> margin na vertical (tanto em cima quanto em baixo) */
                >
                    <LogoSvg />

                    <Text color='gray.100' fontSize='sm'>
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
                        Acesse sua conta
                    </Heading>


                    <Controller
                        control={control}
                        name="email_login"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none' //manter tudo em minusculo
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email_login?.message}
                            />
                        )}
                    />


                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry // transformando a senha em estrelinha
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />


                    <Button
                        title='Acessar'
                        onPress={handleSubmit(handleLogin)}
                        isLoading={isLoading} // botão de carregamento (bolinha girando)
                    />
                </Center>

                <Center mt={24}>
                    <Text
                        color="gray.100"
                        fontSize="sm" mb={3}
                        fontFamily="body">
                        Ainda não tem acesso?
                    </Text>

                    <Button
                        title='Criar Conta'
                        variant='outline'
                        onPress={handleNewAccount}
                    />
                </Center>
            </VStack>
        </ScrollView>
    );
}