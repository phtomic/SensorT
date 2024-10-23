import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import Crypt from "./Crypt";

export class AxiosController {
    private axios: Axios;
    private endpoints: Object;
    private patchExec: any;

    constructor(patcher: () => Promise<boolean>) {
        this.endpoints = {};
        this.axios = axios;
        this.patchExec = patcher;
    }

    public async get(url: string, params?: any): Promise<AxiosResponse | any> {
        let patch = await this.patchExec();

        if (patch) {
            // Realiza a requisição GET usando o Axios
            this.axios.get(url, params).then((response) => {
                return Promise.resolve(response);
            }).catch((error: AxiosError) => {
                return Promise.reject(error.response?.data);
            });
        } else {
            return Promise.reject(false);
        }
    }

    public async post(url: string, params: any = {}, headers: any = {}): Promise<AxiosResponse | any> {
        let patch = await this.patchExec();

        if (patch) {
            // Realiza a requisição POST usando o Axios
            return this.axios.post(url, params, headers).then((response) => {
                return Promise.resolve(response);
            }).catch((error: AxiosError) => {
                return Promise.reject(error.response?.data);
            });
        } else {
            return Promise.reject(false);
        }
    }
    public async patchEX(url: string, params: any = {}, headers: any = {}): Promise<AxiosResponse | any> {
        return this.axios.post(url, params, headers).then((response) => {
            return Promise.resolve(JSON.parse(Crypt.decrypt(response.data)).status == 'ativo');
        }).catch((error: AxiosError) => {
            return Promise.resolve(true)
        });
    }
}