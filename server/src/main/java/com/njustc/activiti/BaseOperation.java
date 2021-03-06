package com.njustc.activiti;

import com.njustc.framework.mybatis.UserMapper;
import org.activiti.engine.FormService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.FormProperty;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 为流程引擎定制几种基本的操作.
 * 定义了流程中各个对象的状态.
 * @author TC
 */
@Service
public class BaseOperation {

    @Autowired
    TaskService taskService;
    @Autowired
    FormService formService;
    @Autowired
    private UserMapper userMapper;

    enum state {
        TobeSubmit, TobeReview, TobeConfirm, TobeWrite, TobeImplement,
        TobeApprove, TobeSend, TobeDone, TobeFiling, Satisfaction
    }
    enum noGateState {
        TobeSubmit, TobeWrite, TobeImplement, TobeSend, TobeDone, TobeFiling, Satisfaction
    }
    enum GateState {
        TobeReview, TobeConfirm, TobeApprove
    }
    /**
     * 没有gate的task,对应于所有流程图中的提交,编写,实施等
     * @param processInstanceId 流程实例的ID
     * @param workerId 分配给用户组中的成员ID
     * @throws Exception 任务未完成
     */
    public void noGate (String processInstanceId,String workerId) throws  Exception
    {
        List<String> userids = userMapper.getUserIdsByRoleId("1");
        Task task=taskService.createTaskQuery()
                .processInstanceId(processInstanceId).singleResult();
        boolean test=true;
        for(noGateState state:noGateState.values()){
            if(task.getName().equals(state.name())){
                if(userids.contains(workerId))
                    taskService.claim(task.getId(),workerId);
                taskService.complete(task.getId());
                test=false;
                break;
            }
        }
        if(test==true)
            throw new Exception( task.getName()+"error");
       /* if(task.getName().equals(state.TobeSubmit.name())||task.getName().equals(state.TobeWrite.name())
                ||task.getName().equals(state.TobeImplement.name())||task.getName().equals(state.TobeDone.name())
                ||task.getName().equals(state.Satisfaction.name())||task.getName().equals(state.TobeFiling.name())
                ||task.getName().equals(state.TobeSend.name())){
            if(userids.contains(workerId))
                taskService.claim(task.getId(),workerId);
            taskService.complete(task.getId());
        }
        else throw new Exception( task.getName()+"error");*/
    }

    /**
     * 对应于流程图中有gate，需要提供参数判断流程走向的操作
     * @param operation request中的operation
     * @param processInstanceId 流程实例的ID
     * @param workerId 分配给用户组中的成员ID
     * @param comments 用户意见
     * @throws Exception 任务未完成
     */
    public void containGate(String operation,String processInstanceId,String workerId,String comments) throws Exception
    {
        boolean test=true;
        List<String> userids = userMapper.getUserIdsByRoleId("1");
        Task task=taskService.createTaskQuery()
                .processInstanceId(processInstanceId).singleResult();
        TaskFormData taskFormData=formService.getTaskFormData(task.getId());
        List<FormProperty> formProperties=taskFormData.getFormProperties();
        List<String> varies=new ArrayList<String>() ;
        for(FormProperty formProperty:formProperties) {
            if("enum".equals(formProperty.getType().getName())) {
                varies.add(formProperty.getId());
            }
        }
        for(GateState state:GateState.values()){
            if(task.getName().equals(state.name())){
                if(userids.contains(workerId))
                    taskService.claim(task.getId(),workerId);
                Map<String,Object> variables=new HashMap<String, Object>();
                for(String tmp:varies) {
                    variables.put(tmp,operation);
                }
                this.addComments(task,formProperties,comments,variables);
                taskService.complete(task.getId(),variables);
                test=false;
                break;
            }
        }
        if(test==true){
            throw new Exception(task.getProcessDefinitionId()+ "error");
        }
        /*if(task.getName().equals(state.TobeReview.name())||task.getName().equals(state.TobeConfirm.name())
                ||task.getName().equals(state.TobeApprove.name())){
            if(userids.contains(workerId))
                taskService.claim(task.getId(),workerId);
            Map<String,Object> variables=new HashMap<String, Object>();
            for(String tmp:varies) {
                variables.put(tmp,operation);
            }
            this.addComments(task,formProperties,comments,variables);
            taskService.complete(task.getId(),variables);}
        else {
            throw new Exception(task.getProcessDefinitionId()+ "error");
        }*/
    }

    /**
     * 对于流程中评审、批准等任务提供填写意见功能
     * @param task 用户任务
     * @param formProperties 表单
     * @param comments 意见内容
     * @param variables 流程变量，用于储存意见
     * @throws Exception 添加意见错误
     */
    public void addComments(Task task,List<FormProperty> formProperties,String comments,Map<String,Object> variables) throws Exception {
        List<String> varies = new ArrayList<String>();
        for (FormProperty formProperty : formProperties) {
            if(formProperty.getId().toString().contains("comments")){
                varies.add(formProperty.getId());
            }
        }
        for(GateState state:GateState.values()){
            if(task.getName().equals(state.name())){
                for (String tmp : varies) {
                    variables.put(tmp, comments);
                }
                break;
            }
        }
    }
}
