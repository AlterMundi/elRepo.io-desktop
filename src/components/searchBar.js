import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Input } from 'antd'
import actions from '../redux/api/actions'

const Search = Input.Search

class SearchBarComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
          <Search
            placeholder="Title, description..."
            enterButton="Search"
            style={{margin:'0 20px 0 0'}}
            onSearch={this.props.newSearch}
          />
        )
    }
}

export const SearchBar = connect(
    (state)=>({
        
    }),
    (dispatch)=>({
        newSearch: bindActionCreators(actions.newSearch, dispatch)
    })
)(SearchBarComponent)