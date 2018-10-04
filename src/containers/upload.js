import React, { Component } from 'react'
import {Form, Input, Button, Upload, Icon, TE } from "antd"

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import actions from "../redux/api/actions"
const FormItem = Form.Item;
const { TextArea } = Input;

class UploadView extends Component {
    
    constructor(props) {
        super();
        this.state = {
            title: undefined,
            description: undefined,
            file: undefined,
            uploading: false,
        }
        this.publish = this.publish.bind(this);
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
       
    render() {
        const { uploading } = this.state;
        
        const formItemLayout = {};
  

        const uploadProps = {
            onRemove: (file) => {
              console.log({ file })
              this.setState({ file: undefined })
            },
            beforeUpload: (file) => {
              this.setState({file});
              return false;
            },
            fileList: this.state.file? [this.state.file]: [],
            multiple: false
        };

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
          
                    {/*
                    <FormItem label="File" {...formItemLayout}>
                        <Upload name="file" {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> Select file
                            </Button>
                        </Upload>
                    </FormItem>
                    */}

                    <FormItem {...formItemLayout}>
                        <Button type="primary" disable={uploading.toString()} loading={uploading} onClick={this.publish}>Publish</Button>
                    </FormItem>
                </Form>
                <pre>
                    {JSON.stringify(this.state, null, "  ")}
                </pre>
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