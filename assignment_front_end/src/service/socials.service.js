const getUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id)

    .then((response) => {
        if(response.status === 200) {
            return response.json();
        }
        else if (response.status === 404) {
            throw 'Bad request';
        }
        else {
            throw "Something went wrong"
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((error) => {
        console.log('Err', error)
        return Promise.reject(error)
    })
}

const followUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return "Follow Successful"
        }
        else if (response.status === 401) {
            throw 'Unauthorised'
        }
        else if (response.status === 403) {
            throw 'You are already following this user'
        }
        else if (response.status === 404) {
            throw 'Not Found'
        }
        else {
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const unfollowUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return "Unfollow Successful"
        }
        else if (response.status === 401) {
            throw 'Unauthorised'
        }
        else if (response.status === 403) {
            throw 'You can not unfollow a user that you are already unfollowing'
        }
        else if (response.status === 404) {
            throw 'Not Found'
        }
        else {
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const searchUser = (query) => {
    return fetch("http://localhost:3333/search?q=" + query)
    .then(response => {
        if(response.status === 200) {
            return response.json();
        }
        else if (response.status === 400) {
            throw 'Bad request';
        }
        else {
            throw 'Something went wrong'
        }
    })
    .then(rJson => {
        return rJson
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

export const socialService = {
    getUser,
    followUser,
    unfollowUser,
    searchUser
}