import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions'


class SearchResults extends Component {

    render() {
        return (
            <div>
                  {JSON.stringify(this.props.results)}
            </div>
        )
    }    
}

const mapStateToProps = (state) => ({
    results: state.Api.results,
})

const dispatchToProps = (dispatch) => ({
    updateResults: bindActionCreators(apiActions.updateSearchResults, dispatch)
})
  
export default connect(mapStateToProps, dispatchToProps)(SearchResults)