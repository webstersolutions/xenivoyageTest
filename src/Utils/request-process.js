import Cookies from "universal-cookie";
import axios from 'axios';

import React from 'react';

const cookies = new Cookies();

class AxiosAPI extends React.Component {
    constructor() {
        super();

        const API_HOSTNAME = `${process.env.API_URL}:${process.env.API_PORT}`;
        // const API_HOSTNAME = `http://localhost:8445`;

        let service = axios.create({
            baseURL: API_HOSTNAME,
            crossDomain: true,
        });
        service.interceptors.response.use(this.handleSuccess, this.handleError);
        this.service = service;
    }

    handleSuccess = (res) => {
        return res;
    };

    handleError = (error) => {
        switch (error.response.status) {
            //Unauthorized
            case 401:
                this.redirectTo(document, '/');
                cookies.remove('x-access-token');
                break;
            //Undefined endpoint
            case 404:
                // this.redirectTo(document, '/dashboard');
                break;
            default:
                // this.redirectTo(document, '/');
                break;
        }
        return Promise.reject(error)
    };

    redirectTo = (document, path) => {
        document.location = path
    };

    get(path) {
        let token = cookies.get("x-access-token");
        return this.service.get(path, {
            headers: {
                accept: "application/json",
                'x-access-token': token
            }
        }).then(
            (response) => {
                return Promise.resolve(response);
            }
        );
    }

    patch(path, payload) {
        let token = cookies.get("x-access-token");
        return this.service.request({
            method: 'PATCH',
            url: path,
            responseType: 'json',
            data: payload,
            headers: {
                accept: "application/json",
                'x-access-token': token
            }
        }).then((response) => {
            return Promise.resolve(response);
        });
    }

    post(path, payload) {
        let token = cookies.get("x-access-token");
        return this.service.request({
            method: 'POST',
            url: path,
            responseType: 'json',
            data: payload,
            headers: {
                accept: "application/json",
                'x-access-token': token,
                'Auth-key': 'xeni$#123'
            }
        }).then((response) => {
            return Promise.resolve(response);
        });
    }

    put(path, payload) {
        let token = cookies.get("x-access-token");
        return this.service.request({
            method: 'PUT',
            url: path,
            responseType: 'json',
            data: payload,
            headers: {
                accept: "application/json",
                'x-access-token': token
            }
        }).then((response) => {
            return Promise.resolve(response);
        });
    }

    delete(path, payload) {
        let token = cookies.get("x-access-token");
        return this.service.request({
            method: 'DELETE',
            url: path,
            responseType: 'json',
            data: payload,
            headers: {
                accept: "application/json",
                'x-access-token': token
            }
        }).then((response) => {
            return Promise.resolve(response);
        });
    }
}

export default new AxiosAPI();
