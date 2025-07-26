const API_URL = import.meta.env.VITE_API_URL;

const sign_up = (first_name, last_name, username, password) => {
    return fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, username, password })
    })
    .then(response => {
        if (response.status === 201) return response.json();
        if (response.status === 400) throw 'Bad request';
        throw 'Something went wrong';
    })
    .then(rJson => {
        localStorage.setItem("user_id", rJson.user_id);
        return rJson;
    })
    .catch(err => Promise.reject(err));
};

const login = (username, password) => {
    return fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) return response.json();
        if (response.status === 400) throw 'Bad request';
        throw 'Something went wrong';
    })
    .then(rJson => {
        localStorage.setItem("user_id", rJson.user_id);
        localStorage.setItem("session_token", rJson.session_token);
        return rJson;
    })
    .catch(err => Promise.reject(err));
};

const logOut = () => {
    return fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem("user_id");
            localStorage.removeItem("session_token");
            return 'Logout Successful';
        }
        if (response.status === 401) throw 'Not Logged In';
        throw "Something went wrong";
    })
    .catch(error => Promise.reject(error));
};

export const userService = {
    sign_up,
    login,
    logOut
};
