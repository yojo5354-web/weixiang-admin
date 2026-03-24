import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Descriptions, Avatar, Tag, Table, Tabs, Typography, Button, Space, Modal, message } from 'antd';
import { ArrowLeftOutlined, StopOutlined, UnlockOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'umi';
import styles from './detail.less';

const { Title, Text } = Typography;

// 用户类型配置
const userTypeMap: Record<string, { color: string; label: string }> = {
  normal: { color: 'default', label: '普通用户' },
  influencer: { color: 'gold', label: '达人' },
  merchant: { color: 'purple', label: '商家' },
  admin: { color: 'red', label: '管理员' },
};

// 账号状态配置
const statusMap: Record<string, { color: string; label: string }> = {
  normal: { color: 'green', label: '正常' },
  temp_ban: { color: 'orange', label: '临时封禁' },
  permanent_ban: { color: 'red', label: '永久封禁' },
  canceling: { color: 'default', label: '注销中' },
};

// 模拟用户详情数据
const mockUserDetail = {
  id: '1',
  avatar: '',
  nickname: '美食达人小王',
  phone: '138****1234',
  gender: '男',
  region: '四川成都',
  type: 'influencer',
  status: 'normal',
  bio: '热爱美食，专注分享川菜家常做法，让更多人爱上厨房',
  registerTime: '2025-06-15 10:30',
  lastLoginTime: '2026-03-22 09:15',
  followers: 125680,
  following: 456,
  posts: 328,
  likes: 2567800,
  collections: 89,
  verified: true,
  verificationInfo: '美食领域优质创作者',
};

// 模拟发布内容
const mockUserPosts = [
  { id: '1', cover: 'https://picsum.photos/200/150?random=1', title: '家常红烧肉做法', likes: 2345, comments: 156, time: '2026-03-20' },
  { id: '2', cover: 'https://picsum.photos/200/150?random=2', title: '水煮鱼详细教程', likes: 5678, comments: 345, time: '2026-03-18' },
  { id: '3', cover: 'https://picsum.photos/200/150?random=3', title: '回锅肉正宗做法', likes: 3456, comments: 234, time: '2026-03-15' },
];

// 模拟违规记录
const mockViolationRecords = [
  { id: '1', reason: '发布广告内容', time: '2026-02-15', admin: '管理员A', result: '警告' },
];

// 模拟操作日志
const mockOperationLogs = [
  { id: '1', action: '发布内容', detail: '发布《家常红烧肉做法》', time: '2026-03-20 14:30' },
  { id: '2', action: '修改资料', detail: '修改个人简介', time: '2026-03-18 10:15' },
  { id: '3', action: '登录', detail: 'APP登录', time: '2026-03-22 09:15' },
];

const UserDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<any>(mockUserDetail);

  const handleBan = () => {
    Modal.confirm({
      title: '确认封禁该用户?',
      content: '封禁后该用户将无法正常使用平台功能',
      okText: '确认封禁',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('已封禁该用户');
        setUserDetail({ ...userDetail, status: 'temp_ban' });
      },
    });
  };

  const handleUnban = () => {
    Modal.confirm({
      title: '确认解除封禁?',
      content: '解除后该用户将恢复正常使用',
      okText: '确认',
      onOk: () => {
        message.success('已解除封禁');
        setUserDetail({ ...userDetail, status: 'normal' });
      },
    });
  };

  const postColumns = [
    { title: '封面', dataIndex: 'cover', key: 'cover', width: 100, render: (cover: string) => <img src={cover} width={80} height={60} style={{ objectFit: 'cover' }} /> },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '点赞', dataIndex: 'likes', key: 'likes', width: 80 },
    { title: '评论', dataIndex: 'comments', key: 'comments', width: 80 },
    { title: '发布时间', dataIndex: 'time', key: 'time', width: 120 },
  ];

  const violationColumns = [
    { title: '违规原因', dataIndex: 'reason', key: 'reason' },
    { title: '违规时间', dataIndex: 'time', key: 'time', width: 120 },
    { title: '处理管理员', dataIndex: 'admin', key: 'admin', width: 100 },
    { title: '处理结果', dataIndex: 'result', key: 'result', width: 80, render: (r: string) => <Tag color="orange">{r}</Tag> },
  ];

  const logColumns = [
    { title: '操作类型', dataIndex: 'action', key: 'action', width: 100 },
    { title: '操作详情', dataIndex: 'detail', key: 'detail' },
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 160 },
  ];

  const tabItems = [
    {
      key: 'posts',
      label: `发布内容 (${userDetail.posts})`,
      children: <Table dataSource={mockUserPosts} columns={postColumns} rowKey="id" pagination={false} size="small" />,
    },
    {
      key: 'violation',
      label: '违规记录',
      children: <Table dataSource={mockViolationRecords} columns={violationColumns} rowKey="id" pagination={false} size="small" />,
    },
    {
      key: 'logs',
      label: '操作日志',
      children: <Table dataSource={mockOperationLogs} columns={logColumns} rowKey="id" pagination={false} size="small" />,
    },
  ];

  return (
    <div className={styles.page}>
      <Card>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          返回
        </Button>

        <Row gutter={24}>
          {/* 左侧：用户基本信息 */}
          <Col span={8}>
            <Card>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar size={100} style={{ backgroundColor: '#ff6b35', fontSize: 40 }}>
                  {userDetail.nickname.charAt(0)}
                </Avatar>
                <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{userDetail.nickname}</Title>
                <Space style={{ marginBottom: 8 }}>
                  <Tag color={userTypeMap[userDetail.type]?.color}>
                    {userTypeMap[userDetail.type]?.label}
                  </Tag>
                  <Tag color={statusMap[userDetail.status]?.color}>
                    {statusMap[userDetail.status]?.label}
                  </Tag>
                  {userDetail.verified && <Tag color="blue">已认证</Tag>}
                </Space>
                <div style={{ fontSize: 12, color: '#666' }}>{userDetail.bio}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
                <Statistic title="粉丝" value={userDetail.followers} valueStyle={{ fontSize: 20 }} />
                <Statistic title="关注" value={userDetail.following} valueStyle={{ fontSize: 20 }} />
                <Statistic title="获赞" value={userDetail.likes} valueStyle={{ fontSize: 20 }} />
              </div>

              <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Button icon={<EditOutlined />}>编辑资料</Button>
                {userDetail.status !== 'normal' ? (
                  <Button type="primary" icon={<UnlockOutlined />} onClick={handleUnban}>解除封禁</Button>
                ) : (
                  <Button danger icon={<StopOutlined />} onClick={handleBan}>封禁用户</Button>
                )}
              </Space>
            </Card>
          </Col>

          {/* 右侧：详细信息和标签页 */}
          <Col span={16}>
            <Card>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="用户ID">{userDetail.id}</Descriptions.Item>
                <Descriptions.Item label="手机号">{userDetail.phone}</Descriptions.Item>
                <Descriptions.Item label="性别">{userDetail.gender}</Descriptions.Item>
                <Descriptions.Item label="地区">{userDetail.region}</Descriptions.Item>
                <Descriptions.Item label="注册时间">{userDetail.registerTime}</Descriptions.Item>
                <Descriptions.Item label="最后登录">{userDetail.lastLoginTime}</Descriptions.Item>
                {userDetail.verified && (
                  <Descriptions.Item label="认证信息" span={2}>{userDetail.verificationInfo}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card style={{ marginTop: 16 }}>
              <Tabs items={tabItems} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserDetailPage;
