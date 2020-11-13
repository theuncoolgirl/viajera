import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api/'

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access_token') ? "JWT " + localStorage.getItem('access_token') : null,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        console.log("111")
        // Prevent infinite loops early
        if (error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
            console.log("222")
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 &&
            error.response.statusText === "Unauthorized") {
            console.log("333")
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                console.log("444")
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);
                console.log("Hitting Here2!: ", tokenParts.exp);

                if (tokenParts.exp > now) {
                    console.log("555")
                    return axiosInstance
                        .post('/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            console.log("666")
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);

                            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                            originalRequest.headers['Authorization'] = "JWT " + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch(err => {
                            console.log("777")
                            console.log("Hitting here1!", err)
                        });
                } else {
                    console.log("888")
                    console.log("Refresh token is expired", tokenParts.exp, now);
                    window.location.href = '/login/';
                }
            } else {
                console.log("999")
                console.log("Refresh token not available.")
                window.location.href = '/login/';
            }
        }


        // specific error handling done elsewhere
        return Promise.reject(error);
    }
);

export default axiosInstance