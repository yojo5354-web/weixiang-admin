import { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import request from '@/utils/request';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('account');
  const navigate = useNavigate();

  const onAccountLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res: any = await request.post('/api/admin/login', values);
      const data = res.data || res;
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin || data.user));
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        message.error('登录失败，请检查账号密码');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const onPhoneLogin = async (values: { phone: string; code: string }) => {
    setLoading(true);
    try {
      const res: any = await request.post('/api/admin/login-by-phone', values);
      const data = res.data || res;
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin || data.user));
        message.success('登录成功');
        navigate('/dashboard');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async (phone: string) => {
    try {
      await request.post('/api/admin/send-code', { phone });
      message.success('验证码已发送');
    } catch (error) {
      message.error('发送失败');
    }
  };

  const items = [
    {
      key: 'account',
      label: '账号密码登录',
      children: (
        <Form onFinish={onAccountLogin} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'phone',
      label: '手机验证码登录',
      children: (
        <PhoneLoginForm onSendCode={sendCode} onFinish={onPhoneLogin} loading={loading} />
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#ff6b35', margin: 0 }}>
            味享管理后台
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>欢迎回来，请登录</p>
        </div>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          centered
        />
      </Card>
    </div>
  );
};

// 手机验证码登录组件
const PhoneLoginForm: React.FC<{
  onSendCode: (phone: string) => void;
  onFinish: (values: { phone: string; code: string }) => void;
  loading: boolean;
}> = ({ onSendCode, onFinish, loading }) => {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    const phone = form.getFieldValue('phone');
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return;
    }
    onSendCode(phone);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
        ]}
      >
        <Input placeholder="请输入手机号" size="large" maxLength={11} />
      </Form.Item>
      <Form.Item
        name="code"
        label="验证码"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="请输入验证码" size="large" />
          <Button
            size="large"
            onClick={handleSendCode}
            disabled={countdown > 0}
            style={{ width: 120 }}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </Button>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
