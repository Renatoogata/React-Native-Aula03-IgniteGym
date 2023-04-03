import { VStack, Image, Text, Center } from 'native-base' //Componente de Layout (alinha um componente em baixo do outro)

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

export function SignIn() {
    return (
        <VStack flex={1} bg='gray.700'>
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

        </VStack>
    );
}