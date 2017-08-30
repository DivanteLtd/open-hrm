import Vue from 'vue'
import Router from 'vue-router'
import Candidates from '@/components/Candidates'
import Login from '@/components/Login'
import NotFound from '@/components/NotFound'
import Profile from '@/components/Profile'
import AddCandidate from '@/components/AddCandidate'
import Sources from '@/components/Sources'
import Positions from '@/components/Positions'
import States from '@/components/States'
import UsersList from '@/components/UsersList'
import AddUser from '@/components/AddUser'
import EditProfile from '@/components/EditProfile'
import Logout from '@/components/Logout'
import NoteMediums from '@/components/NoteMediums'
import Registration from '@/components/Registration'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'candidates',
      component: Candidates
    },
    {
      path: '/details/:id',
      name: 'profile',
      component: Profile
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/registration',
      component: Registration
    },
    {
      path: '/addcandidate',
      name: 'addCandidate',
      component: AddCandidate
    },
    {
      path: '/sources',
      name: 'sources',
      component: Sources
    },
    {
      path: '/positions',
      name: 'positions',
      component: Positions
    },
    {
      path: '/states',
      name: 'states',
      component: States
    },
    {
      path: '/userslist',
      name: 'usersList',
      component: UsersList
    },
    {
      path: '/adduser',
      name: 'addUser',
      component: AddUser
    },
    {
      path: '/editprofile',
      name: 'editProfile',
      component: EditProfile
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/medium',
      name: 'medium',
      component: NoteMediums
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router
