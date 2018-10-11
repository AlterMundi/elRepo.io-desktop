import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Badge } from 'antd'

class userStateComponent extends Component {
    
    render() {
        const state2Status = (runstate) => {
            switch(runstate) {
                case true:
                    return "success"
                case false:
                    return 'process'
                default:
                    return 'error'
            }
        }
        return (
            <div style={{float: 'right', marginRight: '24px'}}>
                <Badge 
                    dot
                    status={state2Status(this.props.runstate)}
                    offset={[20, -5 ]}
                    style={{borderColor: 'transparent'}}
                >
                    <Avatar shape="circle" icon="user" />
                </Badge>
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