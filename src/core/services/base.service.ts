/**
 * @class BaseService
 * @description
 */
import axios from 'axios';
import { environment } from 'src/config.staging';
import { API } from 'src/shared/constants/api.constant';

const httpInst = axios.create({
    baseURL: environment.apiUrl,
    // baseURL: environment.apiUrl,
    timeout: 2500,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-platform-code': 'rt',
        'x-version-code': '27',
        'x-api-key': '8fa4304d-a5b6-4f10-baeb-a80650a480a4',
    },
});

// Add a request interceptor
httpInst.interceptors.request.use(
    async (config) => {
        console.log('Interceptor =>', config.url);
        const accessTokenLTM = await localStorage.getItem('__access_token_LTM__');

        const initApi = config.url.includes('initiate');
        const isRefreshRequest = config.url.includes('refresh');
        if (!initApi && !isRefreshRequest) {
            config.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-platform-code': 'rt',
                'x-version-code': '27',
                'x-api-key': '8fa4304d-a5b6-4f10-baeb-a80650a480a4',
                Authorization: `Bearer ${accessTokenLTM}`,
            };
        }
        return config;
    },

    (error) => {
        Promise.reject(error);
    }
);

// Add a response interceptor
httpInst.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error && error.response === undefined) {
            localStorage.removeItem('__access_token_LTM__');
            localStorage.removeItem('__refresh_token_RTM__');
        }
        if (error.response.status === 401 || (error && error.error_message === 'Invalid LTM!')) {
            // console.log('Token refresh');
            axios
                .post(`${environment.apiUrl}${API.REFRESH_TOKEN_API}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('__refresh_token_RTM__')}`,
                    },
                })
                .then((res) => {
                    if (res) {
                        localStorage.setItem('__access_token_LTM__', 'res?.access_token');
                        localStorage.setItem('__refresh_token_RTM__', 'res?.refresh_token');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            const oldRequest = error.config;
            oldRequest._retry = true;
            oldRequest.HttpHeaders['Authrization'] = localStorage.getItem('__access_token_LTM__');
            return axios(oldRequest);
        }
        return Promise.reject(error);
    }
);

export default httpInst;
