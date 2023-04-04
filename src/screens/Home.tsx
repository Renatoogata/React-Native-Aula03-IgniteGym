import { useState } from "react";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { VStack, FlatList } from "native-base";

export function Home() {
    const [group, setGroups] = useState(['costas', 'BICEps', 'Tríceps', 'ombro']);
    const [groupSelected, setGroupSelected] = useState('costa');



    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={group}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected === item}  // verificando se o estado é igual o valor declarado(costa) BOOLEANO
                        onPress={() => setGroupSelected(item)} // Boa logica para selecionar um componente entre varios
                    />
                )}
                horizontal  // deixar componentes na horizontal
                showsHorizontalScrollIndicator={false} //desabilitar barra de rolagem horizontal
                _contentContainerStyle={{ px: 8 }} //espacamento interno
                my={10} //margin top&bottom
                maxH={10} // a flatlist ocupa todo o espaço disponivel, com o maxHeight eu garanto que ele só vai ter o tamanho estipulado(10)             
            />
        </VStack>
    )
}