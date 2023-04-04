import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base'

type Props = IButtonProps & {
    title: string
    variant?: 'solid' | 'outline'
}

export function Button({ title, variant = 'solid', ...rest }: Props) {            // com o variant eu posso estilizar diversos tipos de botao
    return (
        <ButtonNativeBase
            w="full"                                                    // ocupar todo width disponivel
            h={14}
            bg={variant === "outline" ? "transparent" : "green.700"}
            borderWidth={variant === 'outline' ? 1 : 0}
            borderColor="green.500"
            rounded="sm"                                                // border radius
            _pressed={{                                                 // estilizando o botão quando ele estiver pressionado
                bg: variant === "outline" ? "gray.500" : "green.500"
            }}
            {...rest}
        >
            <Text
                color={variant === "outline" ? "green.500" : "white"}
                fontFamily="heading"
                fontSize="sm"
            >
                {title}
            </Text>
        </ButtonNativeBase>
    )
}