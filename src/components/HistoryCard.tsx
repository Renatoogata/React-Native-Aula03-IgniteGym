import { Heading, HStack, Text, VStack } from "native-base";


export function HistoryCard() {
    return (
        <HStack
            w="full"
            px={5}
            py={4}
            mb={3}
            rounded="md"
            bg="gray.800"
            justifyContent="space-between"
            alignItems="center"

        >
            <VStack
                marginRight={5}
                flex={1}
            >
                <Heading
                    fontSize="md"
                    color="white"
                    textTransform="capitalize" // manter a primeira letra maiúcula
                    numberOfLines={1} // nunca passar 1 linha
                    fontFamily="heading"
                >
                    Costas
                </Heading>
                <Text
                    fontSize="md"
                    color="gray.100"
                    numberOfLines={1} // nunca passar 1 linha
                >
                    Puxada Frontal
                </Text>
            </VStack>

            <Text
                color="gray.300"
                fontSize="md"
            >
                08:56
            </Text>
        </HStack>
    )
}