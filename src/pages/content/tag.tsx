import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './tag.less';

const { TextArea } = Input;

// 标签分类配置
const categoryMap: Record<string, { color: string; label: string }> = {
  dish: { color: 'blue', label: '菜品分类' },
  taste: { color: 'orange', label: '口味' },
  scene: { color: 'green', label: '场景' },
  festival: { color: 'purple', label: '节日' },
  custom: { color: 'default', label: '自定义' },
};

// 模拟数据
const mockTagList = [
  { id: '1', name: '川菜', category: 'dish', usageCount: 125680, status: 'active', createTime: '2026-01-01' },
  { id: '2', name: '粤菜', category: 'dish', usageCount: 98650, status: 'active', createTime: '2026-01-01' },
  { id: '3', name: '鲁菜', category: 'dish', usageCount: 45630, status: 'active', createTime: '2026-01-02' },
  { id: '4', name: '辣', category: 'taste', usageCount: 234560, status: 'active', createTime: '2026-01-03' },
  { id: '5', name: '甜', category: 'taste', usageCount: 198760, status: 'active', createTime: '2026-01-03' },
  { id: '6', name: '减脂餐', category: 'scene', usageCount: 156780, status: 'active', createTime: '2026-01-05' },
  { id: '7', name: '快手菜', category: 'scene', usageCount: 289340, status: 'active', createTime: '2026-01-05' },
  { id: '8', name: '宴客', category: 'scene', usageCount: 87650, status: 'active', createTime: '2026-01-06' },
  { id: '9', name: '春节', category: 'festival', usageCount: 45670, status: 'inactive', createTime: '2026-01-10' },
  { id: '10', name: '中秋', category: 'festival', usageCount: 34560, status: 'inactive', createTime: '2026-01-15' },
  { id: '11', name: '#周末厨房#', category: 'custom', usageCount: 23450, status: 'active', createTime: '2026-02-01' },
  { id: '12', name: '#美食挑战#', category: 'custom', usageCount: 12340, status: 'active', createTime: '2026-02-10' },
];

const TagPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingTag(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除该标签?',
      content: `删除后，内容中使用该标签的内容将不受影响，但无法再使用该标签。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success(editingTag ? '修改成功' : '添加成功');
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color={categoryMap[category]?.color}>
          {categoryMap[category]?.label}
        </Tag>
      ),
    },
    {
      title: '使用量',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 120,
      sorter: true,
      render: (count: number) => count.toLocaleString(),
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
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="标签管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加标签
          </Button>
        }
      >
        <Table
          dataSource={mockTagList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 12,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个标签`,
          }}
        />
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '添加标签'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称，如：川菜" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select
              placeholder="请选择分类"
              options={Object.entries(categoryMap).map(([value, item]) => ({
                value,
                label: item.label,
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="标签描述">
            <TextArea rows={2} placeholder="可选，添加标签描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select
              options={[
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagPage;
