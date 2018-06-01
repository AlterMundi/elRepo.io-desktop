import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd';
const Search = Input.Search;

class Home extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                 <Search
                    placeholder="Title, description..."
                    enterButton="Search"
                    size="large"
                    onSearch={value => console.log(value)}
                    />
            </div>
        )
    }    
}

export default connect((state)=>({
    runstate: state.Api.runstate
}))(Home)