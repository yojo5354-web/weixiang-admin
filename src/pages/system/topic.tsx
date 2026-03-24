import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Switch, message, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './topic.less';

// 模拟话题数据
const mockTopicList = [
  { id: '1', name: '#减脂餐挑战#', description: '分享你的减脂餐食谱，参与挑战赢取奖励', participants: 125680, heat: 98560, status: 'active', createTime: '2026-01-15' },
  { id: '2', name: '#川菜爱好者#', description: '热爱川菜的朋友们，一起交流川菜做法', participants: 98650, heat: 87650, status: 'active', createTime: '2026-01-10' },
  { id: '3', name: '#快手早餐#', description: '10分钟搞定营养早餐，开启美好一天', participants: 156780, heat: 123450, status: 'active', createTime: '2026-02-01' },
  { id: '4', name: '#周末厨房#', description: '周末一起下厨，分享你的周末美食', participants: 89760, heat: 67890, status: 'active', createTime: '2026-02-15' },
  { id: '5', name: '#烘焙新手#', description: '新手烘焙交流，从零开始学烘焙', participants: 76890, heat: 56780, status: 'active', createTime: '2026-03-01' },
  { id: '6', name: '#春节美食#', description: '春节期间美食分享', participants: 45670, heat: 23450, status: 'inactive', createTime: '2026-01-20' },
];

const TopicPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingTopic(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingTopic(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除该话题?',
      content: '删除后，话题下的内容不受影响，但无法再使用该话题',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleToggleStatus = (record: any) => {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    message.success(`已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success(editingTopic ? '修改成功' : '添加成功');
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '话题名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <FireOutlined style={{ color: record.heat > 80000 ? '#ff4d4f' : '#999' }} />
            {' '}{name}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: '参与量',
      dataIndex: 'participants',
      key: 'participants',
      width: 100,
      sorter: true,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: '热度',
      dataIndex: 'heat',
      key: 'heat',
      width: 180,
      sorter: true,
      render: (heat: number, record) => (
        <Progress
          percent={Math.round((heat / 200000) * 100)}
          size="small"
          format={(p) => `${heat.toLocaleString()}`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="话题管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加话题
          </Button>
        }
      >
        <Table
          dataSource={mockTopicList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 12,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个话题`,
          }}
        />
      </Card>

      <Modal
        title={editingTopic ? '编辑话题' : '添加话题'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="话题名称" rules={[{ required: true }]}>
            <Input placeholder="请输入话题名称，如：#减脂餐挑战#" />
          </Form.Item>
          <Form.Item name="description" label="话题描述">
            <Input.TextArea rows={2} placeholder="请输入话题描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicPage;
