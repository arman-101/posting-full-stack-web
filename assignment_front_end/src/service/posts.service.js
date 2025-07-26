const getFeed = () => {
    return fetch("http://localhost:3333/feed")

    .then((response) => {
        if(response.status === 200) {
            return response.json();
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

const getSinglePost = (post_id) => {

    return fetch("http://localhost:3333/posts/" + post_id)

    .then((response) => {
        if(response.status === 200) {
            return response.json();
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

const likePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return "Like Successful"
        }
        else if (response.status === 401) {
            throw 'Unauthorised'
        }
        else if (response.status === 403) {
            throw 'You have already liked this post'
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

const unlikePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return "Unlike Successful"
        }
        else if (response.status === 401) {
            throw 'Unauthorised'
        }
        else if (response.status === 403) {
            throw 'You can not unlike a post that you have already unliked'
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

const createPost = (input) => {
    return fetch("http://localhost:3333/posts",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": input
        })
    })
    .then(response => {
        if(response.status === 201) {
            return response.json();
        }
        else if (response.status === 400) {
            throw 'Bad request';
        }
        else if (response.status === 401) {
            throw 'Unauthorised';
        }
        else {
            throw 'Something went wrong'
        }
    })
    .then(rJson => {
        localStorage.setItem("post_id", rJson.post_id);
        return rJson
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const editPost = (post_id, input) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": input
        })
    })
    .then(response => {
        if(response.status === 200) {
            return "Updated Post!";
        }
        else if (response.status === 400) {
            throw 'Bad request';
        }
        else if (response.status === 401) {
            throw 'Unauthorised';
        }
        else if (response.status === 403) {
            throw 'You can only update your own posts';
        }
        else if (response.status === 404) {
            throw 'Not Found';
        }
        else {
            throw 'Something went wrong'
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const deletePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200) {
            return "Deleted Post!"
        }
        else if (response.status === 401) {
            throw 'Unauthorised';
        }
        else if (response.status === 403) {
            throw 'You can only delete your own posts';
        }
        else if (response.status === 404) {
            throw 'Not Found';
        }
        else {
            throw 'Something went wrong'
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

export const postService = {
    getFeed,
    getSinglePost,
    likePost,
    unlikePost,
    createPost,
    editPost,
    deletePost
}