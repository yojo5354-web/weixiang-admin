import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Statistic, Row, Col, Modal, message, Drawer, Descriptions, List, Avatar, Divider } from 'antd';
import { SearchOutlined, PayCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './recipe.less';

// 模拟食谱收入数据
const mockRecipeIncome = [
  {
    id: '1',
    cover: 'https://picsum.photos/200/150?random=40',
    title: '正宗四川麻婆豆腐详细教程',
    author: { id: '1', name: '川菜大师' },
    type: 'single',
    price: 29.9,
    salesCount: 1256,
    revenue: 37516.44,
    createTime: '2026-01-15',
  },
  {
    id: '2',
    cover: 'https://picsum.photos/200/150?random=41',
    title: '广东靓汤100例（订阅版）',
    author: { id: '3', name: '粤菜师傅' },
    type: 'subscription',
    price: 9.9,
    salesCount: 5680,
    revenue: 50673.60,
    createTime: '2026-02-01',
  },
  {
    id: '3',
    cover: 'https://picsum.photos/200/150?random=42',
    title: '减脂餐一周食谱合集',
    author: { id: '2', name: '健身教练李姐' },
    type: 'single',
    price: 19.9,
    salesCount: 3456,
    revenue: 62086.56,
    createTime: '2026-02-15',
  },
  {
    id: '4',
    cover: 'https://picsum.photos/200/150?random=43',
    title: '新手烘焙入门指南',
    author: { id: '6', name: '烘焙达人' },
    type: 'subscription',
    price: 19.9,
    salesCount: 2340,
    revenue: 42003.60,
    createTime: '2026-03-01',
  },
];

const RecipeIncomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<any>(null);

  // 模拟食谱订单数据
  const mockOrders = [
    { id: '1', buyer: '用户_A', time: '2026-03-21 10:30', amount: 29.9 },
    { id: '2', buyer: '用户_B', time: '2026-03-21 09:15', amount: 29.9 },
    { id: '3', buyer: '用户_C', time: '2026-03-20 18:45', amount: 9.9 },
  ];

  const handleViewDetail = (record: any) => {
    setCurrentRecipe(record);
    setDetailVisible(true);
  };

  const columns: ColumnsType<any> = [
    {
      title: '食谱信息',
      key: 'info',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={record.cover} width={60} height={60} style={{ objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>作者: {record.author.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'subscription' ? 'blue' : 'green'}>
          {type === 'subscription' ? '订阅制' : '单次购买'}
        </Tag>
      ),
    },
    {
      title: '定价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => <span>¥{price}</span>,
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount',
      width: 80,
      sorter: true,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '总收入',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      sorter: true,
      render: (revenue: number) => <span style={{ color: '#ff4d4f', fontWeight: 500 }}>¥{revenue.toLocaleString()}</span>,
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
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>详情</Button>
      ),
    },
  ];

  // 模拟统计数据
  const totalRevenue = mockRecipeIncome.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = mockRecipeIncome.reduce((sum, item) => sum + item.salesCount, 0);

  return (
    <div className={styles.page}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="本月食谱总收入" value={totalRevenue} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="本月销售量" value={totalSales} suffix="份" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="平均客单价" value={totalRevenue / totalSales} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="付费食谱数" value={4} /></Card>
        </Col>
      </Row>

      <Card title="食谱收入列表">
        <Table
          dataSource={mockRecipeIncome}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 25,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个食谱`,
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="食谱详情"
        placement="right"
        width={500}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          <Button icon={<CloseOutlined />} onClick={() => setDetailVisible(false)} />
        }
      >
        {currentRecipe && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <img 
                src={currentRecipe.cover} 
                alt={currentRecipe.title}
                style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8 }} 
              />
              <Descriptions column={1} size="small">
                <Descriptions.Item label="标题">{currentRecipe.title}</Descriptions.Item>
                <Descriptions.Item label="作者">{currentRecipe.author.name}</Descriptions.Item>
                <Descriptions.Item label="类型">
                  <Tag color={currentRecipe.type === 'subscription' ? 'blue' : 'green'}>
                    {currentRecipe.type === 'subscription' ? '订阅制' : '单次购买'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider>收入统计</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="定价" value={currentRecipe.price} prefix="¥" />
              </Col>
              <Col span={8}>
                <Statistic title="销量" value={currentRecipe.salesCount} />
              </Col>
              <Col span={8}>
                <Statistic title="总收入" value={currentRecipe.revenue} prefix="¥" valueStyle={{ color: '#ff4d4f' }} />
              </Col>
            </Row>

            <Divider>最近购买记录</Divider>
            <List
              dataSource={mockOrders}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.buyer[0]}</Avatar>}
                    title={item.buyer}
                    description={item.time}
                  />
                  <span style={{ color: '#ff4d4f' }}>¥{item.amount}</span>
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RecipeIncomePage;
