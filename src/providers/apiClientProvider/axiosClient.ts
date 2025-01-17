import axios from 'axios';
// import store from '../store';
// import { helper } from './helper';
// import { i18n } from '../i18n.js';
import Bugsnag from "@bugsnag/js";

let baseURL = import.meta.env.VITE_API_URL;
//
// if (localStorage.getItem('url') !== null) {
//     baseURL = localStorage.getItem('url');
// } else {
//     baseURL = window.location.protocol + "//" + window.location.host + "/";
//     if (window.location.host !== '127.0.0.1' && window.location.host !== 'localhost') {
//         localStorage.setItem('url', baseURL);
//     }
// }

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.response.use(
    response => response,
    error => {
        Bugsnag.notify(error);
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    window.location.href = '/connect';
                    break;
                case 422:
                    // helper.toastify('Des erreurs sont présentes dans le formulaire', { className: 'toastify-content warning' });
                    // store.commit('auth/setErrors', error.response.data.errors);
                    return Promise.reject(error);
                case 404:
                    // helper.toastify('La ressource que vous recherchez est inexistante', { className: 'toastify-content danger' });
                    break;
                case 500:
                    // helper.toastify('Erreur serveur', { className: 'toastify-content danger' });
                    return Promise.reject(error);
                default:
                    return Promise.reject(error);
            }
        } else {
            // helper.toastify('Erreur serveur', { className: 'toastify-content danger' });
            return Promise.reject(error);
        }
    }
);

export default axiosClient;
