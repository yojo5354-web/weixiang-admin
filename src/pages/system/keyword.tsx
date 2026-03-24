import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './keyword.less';

// 敏感词类型配置
const typeMap: Record<string, { color: string; label: string }> = {
  forbidden: { color: 'red', label: '违禁词' },
  exaggerate: { color: 'orange', label: '夸大宣传' },
  vulgar: { color: 'purple', label: '低俗内容' },
  political: { color: 'red', label: '政治敏感' },
  custom: { color: 'blue', label: '自定义' },
};

// 处理方式配置
const handleTypeMap: Record<string, { label: string }> = {
  reject: { label: '直接驳回' },
  replace: { label: '替换为*' },
  warning: { label: '警告提示' },
};

// 模拟敏感词数据
const mockKeywordList = [
  { id: '1', word: '特效药', type: 'forbidden', handleType: 'reject', count: 156, createTime: '2026-01-01' },
  { id: '2', word: '绝对有效', type: 'exaggerate', handleType: 'replace', count: 234, createTime: '2026-01-01' },
  { id: '3', word: '最好吃', type: 'exaggerate', handleType: 'replace', count: 567, createTime: '2026-01-02' },
  { id: '4', word: '一天瘦十斤', type: 'forbidden', handleType: 'reject', count: 89, createTime: '2026-01-03' },
  { id: '5', word: '包治百病', type: 'forbidden', handleType: 'reject', count: 45, createTime: '2026-01-03' },
  { id: '6', word: '最低价', type: 'exaggerate', handleType: 'replace', count: 789, createTime: '2026-01-05' },
  { id: '7', word: '三无产品', type: 'vulgar', handleType: 'warning', count: 23, createTime: '2026-02-01' },
  { id: '8', word: '致癌', type: 'vulgar', handleType: 'replace', count: 123, createTime: '2026-02-15' },
  { id: '9', word: '减肥神器', type: 'exaggerate', handleType: 'replace', count: 345, createTime: '2026-03-01' },
  { id: '10', word: '独家配方', type: 'exaggerate', handleType: 'replace', count: 456, createTime: '2026-03-10' },
];

const KeywordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleDelete = (record: any) => {
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    message.success('批量删除成功');
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success('添加成功');
      setModalVisible(false);
    });
  };

  const handleImport = () => {
    message.info('请选择TXT文件，每行一个敏感词');
  };

  const columns: ColumnsType<any> = [
    { title: '敏感词', dataIndex: 'word', key: 'word', render: (w: string) => <Tag>{w}</Tag> },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={typeMap[type]?.color}>{typeMap[type]?.label}</Tag>,
    },
    {
      title: '处理方式',
      dataIndex: 'handleType',
      key: 'handleType',
      width: 100,
      render: (h: string) => handleTypeMap[h]?.label,
    },
    {
      title: '命中次数',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      sorter: true,
      render: (c: number) => c.toLocaleString(),
    },
    { title: '添加时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确认删除该敏感词?"
          onConfirm={() => handleDelete(record)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="敏感词管理"
        extra={
          <Space>
            <Button icon={<UploadOutlined />} onClick={handleImport}>导入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加敏感词
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Tag color="red">违禁词: {mockKeywordList.filter((i) => i.type === 'forbidden').length} 个</Tag>
            <Tag color="orange">夸大宣传: {mockKeywordList.filter((i) => i.type === 'exaggerate').length} 个</Tag>
            <Tag color="purple">低俗内容: {mockKeywordList.filter((i) => i.type === 'vulgar').length} 个</Tag>
            <Tag color="blue">自定义: {mockKeywordList.filter((i) => i.type === 'custom').length} 个</Tag>
          </Space>
        </div>

        <Table
          dataSource={mockKeywordList}
          columns={columns}
          rowKey="id"
          loading={loading}
          rowSelection={{}}
          pagination={{
            total: 120,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个敏感词`,
          }}
        />
      </Card>

      <Modal
        title="添加敏感词"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="word" label="敏感词" rules={[{ required: true }]}>
            <Input placeholder="请输入敏感词" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              placeholder="选择类型"
              options={Object.entries(typeMap).map(([value, item]) => ({ value, label: item.label }))}
            />
          </Form.Item>
          <Form.Item name="handleType" label="处理方式" rules={[{ required: true }]}>
            <Select
              placeholder="选择处理方式"
              options={Object.entries(handleTypeMap).map(([value, item]) => ({ value, label: item.label }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KeywordPage;
