import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base' //Componente de Layout (alinha um componente em baixo do outro)

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }} // Preencher a tela 
            showsVerticalScrollIndicator={false} // Tirar barra de rolagem
        >
            <VStack flex={1} bg='gray.700' px={10}>
                <Image
                    source={BackgroundImg}
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

                    <Input
                        placeholder='E-mail'
                        keyboardType='email-address'
                        autoCapitalize='none' //manter tudo em minusculo
                    />

                    <Input
                        placeholder='Senha'
                        secureTextEntry // transformando a senha em estrelinha
                    />

                    <Button title='Acessar' />
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
                        variant='outline' />
                </Center>
            </VStack>
        </ScrollView>
    );
}