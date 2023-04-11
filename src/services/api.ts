import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    // pegar o ip onde está rodando o servidor, no meu caso no terminal digitar 'ifconfig' e pegar o inet
    baseURL: 'http://192.168.0.2:3333'
})

//Intercepatando todas as requisições pro backend
// api.interceptors.request.use((config) => { // config -> toda a configuração da requisição
//     return config; // sempre dar o retorn na propria config para a promise continuar para o backend
// }, (error) => {
//     return Promise.reject(error); // devolver o erro para quem solicitou
// })


// interceptando todas as respostas do backend

// intecerpetors.response tem duas arrow function:
// 1- se a respota for bem sucessida (ja estou pegando a respota e repassando ela direto)
// 2- se for um erro (estou pegando ela e retornando uma Promise.reject padronizado pela minha classe AppError)
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message)); // Aqui eu retorno um erro customizado pelo meu backend
    } else {
        return Promise.reject(error) // retorno erro genérico
    }
})

export { api }