package com.njustc.activiti;

import com.alibaba.fastjson.JSONObject;
import com.njustc.FrameworkApplication;
import com.njustc.domain.User;
import com.njustc.framework.core.web.Request;
import com.njustc.service.UserService;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertNotNull;

/**
 * 该类用来测试合同流程实例在调用接口后状态变化情况
 * <table border="1" summary="测试过程1">
 *     <tr>
 *         <th>执行操作</th>
 *         <th>预期状态</th>
 *     </tr>
 *     <tr>
 *         <td>查询合同状态</td>
 *         <td>&nbsp;</td>
 *     </tr>
 *     <tr>
 *         <td>customer2提交合同</td>
 *         <td>TobeReview</td>
 *     </tr>
 *     <tr>
 *         <td>工作人员否决合同</td>
 *         <td>TobeSubmit</td>
 *     </tr>
 *     <tr>
 *         <td>customer2再次请求</td>
 *         <td>TobeReview</td>
 *     </tr>
 *     <tr>
 *         <td>工作人员通过合同</td>
 *         <td>TobeConfirm</td>
 *     </tr>
 *     <tr>
 *         <td>客户通过合同</td>
 *         <td>Finished</td>
 *     </tr>
 * </table>
 *
 *
 * <table border="1" summary="测试过程2">
 *     <tr>
 *         <th>执行操作</th>
 *         <th>预期状态</th>
 *     </tr>
 *     <tr>
 *         <td>查询合同状态</td>
 *         <td>&nbsp;</td>
 *     </tr>
 *     <tr>
 *         <td>customer1提交合同</td>
 *         <td>TobeReview</td>
 *     </tr>
 *     <tr>
 *         <td>市场部主任否决合同</td>
 *         <td>TobeSubmit</td>
 *     </tr>
 *     <tr>
 *         <td>customer1再次请求</td>
 *         <td>TobeReview</td>
 *     </tr>
 *     <tr>
 *         <td>市场部主任通过合同</td>
 *         <td>TobeConfirm</td>
 *     </tr>
 *     <tr>
 *         <td>customer1不通过合同</td>
 *         <td>TobeSubmit</td>
 *     </tr>
 *     <tr>
 *         <td>customer1再再次请求</td>
 *         <td>TobeReview</td>
 *     </tr>
 *     <tr>
 *         <td>质量部主任通过合同</td>
 *         <td>TobeConfirm</td>
 *     </tr>
 *     <tr>
 *         <td>customer1通过合同</td>
 *         <td>Finished</td>
 *     </tr>
 * </table>
 *
 * @author zwh
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(FrameworkApplication.class)
public class ContractActivitiTest {
    @Autowired
    private ProcessInstanceService processInstanceService;
    @Autowired
    private UserService userService;
    //测试中使用的用户
    private User customer1;
    private User customer2;
    private User marketing;
    private User testing;

    private String processInstanceId;
    private String prId1;
    private String prId3;
    private String prId2;
    @Before
    public void setUp() {
        customer1 = userService.getUserByUsername("customer1");
        marketing = userService.getUserByUsername("marketing");
        customer2 = userService.getUserByUsername("customer2");
        testing = userService.getUserByUsername("testing");

        JSONObject jsonObject0 = new JSONObject();
        JSONObject jsonObject1 = new JSONObject();
        JSONObject jsonObject2 = new JSONObject();
        try {
            processInstanceId=processInstanceService.createContractProcess(jsonObject1,customer1);
            prId1=processInstanceService.createTestPlanProcess(jsonObject2,marketing);
            prId3=processInstanceService.createTestReportProcess(jsonObject0,marketing);
            prId2=processInstanceService.createConsignProcess(jsonObject0,customer2);
            Assert.assertNotNull(prId1);
            Assert.assertNotNull(processInstanceId);
            Assert.assertNotNull(prId3);
            //  prId2=processInstanceService.createConsignProcess(jsonObject0,customer2);
            //consignJson = consignService.addConsign(jsonObject, null, customer1);
            // contractJson= contractService.addContract(jsonObject1,null,customer2);
            //testplanJson=testPlanService.addTestPlan(jsonObject2,null,customer1);
            // Assert.assertNotNull(prId2);
            // Assert.assertNotNull(contractJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Test
    public void queryProcessState() {
        JSONObject state = new JSONObject();
        try {
            //state = processInstanceService.queryProcessState(consignJson.getString("processInstanceID"));
            state=processInstanceService.queryProcessState(processInstanceId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(state);
        //确认state不为空
        assertNotNull(state.getString("state"));
    }
    @Test
    public void  updateProcessContractState() {
        try {
            JSONObject state ;
            System.out.println("======查询合同状态========");
            //System.out.println(processInstanceService.queryProcessState(contractJson.getString("processInstanceID")));
            System.out.println(processInstanceService.queryProcessState(processInstanceId));
            System.out.println("======customer2提交合同=======");
            //构造提交委托请求
            Request request = new Request();
            request.setUser(customer2);
            JSONObject submitJson = new JSONObject();
            submitJson.put("operation", "Submit");
            submitJson.put("object", "contract");
            request.setParams(submitJson);

            Thread.sleep(2000);
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeReview",state.getString("state"));
            System.out.println("======工作人员否决合同======");
            //构造提交委托请求
            request = new Request();
            request.setUser(marketing);
            JSONObject rejectJson = new JSONObject();
            rejectJson.put("operation", "ReviewReject");
            rejectJson.put("object", "contract");
            rejectJson.put("comments","notoknotok");
            request.setParams(rejectJson);

            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeSubmit",state.getString("state"));
            System.out.println("======customer2再次请求======");
            //构造提交委托请求
            request = new Request();
            request.setUser(customer2);
            request.setParams(submitJson);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeReview",state.getString("state"));
            System.out.println("======工作人员通过合同======");
            //构造提交委托请求
            request = new Request();
            request.setUser(marketing);
            JSONObject passJson = new JSONObject();
            passJson.put("operation", "ReviewPass");
            passJson.put("object", "contract");
            passJson.put("comments","okokok");
            request.setParams(passJson);

            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            System.out.println(processInstanceService.getComments(processInstanceId));
            Assert.assertEquals("TobeConfirm",state.getString("state"));
            System.out.println("=====客户通过合同======");

            request=new Request();
            request.setUser(customer2);
            JSONObject confirmJson=new JSONObject();
            confirmJson.put("operation","ConfirmPass");
            confirmJson.put("object","contract");
            confirmJson.put("comments","okokokoko!!!");
            request.setParams(confirmJson);
            //  System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("Finished",state.getString("state"));
            System.out.println(processInstanceService.getComments(processInstanceId));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Test
    public void  updateProcessContractState2() {
        try {
            JSONObject state ;
            System.out.println("======查询合同状态========");
            //System.out.println(processInstanceService.queryProcessState(contractJson.getString("processInstanceID")));
            System.out.println(processInstanceService.queryProcessState(processInstanceId));

            System.out.println("======customer1提交合同=======");
            //构造提交委托请求
            Request request = new Request();
            request.setUser(customer1);
            JSONObject submitJson = new JSONObject();
            submitJson.put("operation", "Submit");
            submitJson.put("object", "contract");
            request.setParams(submitJson);
            Thread.sleep(2000);
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeReview",state.getString("state"));

            System.out.println("======市场部主任否决合同======");
            //构造提交委托请求
            request = new Request();
            request.setUser(marketing);
            JSONObject rejectJson = new JSONObject();
            rejectJson.put("operation", "ReviewReject");
            rejectJson.put("object", "contract");
            rejectJson.put("comments","to be more");
            request.setParams(rejectJson);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            System.out.println(processInstanceService.getComments(processInstanceId));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeSubmit",state.getString("state"));

            System.out.println("======customer1再次请求======");
            //构造提交委托请求
            request = new Request();
            request.setUser(customer1);
            request.setParams(submitJson);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeReview",state.getString("state"));

            System.out.println("======市场部主任通过合同======");
            //构造提交委托请求
            request = new Request();
            request.setUser(marketing);
            JSONObject passJson = new JSONObject();
            passJson.put("operation", "ReviewPass");
            passJson.put("object", "contract");
            passJson.put("comments","can be pass");
            request.setParams(passJson);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeConfirm",state.getString("state"));

            System.out.println("=====customer1不通过合同======");
            request=new Request();
            request.setUser(customer1);
            JSONObject confirmJson=new JSONObject();
            confirmJson.put("operation","ConfirmReject");
            confirmJson.put("object","contract");
            confirmJson.put("comments","can not be confirmed");
            request.setParams(confirmJson);
            //  System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeSubmit",state.getString("state"));

            System.out.println("======customer1再再次请求======");
            //构造提交委托请求
            request = new Request();
            request.setUser(customer1);
            request.setParams(submitJson);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeReview",state.getString("state"));

            System.out.println("======质量部主任通过合同======");
            //构造提交委托请求
            request = new Request();
            request.setUser(marketing);
            JSONObject passJson2 = new JSONObject();
            passJson2.put("operation", "ReviewPass");
            passJson2.put("object", "contract");
            passJson2.put("comments","pass pass");
            request.setParams(passJson2);
            Thread.sleep(2000);
            // System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            System.out.println(processInstanceService.getComments(processInstanceId));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("TobeConfirm",state.getString("state"));

            System.out.println("=====customer1通过合同======");
            request=new Request();
            request.setUser(customer1);
            JSONObject confirmJson2=new JSONObject();
            confirmJson2.put("operation","ConfirmPass");
            confirmJson2.put("object","contract");
            confirmJson2.put("comments","pass pass pass");
            request.setParams(confirmJson2);
            //  System.out.println(processInstanceService.updateProcessState(contractJson.getString("processInstanceID"), request));
            System.out.println(processInstanceService.updateProcessState(processInstanceId, request));
            System.out.println(processInstanceService.getComments(processInstanceId));
            state = processInstanceService.queryProcessState(processInstanceId);
            Assert.assertEquals("Finished",state.getString("state"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //测试结束后删除该委托
    @After
    public void cleanUp() {
        //consignService.deleteConsign(prId0);
        //contractService.deleteContract(contractJson);
    }
}