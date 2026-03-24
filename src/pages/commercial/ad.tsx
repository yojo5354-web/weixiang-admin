import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Modal, Form, DatePicker, InputNumber, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './ad.less';
import dayjs from 'dayjs';

// 广告类型配置
const adTypeMap: Record<string, { color: string; label: string }> = {
  brand: { color: 'purple', label: '品牌广告' },
  product: { color: 'blue', label: '商品广告' },
  activity: { color: 'orange', label: '活动广告' },
};

// 计费方式配置
const billingMap: Record<string, { label: string }> = {
  CPM: { label: 'CPM（千次曝光）' },
  CPC: { label: 'CPC（点击付费）' },
  CPT: { label: 'CPT（按时长）' },
};

// 模拟广告数据
const mockAdList = [
  {
    id: '1',
    name: '金龙鱼食用油品牌宣传',
    type: 'brand',
    position: '首页轮播',
    billing: 'CPM',
    price: 50,
    budget: 10000,
    spent: 3560,
    impressions: 71200,
    clicks: 2136,
    status: 'running',
    startTime: '2026-03-01',
    endTime: '2026-03-31',
    advertiser: '金龙鱼食品旗舰店',
  },
  {
    id: '2',
    name: '减脂鸡胸肉促销',
    type: 'product',
    position: '信息流',
    billing: 'CPC',
    price: 2,
    budget: 5000,
    spent: 1234,
    impressions: 61700,
    clicks: 6170,
    status: 'running',
    startTime: '2026-03-15',
    endTime: '2026-04-15',
    advertiser: '健康轻食馆',
  },
  {
    id: '3',
    name: '清明节美食活动',
    type: 'activity',
    position: '首页Banner',
    billing: 'CPT',
    price: 500,
    budget: 5000,
    spent: 2000,
    impressions: 40000,
    clicks: 8000,
    status: 'paused',
    startTime: '2026-04-01',
    endTime: '2026-04-07',
    advertiser: '味享官方',
  },
  {
    id: '4',
    name: '端午节粽子促销',
    type: 'product',
    position: '信息流',
    billing: 'CPC',
    price: 1.5,
    budget: 3000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    status: 'pending',
    startTime: '2026-05-25',
    endTime: '2026-06-05',
    advertiser: '老字号食品',
  },
];

const AdPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingAd(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingAd(record);
    form.setFieldsValue({ ...record, dateRange: [dayjs(record.startTime), dayjs(record.endTime)] });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success(editingAd ? '修改成功' : '创建成功');
      setModalVisible(false);
    });
  };

  const handleToggleStatus = (record: any) => {
    const newStatus = record.status === 'running' ? 'paused' : 'running';
    message.success(`已${newStatus === 'running' ? '启用' : '暂停'}`);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除该广告?',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '广告信息',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>广告主: {record.advertiser}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={adTypeMap[type]?.color}>{adTypeMap[type]?.label}</Tag>,
    },
    {
      title: '投放位置',
      dataIndex: 'position',
      key: 'position',
      width: 100,
    },
    {
      title: '计费方式',
      dataIndex: 'billing',
      key: 'billing',
      width: 120,
      render: (b: string) => billingMap[b]?.label || b,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number, record) => `¥${price}/${record.billing.replace('M', '').replace('P', '').replace('T', '天')}`,
    },
    {
      title: '预算/消耗',
      key: 'budget',
      width: 120,
      render: (_, record) => (
        <div>
          <div>¥{record.budget.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#ff4d4f' }}>已消费 ¥{record.spent.toLocaleString()}</div>
        </div>
      ),
    },
    {
      title: '投放时间',
      key: 'time',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div style={{ fontSize: 12, color: '#999' }}>至 {record.endTime}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={
          status === 'running' ? 'green' :
          status === 'paused' ? 'orange' :
          status === 'pending' ? 'blue' : 'default'
        }>
          {status === 'running' ? '投放中' :
           status === 'paused' ? '已暂停' :
           status === 'pending' ? '待投放' : '已结束'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={record.status === 'running' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'running' ? '暂停' : '启用'}
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="广告管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            创建广告
          </Button>
        }
      >
        <Table
          dataSource={mockAdList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 12,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条广告`,
          }}
        />
      </Card>

      <Modal
        title={editingAd ? '编辑广告' : '创建广告'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="广告名称" rules={[{ required: true }]}>
            <Input placeholder="请输入广告名称" />
          </Form.Item>
          <Form.Item name="advertiser" label="广告主" rules={[{ required: true }]}>
            <Input placeholder="请输入广告主名称" />
          </Form.Item>
          <Space style={{ width: '100%' }}>
            <Form.Item name="type" label="广告类型" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select
                placeholder="选择类型"
                options={Object.entries(adTypeMap).map(([value, item]) => ({ value, label: item.label }))}
              />
            </Form.Item>
            <Form.Item name="position" label="投放位置" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select
                placeholder="选择位置"
                options={[
                  { value: '首页轮播', label: '首页轮播' },
                  { value: '信息流', label: '信息流广告' },
                  { value: '首页Banner', label: '首页Banner' },
                  { value: '搜索置顶', label: '搜索置顶' },
                ]}
              />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }}>
            <Form.Item name="billing" label="计费方式" rules={[{ required: true }]} style={{ width: 200 }}>
              <Select
                placeholder="选择方式"
                options={Object.entries(billingMap).map(([value, item]) => ({ value, label: item.label }))}
              />
            </Form.Item>
            <Form.Item name="price" label="单价" rules={[{ required: true }]} style={{ width: 150 }}>
              <InputNumber min={0} precision={2} prefix="¥" />
            </Form.Item>
            <Form.Item name="budget" label="预算" rules={[{ required: true }]} style={{ width: 150 }}>
              <InputNumber min={0} precision={2} prefix="¥" />
            </Form.Item>
          </Space>
          <Form.Item name="dateRange" label="投放时间" rules={[{ required: true }]}>
            <DatePicker.RangePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdPage;
