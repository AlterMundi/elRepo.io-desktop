import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions'
import { Table, Divider, Button } from 'antd'
import filesize from 'filesize'

class SearchResults extends Component {

    render() {
        
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span>{text}</span>,
        }, {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size, record)=> <span>{filesize(Number(size || 0), {bits: true})}</span>
        }, {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                <Button onClick={()=>console.log(record)}>Download</Button>
                <Divider type="vertical" />
                <Button onClick={()=>console.log(record)}>More info</Button>
                </span>
            ),
        }];

        return (
            <div>
                <h2>Search</h2>
                {this.props.results.length > 0? 
                    (<div>
                    <h2 style={{fontWeight:'300'}}>Results for <i>{this.props.search}</i> ({this.props.results.length})</h2>
                        <div>
                            <Table columns={columns} dataSource={this.props.results} size="small"/>
                        </div>
                    </div>): false}
            </div>
            );
    }    
}

const mapStateToProps = (state) => ({
    results: state.Api.results || [],
    search: state.Api.search
})

const dispatchToProps = (dispatch) => ({
})
  
export default connect(mapStateToProps, dispatchToProps)(SearchResults)