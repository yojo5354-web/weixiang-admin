import { ReactNode, useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Typography } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  RobotOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'umi';
import styles from './BasicLayout.less';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '数据概览',
    path: '/dashboard',
  },
  {
    key: 'content',
    icon: <FileTextOutlined />,
    label: '内容管理',
    children: [
      { key: '/content/list', label: '内容列表', path: '/content/list' },
      { key: '/content/review', label: '内容审核', path: '/content/review', badge: 5 },
      { key: '/content/report', label: '举报管理', path: '/content/report', badge: 3 },
      { key: '/content/tag', label: '标签管理', path: '/content/tag' },
    ],
  },
  {
    key: 'user',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      { key: '/user/list', label: '用户列表', path: '/user/list' },
      { key: '/user/permission', label: '权限管理', path: '/user/permission' },
    ],
  },
  {
    key: 'commercial',
    icon: <ShoppingOutlined />,
    label: '商业管理',
    children: [
      { key: '/commercial/order', label: '带货订单', path: '/commercial/order' },
      { key: '/commercial/recipe', label: '食谱收入', path: '/commercial/recipe' },
      { key: '/commercial/ad', label: '广告管理', path: '/commercial/ad' },
      { key: '/commercial/settlement', label: '结算管理', path: '/commercial/settlement' },
    ],
  },
  {
    key: 'stats',
    icon: <BarChartOutlined />,
    label: '数据统计',
    children: [
      { key: '/stats/user', label: '用户数据', path: '/stats/user' },
      { key: '/stats/content', label: '内容数据', path: '/stats/content' },
      { key: '/stats/commercial', label: '商业数据', path: '/stats/commercial' },
    ],
  },
  {
    key: 'ai',
    icon: <RobotOutlined />,
    label: 'AI服务',
    children: [
      { key: '/ai/monitor', label: '服务监控', path: '/ai/monitor' },
      { key: '/ai/stats', label: '调用统计', path: '/ai/stats' },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: '/system/banner', label: 'Banner管理', path: '/system/banner' },
      { key: '/system/topic', label: '话题管理', path: '/system/topic' },
      { key: '/system/keyword', label: '敏感词管理', path: '/system/keyword' },
    ],
  },
];

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // 获取管理员信息
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      setAdminUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    // 设置当前选中菜单
    const path = location.pathname;
    const findSelectedKey = (items: MenuItem[]): string | null => {
      for (const item of items) {
        if (item.path === path) {
          return item.key;
        }
        if (item.children) {
          const found = findSelectedKey(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    const key = findSelectedKey(menuItems);
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location.pathname]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const menuItem: any = {
      key: item.key,
      icon: item.icon,
      label: item.badge ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {item.label}
          <Badge count={item.badge} size="small" />
        </span>
      ) : item.label,
      onClick: () => handleMenuClick(item),
    };
    if (item.children) {
      menuItem.children = item.children.map(renderMenuItem);
    }
    return menuItem;
  };

  const userMenuItems = [
    { key: 'settings', icon: <SettingOutlined />, label: '账号设置', onClick: () => navigate('/settings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        <div className={styles.logo}>
          {collapsed ? (
            <span style={{ fontSize: 20 }}>🍽️</span>
          ) : (
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6b35' }}>
              味享管理后台
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems.map(renderMenuItem)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#ff6b35' }}>
                  {adminUser?.username?.charAt(0) || 'A'}
                </Avatar>
                <Text>{adminUser?.username || '管理员'}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
