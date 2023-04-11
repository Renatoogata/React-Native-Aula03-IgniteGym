import { createContext, ReactNode, useEffect, useState } from "react";

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>
    isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps); // criação do contexto

export function AuthContextProvider({ children }: AuthContextProviderProps) { // compartilhamento do contexto com a aplicação
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password }); // pegando no backend os dados do usuario conforme os parametros(email, password)

            if (data.user) {
                setUser(data.user);         // salvando no Estado do contexto os dados do usuário para toda a aplicação poder utiliza-las
                storageUserSave(data.user); // salvando os dados no dispositivo do usuario com AsyncStorage
            }
        } catch (error) {
            throw error;
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true); // alterando o estado para ativar a tela de carregamento
            setUser({} as UserDTO); // atulizando o estado de usuario para um estado vazio (do tipo UserDTO)
            await storageUserRemove(); // removendo o usuario do Storage
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false); // desativando a tela de carregamento
        }
    }

    async function loadUserData() { // função para checar no Storage se tem algum registro de usuario para logado automaticamente
        try {
            const userLogged = await storageUserGet(); // tentando recuperar algum dado de usuario do Storage

            if (userLogged) {
                setUser(userLogged) // setando no estado do contexto os dados do usuario do Storage
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            isLoadingUserStorageData,
        }}>
            {children}
        </AuthContext.Provider>
    )
}