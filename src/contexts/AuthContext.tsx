import { createContext, ReactNode, useState } from "react";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    sigIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps); // criação do contexto

export function AuthContextProvider({ children }: AuthContextProviderProps) { // compartilhamento do contexto com a aplicação
    const [user, setUser] = useState<UserDTO>({} as UserDTO);

    async function sigIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });

            if (data.user) {
                setUser(data.user)
            }
        } catch (error) {
            throw error;
        }


    }

    return (
        <AuthContext.Provider value={{ user, sigIn }}>
            {children}
        </AuthContext.Provider>
    )
}