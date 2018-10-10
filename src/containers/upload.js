import React, { Component } from 'react'
import {Form, Input, Button,  Icon } from "antd"

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import actions from "../redux/api/actions"
import { fileUploader } from '../helpers/fileUploader'

const FormItem = Form.Item;
const { TextArea } = Input;

class UploadView extends Component {
    
    constructor(props) {
        super();
        this.state = {
            title: undefined,
            description: undefined,
            files: [],
            uploading: false,
        }
        this.publish = this.publish.bind(this);
        this.selectFiles = this.selectFiles.bind(this);
    }

    publish() {
        this.props.publish({
            title: this.state.title || '',
            description: this.state.description || ''
        })

        //Fake loading status
        this.setState({uploading: !this.state.uploading})
        setTimeout(()=>this.setState({uploading: !this.state.uploading}), 1000)
    }

    selectFiles() {
        fileUploader.openDialog()
            .then(fileUploader.getFilesInfo)
            .then(filesInfo => this.setState({files: [...filesInfo, ...this.state.files]}))
    }
       
    render() {
        const { uploading } = this.state;
        
        const formItemLayout = {};
  
        return (
            <div>
                <h2>Publish</h2>
                <Form>
                    <FormItem label="Title" {...formItemLayout}>
                        <Input type="text" name="title" onChange={(e => this.setState({title: e.target.value}))}/>
                    </FormItem>
                    <FormItem label="Description" {...formItemLayout}>
                        <TextArea name="description" onChange={(e => this.setState({description: e.target.value}))}/>
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.selectFiles}>
                            <Icon type="upload" /> Select file
                        </Button>
                    </FormItem>

                    <FormItem {...formItemLayout}>
                        <Button type="primary" disable={uploading.toString()} loading={uploading} onClick={this.publish}>Publish</Button>
                    </FormItem>
                </Form>

            </div>
        )
    }    
}

export default connect(
    state => ({}),
    dispatch => ({
        publish: bindActionCreators(actions.createPost, dispatch)
    })
)(Form.create()(UploadView))