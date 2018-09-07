import React, { Component } from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import apiActions from './redux/api/actions'

import Home from './containers/home'
import Upload from './containers/upload'
import Search from './containers/search'

 class RepoRouterClass extends Component {
    
    /* componentWillReceiveProps(nextProps) {
        console.log(nextProps.runstate === true ,typeof this.props.user === 'undefined')
        if (nextProps.runstate === true && typeof this.props.user === 'undefined') {
            console.log('refech user', nextProps.runstate, this.props.user)
            this.props.fetchUser();
        }
    } */

    render() {
        console.log('ROUTER',this.props)
        return (
            <div>
                <Route exact path='/explore' component={Home}/> 
                <Route exact path='/upload' component={Upload}/> 
                <Route exact path='/search' component={Search}/> 
                <Route exact path="/" render={() => (<Redirect to="/explore" />)} />
            </div>
        )
    }
 }
  
 const mapStateToProps = (state) => ({
    runstate: state.Api.runstate,
    user: state.Api.user
})

const dispatchToProps = (dispatch) => ({
    //fetchUser: bindActionCreators(apiActions.checkUser, dispatch)
})

 export const RepoRouter = connect(mapStateToProps, dispatchToProps)(RepoRouterClass)