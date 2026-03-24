import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Modal, Image, Typography, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './order.less';

const { Text } = Typography;

// 订单状态配置
const statusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待支付' },
  paid: { color: 'blue', label: '已支付' },
  shipped: { color: 'purple', label: '已发货' },
  received: { color: 'cyan', label: '已收货' },
  settled: { color: 'green', label: '已结算' },
  refunded: { color: 'red', label: '已退款' },
};

// 模拟订单数据
const mockOrderList = [
  {
    id: 'ORD20260322001',
    productCover: 'https://picsum.photos/200/150?random=30',
    productName: '川味麻辣火锅底料 500g*2袋',
    productPrice: 39.9,
    quantity: 2,
    totalAmount: 79.8,
    commission: 7.98,
    buyer: { id: '1', name: '美食爱好者' },
    seller: { id: '2', name: '川味调料店' },
    influencer: { id: '3', name: '美食达人小王' },
    status: 'paid',
    createTime: '2026-03-22 10:30',
  },
  {
    id: 'ORD20260322002',
    productCover: 'https://picsum.photos/200/150?random=31',
    productName: '低脂鸡胸肉 1kg装',
    productPrice: 49.9,
    quantity: 1,
    totalAmount: 49.9,
    commission: 4.99,
    buyer: { id: '4', name: '健身达人' },
    seller: { id: '5', name: '健康轻食馆' },
    influencer: { id: '6', name: '健身教练李姐' },
    status: 'shipped',
    createTime: '2026-03-22 09:15',
  },
  {
    id: 'ORD20260321003',
    productCover: 'https://picsum.photos/200/150?random=32',
    productName: '广东靓汤料包 5包组合装',
    productPrice: 68,
    quantity: 1,
    totalAmount: 68,
    commission: 6.8,
    buyer: { id: '7', name: '广州街坊' },
    seller: { id: '8', name: '粤式汤料坊' },
    influencer: { id: '9', name: '粤菜师傅' },
    status: 'settled',
    createTime: '2026-03-21 18:20',
  },
  {
    id: 'ORD20260321004',
    productCover: 'https://picsum.photos/200/150?random=33',
    productName: '手工月饼礼盒 8口味',
    productPrice: 128,
    quantity: 1,
    totalAmount: 128,
    commission: 12.8,
    buyer: { id: '10', name: '送礼达人' },
    seller: { id: '11', name: '老字号糕点' },
    influencer: { id: '12', name: '烘焙达人' },
    status: 'refunded',
    createTime: '2026-03-21 14:00',
  },
];

const OrderPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const columns: ColumnsType<any> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (id: string) => <Tag>{id}</Tag>,
    },
    {
      title: '商品信息',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Image src={record.productCover} width={50} height={50} style={{ objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.productName}</div>
            <Text type="secondary">¥{record.productPrice} × {record.quantity}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '买家',
      key: 'buyer',
      width: 100,
      render: (_, record) => <span>{record.buyer.name}</span>,
    },
    {
      title: '商家',
      key: 'seller',
      width: 100,
      render: (_, record) => <span>{record.seller.name}</span>,
    },
    {
      title: '推广博主',
      key: 'influencer',
      width: 120,
      render: (_, record) => <Tag color="orange">{record.influencer.name}</Tag>,
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => <Text strong>¥{amount.toFixed(2)}</Text>,
    },
    {
      title: '佣金',
      dataIndex: 'commission',
      key: 'commission',
      width: 80,
      render: (c: number) => <Text type="secondary">¥{c.toFixed(2)}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
          setCurrentOrder(record);
          setDetailVisible(true);
        }}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="带货订单"
        extra={
          <Space>
            <Input
              placeholder="搜索订单号"
              prefix={<SearchOutlined />}
              style={{ width: 180 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="订单状态"
              style={{ width: 120 }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: '全部', value: undefined },
                ...Object.entries(statusMap).map(([value, item]) => ({ label: item.label, value })),
              ]}
            />
          </Space>
        }
      >
        <Table
          dataSource={mockOrderList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 156,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条订单`,
          }}
        />
      </Card>

      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentOrder && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text type="secondary">订单号：</Text>
                <Tag>{currentOrder.id}</Tag>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <Image src={currentOrder.productCover} width={100} height={100} style={{ objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{currentOrder.productName}</div>
                  <div>¥{currentOrder.productPrice} × {currentOrder.quantity}</div>
                </div>
              </div>
              <div>
                <Text type="secondary">订单金额：</Text>
                <Text strong style={{ color: '#ff4d4f' }}>¥{currentOrder.totalAmount.toFixed(2)}</Text>
              </div>
              <div>
                <Text type="secondary">佣金金额：</Text>
                <Text>¥{currentOrder.commission.toFixed(2)}</Text>
              </div>
              <div>
                <Text type="secondary">买家：</Text>
                {currentOrder.buyer.name}
              </div>
              <div>
                <Text type="secondary">商家：</Text>
                {currentOrder.seller.name}
              </div>
              <div>
                <Text type="secondary">推广博主：</Text>
                <Tag color="orange">{currentOrder.influencer.name}</Tag>
              </div>
              <div>
                <Text type="secondary">订单状态：</Text>
                <Tag color={statusMap[currentOrder.status]?.color}>{statusMap[currentOrder.status]?.label}</Tag>
              </div>
              <div>
                <Text type="secondary">下单时间：</Text>
                {currentOrder.createTime}
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
