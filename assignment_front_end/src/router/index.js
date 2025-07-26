import { createRouter, createWebHistory } from 'vue-router';

import Login from "../views/pages/Login.vue"
import SignUp from "../views/pages/SignUp.vue"
import Feed from "../views/pages/Feed.vue"
import CreatePost from "../views/components/CreatePost.vue"
import EditPost from "../views/components/EditPost.vue"
import Profile from "../views/pages/Profile.vue"
import SinglePost from "../views/components/SinglePost.vue"
import ViewLikes from "../views/components/ViewLikes.vue"
import SingleUser from "../views/components/SingleUser.vue"
import Search from "../views/pages/Search.vue"
import NotFound from "../views/pages/NotFound.vue"

// If authenticated, keep going, otherwise lead to login page
const ifAuthenticated = (to, from, next) => {
    const loggedIn = localStorage.getItem('session_token');
    if(loggedIn) {
        next()
        return
    }
    next('/login')
}

const routes = [
    { path: "/login", component: Login},
    { path: "/signup", component: SignUp},
    { path: "/", component: Feed},
    { path: "/feed", component: Feed},
    { path: "/post", component: CreatePost, beforeEnter: ifAuthenticated},
    { path: "/editpost/:id", component: EditPost, beforeEnter: ifAuthenticated},
    { path: "/profile", component: Profile, beforeEnter: ifAuthenticated},
    { path: "/posts/:id", component: SinglePost},
    { path: "/users/:id", component: SingleUser},
    { path: "/likes/:id", component: ViewLikes},
    { path: "/search", component: Search},

    { path: "/:pathMatch(.*)*", component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;