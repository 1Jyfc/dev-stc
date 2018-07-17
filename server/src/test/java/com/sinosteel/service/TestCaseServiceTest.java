package com.sinosteel.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sinosteel.FrameworkApplication;
import com.sinosteel.domain.User;
import com.sinosteel.repository.UserRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * 本测试用来测试TestCase Service
 * <table border = "1" summary="">
 *      <tr>
 *          <th>测试内容</th>
 *          <th>测试操作</th>
 *          <th>测试结果</th>
 *      </tr>
 *      <tr>
 *          <td>通过用户查询测试样例</td>
 *          <td>queryTestCases</td>
 *          <td>查询成功</td>
 *      </tr>
 *      <tr>
 *          <td>新建测试样例</td>
 *          <td>addTestCase</td>
 *          <td>新建成功</td>
 *      </tr>
 *      <tr>
 *          <td>通过测试样例ID查询测试样例</td>
 *          <td>queryTestCaseByID</td>
 *          <td>查询成功</td>
 *      </tr>
 *      <tr>
 *          <td>通过工程查询测试样例</td>
 *          <td>queryTestCasesByProject</td>
 *          <td>查询成功</td>
 *      </tr>
 *      <tr>
 *          <td>编辑测试样例内容</td>
 *          <td>editTestCase</td>
 *          <td>编辑成功</td>
 *      </tr>
 *      <tr>
 *          <td>删除测试样例</td>
 *          <td>deleteTestCase</td>
 *          <td>queryTestCaseByID为空,删除成功</td>
 *      </tr>
 * </table>
 *
 *
 * @author Lumpy
 */


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(FrameworkApplication.class)
@Transactional
public class TestCaseServiceTest {

    private User tester;
    private User customer1;
    private User customer2;

    @Autowired
    private TestCaseService testCaseService;

    @Autowired
    private ConsignService consignService;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserRepository userRepository;

    @Before
    public void getUser() {
        tester = userRepository.findByUsername("testing");
        customer1 = userRepository.findByUsername("customer1");
        customer2 = userRepository.findByUsername(("customer2"));
    }
    
    @Test
    public void test_queryTestCase(){
        System.out.println("开始测试工作人员获取测试样例");
        try {
            JSON result = testCaseService.queryTestCases(tester);

            Assert.assertNotNull("工作人员 - 测试样例查询失败",result);

            System.out.println(result);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("开始测试用户获取测试样例");
        try {
            JSON result = testCaseService.queryTestCases(customer1);

            Assert.assertNotNull("用户 - 测试样例查询失败",result);

            System.out.println(result);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Test
    public void test_SE(){
        System.out.println("=====testUser 新建一个测试样例=====");



        try {

            //test_addTestCase
            JSONObject consign = new JSONObject();
            JSONObject jsonConsign = consignService.addConsign(consign,null,tester);
            JSONObject project = new JSONObject();
            String consign_id = jsonConsign.getString("id");
            JSONObject jsonProject = projectService.addProject(consign_id,project,null,tester);
            String pro_id = jsonProject.getString("id");
            JSONObject TestCase = new JSONObject();
            TestCase.put("body", "这是customer1测试中新建的一个测试样例");
            JSONObject jsonResult = testCaseService.addTestCase(pro_id,TestCase, null,tester);
            String id = jsonResult.getString("id");
            Assert.assertNotNull("测试样例新建失败",id);
            System.out.println("测试样例新建成功, 测试样例的ID为: " + id);
            System.out.println(jsonResult);

            //test_queryTestCasesByID
            System.out.println("=====通过ID查询该测试样例=====");
            JSONObject jsonTestCase = testCaseService.queryTestCaseByID(id);
            Assert.assertNotNull("通过ID查询测试样例失败",jsonTestCase);
            System.out.println(jsonTestCase);


            //test_editTestCase
            System.out.println("=====编辑该测试样例内容=====");
            String edit_object = "body";
            String edit_contents = "这是tester在测试中修改的测试样例";
            jsonTestCase.put(edit_object,edit_contents );
            jsonTestCase = testCaseService.editTestCase(jsonTestCase, null, tester);
            Assert.assertEquals("测试样例修改失败",edit_contents,jsonTestCase.getString(edit_object));  //检验Case内容修改是否符合预期
            System.out.println(jsonTestCase);


            //test_deleteTestCase
            System.out.println("=====删除该测试样例=====");
            testCaseService.deleteTestCase(jsonTestCase);
            try{
                JSONObject jsonDel = testCaseService.queryTestCaseByID(id);
                Assert.assertNull("测试样例删除失败",jsonDel);
            }
            catch (Exception e){
                System.out.println("测试样例删除成功");
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
