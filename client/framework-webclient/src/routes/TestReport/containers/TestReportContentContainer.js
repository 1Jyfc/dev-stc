import React, {Component} from 'react';
import TestReportContentComponent from "../components/TestReportContentComponent";
import {connect} from "react-redux";
import {getTestReport, putTestReportState, updateTestReport} from "../../../services/TestReportService";
import {STATUS} from "../../../services/common";
import {message} from "antd/lib/index";

const mapStateToProps = (state, ownProps) => {
    // debugger;
    const authData = JSON.parse(sessionStorage.getItem('authData'));
    //console.log(authData);
    const content = state.TestReport.listMap[ownProps.id];
    const body = content?content.body:undefined;
    console.log(ownProps.id);

    const isEditVisible = authData.functionGroup["Consign"]!==undefined&&authData.functionGroup["Consign"].findIndex(element => element === "EDIT")!==-1;
    const isSubmitVisible = content&&content.operation&&(typeof(content.operation)==="string"?JSON.parse(content.operation).findIndex(element => element === 'Write')!==-1:
        content.operation.findIndex(element => element === 'Write')!==-1);
    const isReviewVisible = content&&content.operation&&content.operation.findIndex(element => element === 'ReviewPass')!==-1;
    const isApproveVisible = content&&content.operation&&content.operation.findIndex(element => element === 'ApprovePass')!==-1;
    const isConfirmVisible = content&&content.operation&&content.operation.findIndex(element => element === 'ConfirmPass')!==-1;
    const isSendVisible = content&&content.operation&&content.operation.findIndex(element => element === 'Send')!==-1;

    return {
        // testReportData: {},/*fetch data with pro id*/
        testReportData: content?state.TestReport.listMap[ownProps.id]:ownProps,
        values:  body ? JSON.parse(body) : {},
        disable: false/*authData.functionGroup["TestReport"]===undefined||authData.functionGroup["TestReport"].findIndex(element => element === "EDIT")===-1||state.TestReport.listMap[ownProps.id].state!=="TobeSubmit"*/,
        //curKey: state.Layout.activeKey, /*TODO: 将当前页面id保存为组件静态变量，通过此id获取页面内容*/
        //buttonDisabled: state.TestReport.listMap[ownProps.id].state==="TobeCheck"
        /*buttonDisabled: authData.functionGroup["TestReport"]===undefined ||authData.functionGroup["TestReport"].findIndex(element => element === "EDIT")===-1
            ? state.TestReport.listMap[ownProps.id].state==="TobeSubmit"||state.TestReport.listMap[ownProps.id].state==="Finished"
            : state.TestReport.listMap[ownProps.id].state==="TobeReview"||state.TestReport.listMap[ownProps.id].state==="Finished"*/
        buttonsEnable: buttonsEnable(isEditVisible,isSubmitVisible,isReviewVisible,isApproveVisible,isSendVisible,isConfirmVisible),
    }
};

const buttonsEnable = (isEditVisible,isSubmitVisible,isReviewVisible,isApproveVisible,isSendVisible,isConfirmVisible) => [{
    content: '保存',
    enable: isEditVisible&&isSubmitVisible,
},{
    content: '提交',
    enable: isSubmitVisible,
},{
    content: '评审',
    enable: isReviewVisible,
},{
    content: '否决',
    enable: isReviewVisible,
},{
    content: '批准',
    enable: isApproveVisible,
},{
    content: '不批准',
    enable: isApproveVisible,
},{
    content: '发放',
    enable: isSendVisible,
},{
    content: '确认',
    enable: isConfirmVisible,
},{
    content: "拒绝",
    enable: isConfirmVisible,
}
];

const buttons = (dispatch) => [{/*TODO:buttons的显示和禁用还存在问题*/
    content: '保存',
    onClick: (testReportData,testReport) =>{
        console.log(testReport);
        const valueData = {
            id: testReportData.id,
            body: testReport
        };
        updateTestReport(dispatch,valueData,(status)=>{
            console.log(status);
            if(status===STATUS.SUCCESS) message.success('保存成功');
            else message.error('保存失败');
        });
    }
},{
    content: '提交',
    onClick: (testReportData,testReport) =>{
        console.log(testReportData);
        console.log(testReport);
        const valueData = {
            id: testReportData.id,
            body: testReport
        };
        updateTestReport(dispatch,valueData,(status)=>{
            console.log(status);
            if(status===STATUS.SUCCESS){
                const putData = {
                    "object": "testReport",
                    "operation": "Submit"
                };
                const {processInstanceID,id} = testReportData;
                console.log(putData);
                putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{
                    console.log(status);
                    if(status===STATUS.SUCCESS) message.success('提交成功');
                    else message.error('提交失败');
                });
            }
            else message.error('更新失败');
        });
    }
},{
    content: '评审',
    onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ReviewPass"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            console.log(status===STATUS.SUCCESS);
            if(status===STATUS.SUCCESS) message.success('批准成功');
            else message.error('批准失败');
        });
    }
},{
    content: '否决',
    onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ReviewReject"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('已否决');
            else message.error('否决失败');
        });
    }
},{
    content: '发放',
    onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "Send"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('已发放');
            else message.error('发放失败');
        });
    }
},{
    content: '确认',
    onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ConfirmPass"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('确认成功');
            else message.error('确认失败');
        });
    }
},{
    content: '拒绝',
    onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ConfirmReject"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('已拒绝');
            else message.error('拒绝失败');
        });
    }
},{
    content: '批准',
        onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ApprovePass"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('确认成功');
            else message.error('确认失败');
        });
    }
},{
    content: '不批准',
        onClick: (testReportData,testReport) =>{
        const putData = {
            "object": "testReport",
            "operation": "ApproveReject"
        };
        const {processInstanceID,id} = testReportData;
        putTestReportState(dispatch,processInstanceID,putData,id,(status)=>{console.log(status);

            if(status===STATUS.SUCCESS) message.success('已拒绝');
            else message.error('拒绝失败');
        });
    }
}];

const mapDispatchToProps = (dispatch,ownProps) => {
    console.log("here");
    return {
        buttons: buttons(dispatch),
        getValues: (id) => getTestReport(dispatch,id)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TestReportContentComponent);
