const API_URL = import.meta.env.VITE_API_URL;

const getUser = (user_id) => {
    return fetch(`${API_URL}/users/${user_id}`)
    .then(response => {
        if (response.ok) return response.json();
        if (response.status === 404) throw 'Bad request';
        throw "Something went wrong";
    }).catch(error => Promise.reject(error));
};

const followUser = (user_id) => {
    return fetch(`${API_URL}/users/${user_id}/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    }).then(handleSocialResponse);
};

const unfollowUser = (user_id) => {
    return fetch(`${API_URL}/users/${user_id}/follow`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    }).then(handleSocialResponse);
};

const searchUser = (query) => {
    return fetch(`${API_URL}/search?q=${query}`)
    .then(response => {
        if (response.ok) return response.json();
        if (response.status === 400) throw 'Bad request';
        throw 'Something went wrong';
    }).catch(err => Promise.reject(err));
};

function handleSocialResponse(response) {
    if (response.ok) return "Success";
    if (response.status === 401) throw 'Unauthorised';
    if (response.status === 403) throw 'Forbidden';
    if (response.status === 404) throw 'Not Found';
    throw "Something went wrong";
}

export const socialService = {
    getUser,
    followUser,
    unfollowUser,
    searchUser
};
