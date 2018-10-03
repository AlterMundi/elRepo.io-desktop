import React, { Component } from 'react'
import {Form, Input, Button, Upload, Icon } from "antd"

const FormItem = Form.Item;

class UploadView extends Component {
    
    constructor(props) {
        super();
        this.state = {
            title: undefined,
            file: undefined,
            uploading: false,
        }
        this.publish = this.publish.bind(this);
    }

    publish() {
        /*this.props.publish({
            title: this.state.title || '',
            file: this.state.file || {}
        })*/
        this.setState({uploading: !this.state.uploading})
    }
       
    render() {
        const { uploading } = this.state;
        
        const formItemLayout = {
            labelCol: { span: 2},
            wrapperCol: { span: 20 },
          };
  

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
          
                    <FormItem label="File" {...formItemLayout}>
                        <Upload name="file" {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> Select file
                            </Button>
                        </Upload>
                    </FormItem>
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

export default Form.create()(UploadView)