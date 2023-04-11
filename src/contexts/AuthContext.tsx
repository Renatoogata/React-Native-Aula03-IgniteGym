import { createContext, ReactNode } from "react";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps); // criação do contexto

export function AuthContextProvider({ children }: AuthContextProviderProps) { // compartilhamento do contexto com a aplicação
    return (
        <AuthContext.Provider value={{
            user: {
                id: '1',
                name: 'Renato',
                email: 'renato@email.com',
                avatar: 'renato.png'
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}