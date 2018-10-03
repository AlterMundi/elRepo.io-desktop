import React, { Component } from 'react'
import { Route, Redirect } from "react-router-dom";

//Containers
import Home from './containers/home'
import Upload from './containers/upload'
import Search from './containers/search'

export class RepoRouter extends Component {
    
    render() {
        return (
                <div>
                    <Route exact path='/explore' component={Home}/> 
                    <Route exact path='/upload'  component={Upload}/> 
                    <Route exact path='/search'  component={Search}/> 
                    <Route exact path='/' render={() => (<Redirect to="/explore" />)} />
                </div>
        )
    }
 }