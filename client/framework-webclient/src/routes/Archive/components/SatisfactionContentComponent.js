import React, {Component, PropTypes} from 'react';
import {Row, Col, Button, Rate, Form, Input,Radio, InputNumber} from 'antd';

const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

/**
 * SatisfactionContentComponent类，实现了满意度调查表的具体表单内容。
 */
class SatisfactionContentComponent extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * 若上个界面没有传值，则使用这个默认props
     * @type {{values: {}, disable: boolean, buttons: Array}}
     */
    static defaultProps = {
        values: {},
        disable:false,
        buttons: [],
    };

    /**
     * 对props里面的属性进行类型判断，isRequired指定必填项
     * @type {{satisfactionData: *, values: * , disableC: *, disableQ: *, buttons: *, form: *}}
     */
    static propTypes = {
        satisfactionData: PropTypes.object.isRequired,
        values: PropTypes.object.isRequired,
        disableC: PropTypes.bool.isRequired,
        disableQ: PropTypes.bool.isRequired,
        buttons: PropTypes.array.isRequired,
        form: PropTypes.object.isRequired,
    };

    /**
     * 点击button的回调函数
     * @func
     * @param {Number} buttonIndex - 所点击的button的编号
     * 保存表单各部分的值。
     */
    onClick = (buttonIndex) => () => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         this.props.buttons[buttonIndex].onClick(this.props.consignData, JSON.stringify(values));
        //     }
        // });
        const {buttons, form} = this.props;
        buttons[buttonIndex].onClick(this.props.satisfactionData, JSON.stringify(form.getFieldsValue()));
    };

    /**
     *
     * 满意度调查表表单组件的render函数。
     * 其中formItemLayout、rowStyle、tipStyle以CSS语言定义了各种组件的样式；
     * 返回"满意度调查表"表单详情的html代码，包括客户满意度调查、测试中心满意度计算和满意度调查说明。
     */
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout =  {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            marginBottom: 0,
        };

        const rowStyle = {
            marginBottom: '10pt',
        };

        const tipStyle = {
            color: 'red',
        };

        return(
            <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
                <h1 style={{textAlign:'center'}}>客户满意度调查表</h1>

                <FormItem {...formItemLayout} label={"单位名称"}>
                    {getFieldDecorator('consignUnit', {
                        rules: [{ required: true, message: '请输入单位名称！' }],
                        initialValue: this.props.consignUnit,
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="被测软件名称">
                    {getFieldDecorator('softwareName', {
                        rules: [{ required: true, message: '请输入被测软件名称！' }],
                        initialValue: this.props.softwareName,
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem {...formItemLayout}>
                    <h3 style={tipStyle}>以下内容由客户方填写</h3>
                </FormItem>

                <FormItem>
                    <Row style = {rowStyle} type="flex" justify="center" gutter={32}>
                        <Col span={10}>
                            <FormItem{...formItemLayout} label={"联系人"}>
                                {getFieldDecorator('contact', {
                                    rules: [{ required: true, message: '请正确输入联系人！'}],
                                    initialValue: this.props.values.contact,
                                })(
                                    <Input disabled={this.props.disableC}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem {...formItemLayout} label={"联系电话"}>
                                {getFieldDecorator('contactNumber', {
                                    rules: [{ required: true, message: '请正确输入联系电话！',pattern:"^[0-9/-()\+]*$"}],
                                    initialValue: this.props.values.contactNumber,
                                })(
                                    <Input disabled={this.props.disableC}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem>
                    <Row style = {rowStyle} type="flex" justify="center" gutter={32}>
                        <Col span={10}>
                            <FormItem{...formItemLayout} label={"Email"}>
                                {getFieldDecorator('Email', {
                                    rules: [{ required: true, message: '请正确输入Email！', pattern:"^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$"}],
                                    initialValue: this.props.values.Email,
                                })(
                                    <Input disabled={this.props.disableC}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem {...formItemLayout} label={"手机"}>
                                {getFieldDecorator('mobilePhone', {
                                    rules: [{ required: true, message: '请正确输入手机号！',pattern:"^[0-9/-()\+]*$"}],
                                    initialValue: this.props.values.mobilePhone,
                                })(
                                    <Input disabled={this.props.disableC}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>

                    <FormItem {...formItemLayout} label={"测试服务响应时间"}>
                        {getFieldDecorator('reflectTime', {
                            initialValue: this.props.values.reflectTime?this.props.values.reflectTime:3.5,
                        })(
                            <Rate  disabled={this.props.disableC} allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"测试服务收费合理性"}>
                        {getFieldDecorator('charge', {
                            initialValue: this.props.values.charge?this.props.values.charge:3.5,
                        })(
                            <Rate  disabled={this.props.disableC}  allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"测试服务规范性"}>
                        {getFieldDecorator('standard', {
                            initialValue: this.props.values.standard?this.props.values.standard:3.5,
                        })(
                            <Rate  disabled={this.props.disableC}  allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"测试服务技术能力"}>
                        {getFieldDecorator('capability', {
                            initialValue: this.props.values.capability?this.props.values.capability:3.5,
                        })(
                            <Rate  disabled={this.props.disableC}  allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"客户需求的了解"}>
                        {getFieldDecorator('understanding', {
                            initialValue: this.props.values.understanding?this.props.values.understanding:3.5,
                        })(
                            <Rate  disabled={this.props.disableC}  allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"服务时的沟通能力"}>
                        {getFieldDecorator('communication', {
                            initialValue: this.props.values.communication?this.props.values.communication:3.5,
                        })(
                            <Rate  disabled={this.props.disableC}  allowHalf/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={"其他意见和建议"}>
                        {getFieldDecorator('advice', {
                            rules: [{
                                required: false
                            }],
                            initialValue: this.props.values.advice,
                        })(
                            <TextArea disabled={this.props.disableC} rows={4} />
                        )}
                    </FormItem>

                <FormItem/>

                <FormItem {...formItemLayout}>
                    <h3 style={tipStyle}>以下内容由测试中心填写</h3>
                </FormItem>

                {/* TODO 如何直接显示数据库中存放的数据并进行计算 */}

                <FormItem {...formItemLayout} label={"满意度计算总值"}>
                    {getFieldDecorator('satisfactionDegree', {
                        rules: [{ required: true, message: '请正确输入满意度！'}],
                        initialValue: this.props.values.satisfactionDegree,
                    })(
                        <InputNumber disabled={this.props.disableQ} min={0} max={100} step={0.1}/>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label={"客户满意情况"}>
                    {getFieldDecorator('satisfactionLevel', {
                        rules: [{ required: true, message: '请选择客户满意情况！'}],
                        initialValue: this.props.values.satisfactionLevel
                    })(
                        <RadioGroup disabled={this.props.disableQ}>
                            <Radio value={1}>很满意</Radio>
                            <Radio value={2}>较满意</Radio>
                            <Radio value={3}>一般</Radio>
                            <Radio value={4}>不满意</Radio>
                            <Radio value={4}>很不满意</Radio>
                        </RadioGroup>
                    )}
                </FormItem>

                <FormItem>
                    <h3>满意度调查说明</h3>
                    <p>1. 顾客满意度调查表须有客户签名才算有效；</p>
                    <p>2. 分值表示满意程度：90-100很满意，80-89满意，70-79较满意，50-69不满意，49以下很不满意，≥80分计入满意范畴；</p>
                    <p>3. 满意度的统计：满意度 = 获得满意的调查表总数 / 有效的调查表总数 × 100%</p>
                </FormItem>

                <FormItem/>
                {/* footer buttons */}
                <FormItem {...formItemLayout}>
                    {this.props.buttons.map((button, index) =>
                        <Button onClick={this.onClick(index)}
                                key={button.content}>
                            {button.content}
                        </Button>)}
                </FormItem>
            </Form>

        );

    }
}
export default Form.create()(SatisfactionContentComponent);
