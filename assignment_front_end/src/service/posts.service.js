const API_URL = import.meta.env.VITE_API_URL;

const getFeed = () => {
    return fetch(`${API_URL}/feed`)
    .then(response => response.ok ? response.json() : Promise.reject("Something went wrong"))
    .catch(error => Promise.reject(error));
};

const getSinglePost = (post_id) => {
    return fetch(`${API_URL}/posts/${post_id}`)
    .then(response => response.ok ? response.json() : Promise.reject("Something went wrong"))
    .catch(error => Promise.reject(error));
};

const likePost = (post_id) => {
    return fetch(`${API_URL}/posts/${post_id}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    }).then(handleResponse);
};

const unlikePost = (post_id) => {
    return fetch(`${API_URL}/posts/${post_id}/like`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    }).then(handleResponse);
};

const createPost = (input) => {
    return fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({ text: input })
    }).then(response => {
        if (response.status === 201) return response.json();
        if (response.status === 400) throw 'Bad request';
        if (response.status === 401) throw 'Unauthorised';
        throw 'Something went wrong';
    }).then(rJson => {
        localStorage.setItem("post_id", rJson.post_id);
        return rJson;
    }).catch(err => Promise.reject(err));
};

const editPost = (post_id, input) => {
    return fetch(`${API_URL}/posts/${post_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({ text: input })
    }).then(handleResponse);
};

const deletePost = (post_id) => {
    return fetch(`${API_URL}/posts/${post_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    }).then(handleResponse);
};

function handleResponse(response) {
    if (response.status === 200) return "Success";
    if (response.status === 401) throw 'Unauthorised';
    if (response.status === 403) throw 'Forbidden';
    if (response.status === 404) throw 'Not Found';
    throw "Something went wrong";
}

export const postService = {
    getFeed,
    getSinglePost,
    likePost,
    unlikePost,
    createPost,
    editPost,
    deletePost
};
