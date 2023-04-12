import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "native-base";

type Props = {
    data: HistoryDTO;
}


export function HistoryCard({ data }: Props) {
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
                    {data.group}
                </Heading>
                <Text
                    fontSize="md"
                    color="gray.100"
                    numberOfLines={1} // nunca passar 1 linha
                >
                    {data.name}
                </Text>
            </VStack>

            <Text
                color="gray.300"
                fontSize="md"
            >
                {data.hour}
            </Text>
        </HStack>
    )
}