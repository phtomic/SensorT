import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
} from 'axios';

export class AxiosController {
  public instance: AxiosStatic;
  constructor() {
    this.instance = axios;
  }
  public async get(
    url: string,
    params?: AxiosRequestConfig,
  ): Promise<AxiosResponse | any> {
    // Realiza a requisição GET usando o Axios
    this.instance
      .get(url, params)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error: AxiosError) => {
        return Promise.reject(error.response?.data);
      });
  }
  public async post(
    url: string,
    params?: AxiosRequestConfig,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse | any> {
    // Realiza a requisição POST usando o Axios
    return this.instance
      .post(url, params, headers)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error: AxiosError) => {
        return Promise.reject(error.response?.data);
      });
  }
  public async put(
    url: string,
    params?: AxiosRequestConfig,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse | any> {
    // Realiza a requisição POST usando o Axios
    return this.instance
      .put(url, params, headers)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error: AxiosError) => {
        return Promise.reject(error.response?.data);
      });
  }

  public async delete(
    url: string,
    params?: AxiosRequestConfig,
  ): Promise<AxiosResponse | any> {
    // Realiza a requisição POST usando o Axios
    return this.instance
      .delete(url, params)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error: AxiosError) => {
        return Promise.reject(error.response?.data);
      });
  }
}
