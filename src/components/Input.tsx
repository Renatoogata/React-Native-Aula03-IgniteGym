import { Input as NativeBaseInput, IInputProps } from 'native-base'

export function Input({ ...rest }: IInputProps) {
    return (
        <NativeBaseInput
            bg='gray.700'                                       // cor de fundo
            h={14}                                              // height
            px={4}                                              // padding horizontal
            borderWidth={0}                                     // tirar a borda
            fontSize='md'
            color="white"
            fontFamily="body"
            mb={4}                                              // margin botton
            placeholderTextColor="gray.300"
            _focus={{                                           // alterando propriedades quando o input estiver selecionado
                bg: 'gray.700',                                 // cor de fundo
                borderWidth: 1,                                 // colocando borda
                borderColor: 'green.500'
            }}
            {...rest}                                           // passar as props do input aonde ele for utilizado (fazer aparecer as sugestões ex: placeholder)(rest sempre tem que ser o ultimo)
        />
    );
}