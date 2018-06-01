import React, { Component } from 'react'
import { connect } from 'react-redux'

class Home extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <h2>Home</h2>
                <b>Status:</b> {this.props.runstate}
            </div>
        )
    }    
}

export default connect((state)=>({
    runstate: state.Api.runstate
}))(Home)