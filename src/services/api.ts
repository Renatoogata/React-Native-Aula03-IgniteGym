import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosInstance, AxiosError } from "axios";

type SignOut = () => void;

type APIInstaceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

type PromiseType = {
    onSucess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

const api = axios.create({
    // pegar o ip onde está rodando o servidor, no meu caso no terminal digitar 'ifconfig' e pegar o inet
    baseURL: 'http://192.168.0.2:3333'
}) as APIInstaceProps


let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;


api.registerInterceptTokenManager = signOut => {
    // interceptando todas as respostas do backend
    // intecerpetors.response tem duas arrow function:
    // 1- se a respota for bem sucessida (ja estou pegando a respota e repassando ela direto)
    // 2- se for um erro (estou pegando ela e retornando uma Promise.reject padronizado pela minha classe AppError)
    const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {

        if (requestError?.response?.status === 401) { // se for um erro com status 401 quer dizer que temos uma requisição não autorizada, é um forte indício de ser um erro token ivalidado
            if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') { // checando se no erro há uma mensagem de token.expired ou token.invalid
                // se o erro chegar até aqui, aqui tentaremos gerar um novo token para o usuario

                const { refresh_token } = await storageAuthTokenGet(); // recuperando o refresh_token

                if (!refresh_token) {
                    signOut(); // se não existir desloga o usuário
                    return Promise.reject(requestError);
                }

                const originalRequestConfig = requestError.config; // todas as configurações da requisição que foi feita

                // Fluxo de adicionar as requisições na fila por erro de token
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ // adicionando na pilha todas as requisições que falharam
                            onSucess: (token: string) => {
                                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` }; // se a função de sucesso for chamada vai atribuir o novo token
                                resolve(api(originalRequestConfig)); // vai realizar a requisição com o novo token
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error); // na função de erro só vai retornar o erro
                            },
                        })
                    });
                }

                isRefreshing = true;

                // Atribuir um novo token através do refresh_token
                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.post('/sessions/refresh-token', { refresh_token }); // buscando pelo token
                        await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token }) // guardando os novos token no dispositivo do usuário

                        if (originalRequestConfig.data) {
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data); // transformando em objeto o tipo de axiosRequest
                        }

                        originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` } // pegando a requisição a atribuindo o novo token
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}` // atulizando as proximas requisições

                        failedQueue.forEach(request => {
                            request.onSucess(data.token);
                        });

                        console.log("token atualizado");

                        resolve(api(originalRequestConfig));

                    } catch (error: any) {
                        failedQueue.forEach(request => {
                            request.onFailure(error);
                        });

                        signOut();
                        reject(error);
                    } finally {
                        isRefreshing = false;
                        failedQueue = []; // limpar a fila de requisições
                    }
                })
            }

            signOut(); // como não entrou no if de cima, não é um problema de token expirado então vamos por segurança deslogar o usuário
        }



        if (requestError.response && requestError.response.data) { // Verificando se é um erro genérico ou erro tratado no backend
            return Promise.reject(new AppError(requestError.response.data.message)); // Aqui eu retorno um erro customizado pelo meu backend
        } else {
            return Promise.reject(requestError) // retorno erro genérico
        }
    });

    return () => {
        api.interceptors.response.eject(interceptTokenManager); // deslogar o usuário caso ele não consiga um token atualizado
    }
}

//Intercepatando todas as requisições pro backend
// api.interceptors.request.use((config) => { // config -> toda a configuração da requisição
//     return config; // sempre dar o retorn na propria config para a promise continuar para o backend
// }, (error) => {
//     return Promise.reject(error); // devolver o erro para quem solicitou
// })




export { api }