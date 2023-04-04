import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base' //Componente de Layout (alinha um componente em baixo do outro)

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignUp() {

    const navigation = useNavigation();

    function handleLogIn() {
        navigation.goBack()
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
                        Crie sua conta
                    </Heading>

                    <Input
                        placeholder='Nome'
                    />

                    <Input
                        placeholder='E-mail'
                        keyboardType='email-address'
                        autoCapitalize='none' //manter tudo em minusculo
                    />

                    <Input
                        placeholder='Senha'
                        secureTextEntry // transformando a senha em estrelinha
                    />

                    <Button title='Criar e acessar' />
                </Center>

                <Button
                    title='Voltar para o login'
                    variant='outline'
                    mt={24}
                    onPress={handleLogIn}
                />
            </VStack>
        </ScrollView>
    );
}