/*测试用例*/
import React, {Component, PropTypes} from 'react';
import {Form,Table, Card, Badge, Dropdown, Menu, Button,Input,Icon, Row, Col, Popconfirm, DatePicker,InputNumber} from 'antd'
const FormItem=Form.Item;

let uuid = 0;
class TestCaseContentComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        //setListFilter: PropTypes.func,
        dataSource: PropTypes.array,
        showContent: PropTypes.func,
        //deleteConsign: PropTypes.func,
        //getConsignList: PropTypes.func,
        //newConsign: PropTypes.func,
        //enableNew: PropTypes.bool,
    };

    expandedRowRender = (record) => {
        const rowStyle = {
            marginBottom:'10pt',
        };

        return (
            <div>
                <Row style={rowStyle}>
                    <Col span={3}><b>设计说明</b></Col>
                    <Col span={21}><p style={{ margin: 0 }}>{record.designNotes}</p></Col>
                </Row>
                <Row style={rowStyle}>
                    <Col span={3}><b>有关的规约说明</b></Col>
                    <Col span={21}><p style={{ margin: 0 }}>{record.statute}</p></Col>
                </Row>
                <Row style={rowStyle}>
                    <Col span={3}><b>依据</b></Col>
                    <Col span={21}><p style={{ margin: 0 }}>{record.accordance}</p></Col>
                </Row>
            </div>
        );
    };

    onClick = (buttonIndex) => () => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         this.props.buttons[buttonIndex].onClick(this.props.consignData, JSON.stringify(values));
        //     }
        // });
        const {buttons, form} = this.props;
        buttons[buttonIndex].onClick(JSON.stringify(form.getFieldsValue()));
    };

    /*table列设置*/
    columns = [{
        title:"序号",
        dataIndex:"id",
    }, {
        title:"测试分类",
        dataIndex:"classification",
    },
        /*{
        title:"测试用例设计说明",
        dataIndex:"designNotes",
    },
     {
        title:"与本测试用例有关的规约说明",
        dataIndex:"statute",
    },*/
        {
        title:"测试用例执行过程",
        dataIndex:"process",
    }, {
        title:"预期的结果",
        dataIndex:"expectedResult",
    }, {
        title:"测试用例设计者",
        dataIndex:"designer",
    }, {
        title:"时间",
        dataIndex:"time",
    }, {
        title:"操作",
        dataIndex:"action",
        render: (text, record) => {
        return (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href="javascript:;">Delete</a>
            </Popconfirm>
        );
      },
    },/*{
        title:"依据",
        dataIndex:"accordance",
    }*/
    ];

    /* TODO 删除测试用例 */
    onDelete = (key) => {
        // this.props.deleteTestCase(key);
    }

    data = [{
        id: 1,
        classification: 'yj',
        process: 'unhappy->happy',
        expectedResult: 'happy',
        designer: 'yj',
        time: '2018-06-03',
        action: 'delete',
        designNotes: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        statute: 'sssssss',
        accordance: 'tttttt'
    }];

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout =  {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        return (
            <div>
                <h3 style={{ marginBottom: 16 }}>测试用例</h3>
                <div style={{ background: '#ECECEC', padding: '30px', marginBottom:'10pt' }}>
                    <Card title="添加测试用例" bordered={false} style={{ width: '100%' }}>
                        <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
                            <FormItem {...formItemLayout} label={"测试分类"}>
                                {getFieldDecorator('classification', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"测试用例设计者"}>
                                {getFieldDecorator('designer', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"测试用例设计说明"}>
                                {getFieldDecorator('designNotes', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"测试用例执行过程"}>
                                {getFieldDecorator('process', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"预期的结果"}>
                                {getFieldDecorator('expectedResult', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"时间"}>
                                {getFieldDecorator('time', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem{...formItemLayout}label={"与本测试用例有关的规约说明"}>
                                {getFieldDecorator('statute', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"依据"}>
                                {getFieldDecorator('accordance', {
                                    // rules: [{ required: true, message: '请正确输入委托单位！' ,pattern:"^[\u4E00-\u9FA5]+$"}],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout}>
                                {this.props.buttons.map((button, index) =>
                                    <Button onClick={this.onClick(index)}
                                            key={button.content}>
                                        {button.content}
                                    </Button>)}
                            </FormItem>
                        </Form>
                    </Card>
                </div>
                <Table
                    className="components-table-demo-nested"
                    columns={this.columns}
                    expandedRowRender={this.expandedRowRender}
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={this.data}
                    rowKey={'id'}
                />
            </div>
        );
    }
}

export default Form.create()(TestCaseContentComponent);