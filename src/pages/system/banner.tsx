import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Switch, Upload, Select, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './banner.less';
import dayjs from 'dayjs';

// Banner状态配置
const statusMap: Record<string, { color: string; label: string }> = {
  active: { color: 'green', label: '显示' },
  inactive: { color: 'default', label: '隐藏' },
};

// 模拟Banner数据
const mockBannerList = [
  {
    id: '1',
    image: 'https://picsum.photos/750/400?random=50',
    title: '川菜美食节正在进行中',
    link: '/topic/sichuan',
    sort: 1,
    status: 'active',
    position: 'home_carousel',
    startTime: '2026-03-01',
    endTime: '2026-03-31',
    clicks: 12560,
  },
  {
    id: '2',
    image: 'https://picsum.photos/750/400?random=51',
    title: '减脂餐挑战赛火热报名中',
    link: '/activity/diet',
    sort: 2,
    status: 'active',
    position: 'home_carousel',
    startTime: '2026-03-15',
    endTime: '2026-04-15',
    clicks: 8934,
  },
  {
    id: '3',
    image: 'https://picsum.photos/750/400?random=52',
    title: '新品上线：广东靓汤订阅服务',
    link: '/recipe/guangdong',
    sort: 3,
    status: 'active',
    position: 'home_carousel',
    startTime: '2026-03-20',
    endTime: '2026-04-20',
    clicks: 6780,
  },
  {
    id: '4',
    image: 'https://picsum.photos/750/400?random=53',
    title: '清明节美食推荐',
    link: '/topic/qingming',
    sort: 4,
    status: 'inactive',
    position: 'home_carousel',
    startTime: '2026-04-01',
    endTime: '2026-04-07',
    clicks: 0,
  },
];

const BannerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingBanner(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingBanner(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除该Banner?',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success(editingBanner ? '修改成功' : '添加成功');
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Banner图片',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: (image: string) => <Image src={image} width={120} height={60} style={{ objectFit: 'cover' }} />,
    },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '跳转链接', dataIndex: 'link', key: 'link', ellipsis: true, render: (l: string) => <Tag>{l}</Tag> },
    {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      width: 120,
      render: (p: string) => <Tag color="blue">{p === 'home_carousel' ? '首页轮播' : '分类Banner'}</Tag>,
    },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 60 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>,
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
    { title: '点击量', dataIndex: 'clicks', key: 'clicks', width: 80, render: (c: number) => c.toLocaleString() },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="Banner管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加Banner
          </Button>
        }
      >
        <Table
          dataSource={mockBannerList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingBanner ? '编辑Banner' : '添加Banner'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入Banner标题" />
          </Form.Item>
          <Form.Item name="image" label="Banner图片" rules={[{ required: true }]}>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PictureOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="link" label="跳转链接" rules={[{ required: true }]}>
            <Input placeholder="请输入跳转链接，如 /topic/xxx" />
          </Form.Item>
          <Space>
            <Form.Item name="position" label="位置" rules={[{ required: true }]} style={{ width: 180 }}>
              <Select
                placeholder="选择位置"
                options={[
                  { value: 'home_carousel', label: '首页轮播' },
                  { value: 'category_banner', label: '分类Banner' },
                ]}
              />
            </Form.Item>
            <Form.Item name="sort" label="排序" rules={[{ required: true }]} style={{ width: 100 }}>
              <InputNumber min={1} max={99} />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item name="startTime" label="开始时间" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerPage;
