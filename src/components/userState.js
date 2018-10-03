import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Badge } from 'antd'

class userStateComponent extends Component {
    
    render() {
        const stateToColor = (runstate) => {
            switch(runstate) {
                case true:
                    return 'green'
                case false:
                    return 'yellow'
                default:
                    return 'red'
            }
        }
        return (
            <div style={{float: 'right', marginRight: '24px'}}>
                <Badge dot style={{backgroundColor: stateToColor(this.props.runstate)}}><Avatar shape="square" icon="user" /></Badge>
            </div>
        )
    }
}

export const UserState = connect(
    (state)=>({
        user: state.Api.user,
        runstate: state.Api.runstate
    }),
    (dispatch)=>({

    })
)(userStateComponent)