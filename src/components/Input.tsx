import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'
//FormControl dá para saber se o input é invalido ou não

type Props = IInputProps & {
    errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
    const invalid = !!errorMessage || isInvalid;
    // !!errorMessage -> retorno booleano, se existe mensagem de erro o retorno e verdadeiro
    // isInvalid -> se for inválido porque meu input invalidou ele (propriedade do Input)

    return (
        <FormControl
            isInvalid={invalid} // isInvalid tem que receber a const invalid para saber se precisa mostrar a mensagem de erro
            mb={4}
        >
            <NativeBaseInput
                bg='gray.700'                                       // cor de fundo
                h={14}                                              // height
                px={4}                                              // padding horizontal
                borderWidth={0}                                     // tirar a borda
                fontSize='md'
                color="white"
                fontFamily="body"

                isInvalid={invalid}                                 //passando o isInvalid para o input para estilizar quando tiver erro
                _invalid={{
                    borderWidth: 1,
                    borderColor: "red.500"
                }}

                placeholderTextColor="gray.300"
                _focus={{                                           // alterando propriedades quando o input estiver selecionado
                    bg: 'gray.700',                                 // cor de fundo
                    borderWidth: 1,                                 // colocando borda
                    borderColor: 'green.500'
                }}
                {...rest}                                           // passar as props do input aonde ele for utilizado (fazer aparecer as sugestões ex: placeholder)(rest sempre tem que ser o ultimo)
            />

            <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}