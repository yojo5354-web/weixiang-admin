import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs, Progress } from 'antd';
import { ShoppingCartOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './commercial.less';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 模拟商业数据
const mockDailyCommercial = [
  { date: '2026-03-22', gmv: 45680, orders: 156, avgOrderValue: 292.82, conversionRate: 3.2 },
  { date: '2026-03-21', gmv: 56780, orders: 189, avgOrderValue: 300.42, conversionRate: 3.5 },
  { date: '2026-03-20', gmv: 52340, orders: 178, avgOrderValue: 294.04, conversionRate: 3.3 },
  { date: '2026-03-19', gmv: 61230, orders: 205, avgOrderValue: 298.68, conversionRate: 3.8 },
  { date: '2026-03-18', gmv: 58960, orders: 198, avgOrderValue: 297.78, conversionRate: 3.6 },
  { date: '2026-03-17', gmv: 54560, orders: 184, avgOrderValue: 296.52, conversionRate: 3.4 },
  { date: '2026-03-16', gmv: 49870, orders: 167, avgOrderValue: 298.62, conversionRate: 3.1 },
];

// 模拟渠道数据
const mockChannelStats = [
  { channel: '短视频带货', gmv: 456780, orders: 1234, percentage: 45 },
  { channel: '直播带货', gmv: 298560, orders: 856, percentage: 29 },
  { channel: '图文种草', gmv: 156340, orders: 678, percentage: 15 },
  { channel: '搜索推广', gmv: 89670, orders: 234, percentage: 8 },
  { channel: '其他', gmv: 25650, orders: 89, percentage: 3 },
];

const StatsCommercialPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<any> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'GMV', dataIndex: 'gmv', key: 'gmv', width: 120, sorter: true, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '订单数', dataIndex: 'orders', key: 'orders', width: 100, sorter: true },
    { title: '客单价', dataIndex: 'avgOrderValue', key: 'avgOrderValue', width: 100, sorter: true, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '转化率', dataIndex: 'conversionRate', key: 'conversionRate', width: 100, sorter: true, render: (v: number) => `${v}%` },
  ];

  const channelColumns: ColumnsType<any> = [
    { title: '渠道', dataIndex: 'channel', key: 'channel' },
    { title: 'GMV', dataIndex: 'gmv', key: 'gmv', sorter: true, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '订单数', dataIndex: 'orders', key: 'orders', sorter: true },
    { title: '占比', dataIndex: 'percentage', key: 'percentage', render: (v: number) => <Progress percent={v} size="small" /> },
    { title: '占比', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%` },
  ];

  // 计算总计
  const totalGMV = mockDailyCommercial.reduce((sum, item) => sum + item.gmv, 0);
  const totalOrders = mockDailyCommercial.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className={styles.page}>
      <Card
        title="商业数据统计"
        extra={<RangePicker defaultValue={[dayjs().subtract(7, 'day'), dayjs()]} />}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Statistic title="本月GMV" value={896520} prefix="¥" precision={0} prefix={<MoneyCollectOutlined />} /></Col>
          <Col span={6}><Statistic title="今日GMV" value={45680} prefix="¥" precision={0} valueStyle={{ color: '#ff4d4f' }} /></Col>
          <Col span={6}><Statistic title="今日订单" value={156} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#52c41a' }} /></Col>
          <Col span={6}><Statistic title="平均客单价" value={292.82} prefix="¥" precision={2} /></Col>
        </Row>

        <Tabs
          items={[
            {
              key: 'trend',
              label: '销售趋势',
              children: <Table dataSource={mockDailyCommercial} columns={columns} rowKey="date" pagination={false} />,
            },
            {
              key: 'channel',
              label: '渠道分布',
              children: <Table dataSource={mockChannelStats} columns={channelColumns} rowKey="channel" pagination={false} />,
            },
            {
              key: 'product',
              label: '商品排行',
              children: (
                <Table
                  dataSource={[
                    { rank: 1, name: '川味麻辣火锅底料', sales: 1256, gmv: 50155.4 },
                    { rank: 2, name: '低脂鸡胸肉套餐', sales: 986, gmv: 49179.4 },
                    { rank: 3, name: '广东靓汤料包', sales: 876, gmv: 59564.8 },
                    { rank: 4, name: '手工月饼礼盒', sales: 654, gmv: 83712.0 },
                    { rank: 5, name: '减脂蔬菜沙拉', sales: 567, gmv: 28350.3 },
                  ]}
                  columns={[
                    { title: '排名', dataIndex: 'rank', key: 'rank', render: (r: number) => <span style={{ color: r <= 3 ? '#ff4d4f' : '#999' }}>{r}</span> },
                    { title: '商品名称', dataIndex: 'name', key: 'name', ellipsis: true },
                    { title: '销量', dataIndex: 'sales', key: 'sales', sorter: true },
                    { title: 'GMV', dataIndex: 'gmv', key: 'gmv', sorter: true, render: (v: number) => `¥${v.toLocaleString()}` },
                  ]}
                  rowKey="rank"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default StatsCommercialPage;
