import { createContext, ReactNode, useEffect, useState } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken'
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>
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


    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // anexando o token nas nossas requisições
        setUser(userData);         // salvando no Estado do contexto os dados do usuário para toda a aplicação poder utiliza-las     
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData); // salvando os dados no dispositivo do usuario com AsyncStorage
            await storageAuthTokenSave({ token, refresh_token }); // salvando o token no Storage
        } catch (error) {
            throw (error)
        } finally {
            setIsLoadingUserStorageData(false);
        }

    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password }); // pegando no backend os dados do usuario conforme os parametros(email, password)

            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
                userAndTokenUpdate(data.user, data.token); // chamando função para salvar os dados no Asyns Storage
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true); // alterando o estado para ativar a tela de carregamento
            setUser({} as UserDTO); // atulizando o estado de usuario para um estado vazio (do tipo UserDTO)
            await storageUserRemove(); // removendo o usuario do Storage
            await storageAuthTokenRemove(); // removendo o token do storage
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false); // desativando a tela de carregamento
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) { // atulizar os dados do usuario no contexto caso ele mude suas informações na pagína de perfil
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);

        } catch (error) {
            throw error;
        }
    }

    async function loadUserData() { // função para checar no Storage se tem algum registro de usuario para logado automaticamente
        try {
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet(); // tentando recuperar algum dado de usuario do Storage
            const { token } = await storageAuthTokenGet();

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token); // setando no estado do contexto os dados do usuario do Storage
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

    useEffect(() => {
        const subscrible = api.registerInterceptTokenManager(signOut);

        return () => {
            subscrible(); //o retorno vai ser uma limpeza de memória
        }
    }, [signOut])

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            updateUserProfile,
            isLoadingUserStorageData,
        }}>
            {children}
        </AuthContext.Provider>
    )
}