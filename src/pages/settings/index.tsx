import { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Divider, Switch, Select, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, BellOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { TextArea } = Input;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(() => {
      setLoading(true);
      setTimeout(() => {
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    });
  };

  return (
    <div className={styles.page}>
      <Row gutter={24}>
        {/* 左侧菜单 */}
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} style={{ backgroundColor: '#ff6b35', fontSize: 32 }}>A</Avatar>
              <div style={{ marginTop: 12, fontWeight: 500 }}>管理员</div>
              <div style={{ fontSize: 12, color: '#999' }}>超级管理员</div>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ color: '#666' }}>
              <div style={{ padding: '8px 0', cursor: 'pointer', color: '#ff6b35' }}>
                <UserOutlined /> 个人资料
              </div>
              <div style={{ padding: '8px 0', cursor: 'pointer' }}>
                <LockOutlined /> 账号安全
              </div>
              <div style={{ padding: '8px 0', cursor: 'pointer' }}>
                <SafetyOutlined /> 权限设置
              </div>
              <div style={{ padding: '8px 0', cursor: 'pointer' }}>
                <BellOutlined /> 通知设置
              </div>
              <div style={{ padding: '8px 0', cursor: 'pointer' }}>
                <InfoCircleOutlined /> 关于我们
              </div>
            </div>
          </Card>
        </Col>

        {/* 右侧内容 */}
        <Col span={18}>
          <Card title="个人资料">
            <Form form={form} layout="vertical" initialValues={{
              username: 'admin',
              nickname: '管理员',
              email: 'admin@weixiang.com',
              phone: '138****1234',
              bio: '味享管理后台管理员',
            }}>
              <Form.Item label="头像">
                <Upload showUploadList={false} beforeUpload={() => false}>
                  <div style={{ cursor: 'pointer' }}>
                    <Avatar size={100} style={{ backgroundColor: '#ff6b35' }}>A</Avatar>
                    <div style={{ marginTop: 8, color: '#1890ff' }}>更换头像</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item name="username" label="用户名">
                <Input disabled />
              </Form.Item>
              <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder="请输入昵称" />
              </Form.Item>
              <Form.Item name="email" label="邮箱" rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item name="phone" label="手机号">
                <Input disabled />
              </Form.Item>
              <Form.Item name="bio" label="个人简介">
                <TextArea rows={3} placeholder="请输入个人简介" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="账号安全" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500 }}>登录密码</div>
              <div style={{ color: '#999', marginTop: 4 }}>定期修改密码可以提高账号安全性</div>
            </div>
            <Button>修改密码</Button>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500 }}>两步验证</div>
              <div style={{ color: '#999', marginTop: 4 }}>启用后，登录时需要输入手机验证码</div>
            </div>
            <Switch defaultChecked />
          </Card>

          <Card title="通知设置" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 500 }}>邮件通知</div>
                <div style={{ color: '#999' }}>接收系统重要通知邮件</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 500 }}>站内消息</div>
                <div style={{ color: '#999' }}>接收站内通知消息</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500 }}>告警通知</div>
                <div style={{ color: '#999' }}>AI服务异常时发送通知</div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
