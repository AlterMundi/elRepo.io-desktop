import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Avatar  } from 'antd';
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions'

const Meta = Card.Meta;

class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.timer = null;
    }

    componentDidMount() {
        //this.state = setInterval(()=> this.props.updateResults('JNKCPHDK'), 5000)
    }

    componentWillUnmount() {
        //window.clearInterval(this.state);
    }

    render() {
        console.log(this.props)
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