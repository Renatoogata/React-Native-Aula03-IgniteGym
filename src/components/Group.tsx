import { Text, Pressable, IPressableProps } from "native-base"; //Pressable parecido com touchableOpacity, mas sem o efeito da opacidade

type Props = IPressableProps & {
    name: string
    isActive: boolean
}

export function Group({ name, isActive, ...rest }: Props) {
    return (
        <Pressable
            mr={3}
            w={24}
            h={10}
            bg="gray.600"
            rounded="md" //arredondar bordas
            alignItems="center"
            justifyContent="center"
            overflow="hidden" // manter as coisas dentro do limite dele

            isPressed={isActive} // manter o _pressed Ativo (no caso manter ele com as bordas verdes)
            _pressed={{
                borderColor: "green.500",
                borderWidth: 1
            }}
            {...rest}
        >
            <Text
                color={isActive ? "green.500" : "gray.200"}
                textTransform="uppercase" //Deixar tudo maiúsculo
                fontSize="xs"
                fontWeight="bold"
            >
                {name}
            </Text>
        </Pressable>
    );
}