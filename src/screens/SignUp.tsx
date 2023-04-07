import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base' //Componente de Layout (alinha um componente em baixo do outro)
import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string
}

const signUpSchema = yup.object({ // Schema de validação do meu formulário
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email').email('Email inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
    password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'A confirmação da senha não confere.') // oneOf pega uma referencia de algum input do schema, nesse caso o password
});

export function SignUp() {

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema) // estou passando meu signUpSchema para o meu formulário para fazaer a validação
    })

    const navigation = useNavigation();

    function handleLogIn() {
        navigation.goBack()
    }

    function handleSignUp({ email, name, password, password_confirm }: FormDataProps) {
        console.log({ email, name, password, password_confirm })
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }} // Preencher a tela 
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
                        Crie sua conta
                    </Heading>

                    <Controller                         // esse Controller pertence ao control
                        control={control}               // criado com o useForm
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input                      // esse input está sendo controlado pelo Controller
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none' //manter tudo em minusculo
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
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

                    <Controller
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirme a senha'
                                secureTextEntry // transformando a senha em estrelinha
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)} // usado para chamar a função clicando no certinho do teclado
                                returnKeyType="send" // mudar o icone do teclado para enviar
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />

                    <Button
                        title='Criar e acessar'
                        onPress={handleSubmit(handleSignUp)} // a função handleSubmit do useForm será a responsável por passar todos os dados do formulario
                    />
                </Center>

                <Button
                    title='Voltar para o login'
                    variant='outline'
                    mt={12}
                    onPress={handleLogIn}
                />
            </VStack>
        </ScrollView>
    );
}