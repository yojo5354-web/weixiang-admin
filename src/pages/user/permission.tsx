import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Switch, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './permission.less';

// 模拟角色数据
const mockRoles = [
  { id: '1', name: '超级管理员', key: 'super_admin', description: '拥有所有权限，可管理其他管理员', userCount: 2, permissions: ['*'], status: 'active' },
  { id: '2', name: '内容运营', key: 'content_manager', description: '负责内容审核、话题管理、Banner管理', userCount: 5, status: 'active' },
  { id: '3', name: '用户运营', key: 'user_manager', description: '负责用户管理、账号处理、数据统计', userCount: 3, status: 'active' },
  { id: '4', name: '商业运营', key: 'commercial_manager', description: '负责带货订单、广告投放、结算管理', userCount: 2, status: 'active' },
  { id: '5', name: 'AI运营', key: 'ai_manager', description: '负责AI服务监控、调用统计', userCount: 1, status: 'active' },
];

// 权限项
const permissionList = [
  { key: 'dashboard', label: '数据概览', category: '通用' },
  { key: 'content.list', label: '内容列表', category: '内容管理' },
  { key: 'content.review', label: '内容审核', category: '内容管理' },
  { key: 'content.report', label: '举报管理', category: '内容管理' },
  { key: 'content.tag', label: '标签管理', category: '内容管理' },
  { key: 'user.list', label: '用户列表', category: '用户管理' },
  { key: 'user.detail', label: '用户详情', category: '用户管理' },
  { key: 'user.permission', label: '权限管理', category: '用户管理' },
  { key: 'commercial.order', label: '带货订单', category: '商业管理' },
  { key: 'commercial.recipe', label: '食谱收入', category: '商业管理' },
  { key: 'commercial.ad', label: '广告管理', category: '商业管理' },
  { key: 'commercial.settlement', label: '结算管理', category: '商业管理' },
  { key: 'stats.user', label: '用户数据', category: '数据统计' },
  { key: 'stats.content', label: '内容数据', category: '数据统计' },
  { key: 'stats.commercial', label: '商业数据', category: '数据统计' },
  { key: 'ai.monitor', label: '服务监控', category: 'AI服务' },
  { key: 'ai.stats', label: '调用统计', category: 'AI服务' },
  { key: 'system.banner', label: 'Banner管理', category: '系统设置' },
  { key: 'system.topic', label: '话题管理', category: '系统设置' },
  { key: 'system.keyword', label: '敏感词管理', category: '系统设置' },
];

const PermissionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setRoleModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setRoleModalVisible(true);
  };

  const handleDelete = (record: any) => {
    if (record.key === 'super_admin') {
      message.error('超级管理员角色不能删除');
      return;
    }
    Modal.confirm({
      title: '确认删除该角色?',
      content: `删除后，属于该角色的管理员将失去对应权限`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const columns: ColumnsType<any> = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色标识', dataIndex: 'key', key: 'key', render: (k: string) => <Tag>{k}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '成员数量', dataIndex: 'userCount', key: 'userCount', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.key !== 'super_admin' && (
            <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success(editingRole ? '修改成功' : '添加成功');
      setRoleModalVisible(false);
    });
  };

  return (
    <div className={styles.page}>
      <Card
        title="角色管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加角色
          </Button>
        }
      >
        <Table dataSource={mockRoles} columns={columns} rowKey="id" loading={loading} />
      </Card>

      <Card title="权限说明" style={{ marginTop: 16 }}>
        <Tabs
          items={[
            {
              key: 'matrix',
              label: '权限矩阵',
              children: (
                <Table
                  dataSource={[
                    { feature: '数据概览', superAdmin: true, contentManager: true, userManager: true, commercialManager: true, aiManager: true },
                    { feature: '内容管理', superAdmin: true, contentManager: true, userManager: false, commercialManager: false, aiManager: false },
                    { feature: '用户管理', superAdmin: true, contentManager: false, userManager: true, commercialManager: false, aiManager: false },
                    { feature: '商业管理', superAdmin: true, contentManager: false, userManager: false, commercialManager: true, aiManager: false },
                    { feature: '数据统计', superAdmin: true, contentManager: true, userManager: true, commercialManager: true, aiManager: false },
                    { feature: 'AI服务', superAdmin: true, contentManager: false, userManager: false, commercialManager: false, aiManager: true },
                    { feature: '系统设置', superAdmin: true, contentManager: false, userManager: false, commercialManager: false, aiManager: false },
                  ]}
                  columns={[
                    { title: '功能模块', dataIndex: 'feature', key: 'feature' },
                    { title: '超级管理员', dataIndex: 'superAdmin', key: 'superAdmin', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag>—</Tag> },
                    { title: '内容运营', dataIndex: 'contentManager', key: 'contentManager', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag>—</Tag> },
                    { title: '用户运营', dataIndex: 'userManager', key: 'userManager', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag>—</Tag> },
                    { title: '商业运营', dataIndex: 'commercialManager', key: 'commercialManager', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag>—</Tag> },
                    { title: 'AI运营', dataIndex: 'aiManager', key: 'aiManager', render: (v: boolean) => v ? <Tag color="green">✓</Tag> : <Tag>—</Tag> },
                  ]}
                  rowKey="feature"
                  pagination={false}
                  size="small"
                />
              ),
            },
            {
              key: 'list',
              label: '权限列表',
              children: (
                <Table
                  dataSource={permissionList}
                  columns={[
                    { title: '权限标识', dataIndex: 'key', key: 'key', render: (k: string) => <Tag>{k}</Tag> },
                    { title: '权限名称', dataIndex: 'label', key: 'label' },
                    { title: '所属分类', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
                  ]}
                  rowKey="key"
                  pagination={false}
                  size="small"
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={roleModalVisible}
        onOk={handleSubmit}
        onCancel={() => setRoleModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="key" label="角色标识" rules={[{ required: true }]}>
            <Input placeholder="请输入角色标识，如：admin" />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select options={[{ label: '启用', value: 'active' }, { label: '禁用', value: 'inactive' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionPage;
