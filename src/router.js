import React from 'react'
import asyncComponent from './helpers/AsyncFunc'

import { Route } from 'react-router-dom'

 export const RepoRouter = ({ isLoggedIn }) => {
     return (
        <div>
            <Route exact path='/' component={asyncComponent(() => import('./containers/home'))}/> 
            <Route exact path='/upload' component={asyncComponent(() => import('./containers/upload'))}/> 
        </div>
     )
 }
  