import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs } from 'antd';
import { FileTextOutlined, HeartOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './content.less';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 模拟内容数据
const mockDailyContent = [
  { date: '2026-03-22', published: 326, likes: 12560, comments: 2340, favorites: 1560 },
  { date: '2026-03-21', published: 456, likes: 15678, comments: 3120, favorites: 2130 },
  { date: '2026-03-20', published: 398, likes: 13450, comments: 2890, favorites: 1890 },
  { date: '2026-03-19', published: 512, likes: 17890, comments: 3450, favorites: 2340 },
  { date: '2026-03-18', published: 489, likes: 16780, comments: 3230, favorites: 2150 },
  { date: '2026-03-17', published: 423, likes: 14560, comments: 2980, favorites: 2010 },
  { date: '2026-03-16', published: 367, likes: 12340, comments: 2560, favorites: 1780 },
];

// 模拟热门内容
const mockTopContent = [
  { rank: 1, title: '川味水煮鱼，麻辣鲜香太过瘾了', author: '川菜大师', likes: 5678, comments: 345 },
  { rank: 2, title: '减脂餐必备！鸡胸肉的神仙吃法', author: '健身教练李姐', likes: 3456, comments: 234 },
  { rank: 3, title: '广东人最爱的早茶点心，自己在家做', author: '粤菜师傅', likes: 2987, comments: 189 },
  { rank: 4, title: '这个蛋糕方子太绝了，新手也能一次成功', author: '烘焙达人', likes: 2567, comments: 156 },
  { rank: 5, title: '家常红烧肉，肥而不腻入口即化', author: '美食达人小王', likes: 2345, comments: 145 },
];

// 模拟分类数据
const mockCategoryStats = [
  { category: '川菜', count: 12560, percentage: 18 },
  { category: '粤菜', count: 9820, percentage: 14 },
  { category: '烘焙', count: 8760, percentage: 12 },
  { category: '快手菜', count: 7680, percentage: 11 },
  { category: '减脂餐', count: 6540, percentage: 9 },
  { category: '其他', count: 24640, percentage: 36 },
];

const StatsContentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<any> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '发布量', dataIndex: 'published', key: 'published', width: 100, sorter: true },
    { title: '点赞数', dataIndex: 'likes', key: 'likes', width: 100, sorter: true },
    { title: '评论数', dataIndex: 'comments', key: 'comments', width: 100, sorter: true },
    { title: '收藏数', dataIndex: 'favorites', key: 'favorites', width: 100, sorter: true },
  ];

  const topColumns: ColumnsType<any> = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (r: number) => <span style={{ color: r <= 3 ? '#ff4d4f' : '#999' }}>{r}</span> },
    { title: '内容标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    { title: '点赞', dataIndex: 'likes', key: 'likes', width: 80, sorter: true },
    { title: '评论', dataIndex: 'comments', key: 'comments', width: 80, sorter: true },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="内容数据统计"
        extra={<RangePicker defaultValue={[dayjs().subtract(7, 'day'), dayjs()]} />}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Statistic title="累计发布量" value={125680} prefix={<FileTextOutlined />} /></Col>
          <Col span={6}><Statistic title="今日发布" value={326} prefix={<FileTextOutlined />} valueStyle={{ color: '#52c41a' }} /></Col>
          <Col span={6}><Statistic title="今日获赞" value={12560} prefix={<HeartOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Col>
          <Col span={6}><Statistic title="今日评论" value={2340} prefix={<MessageOutlined />} valueStyle={{ color: '#1890ff' }} /></Col>
        </Row>

        <Tabs
          items={[
            {
              key: 'trend',
              label: '内容趋势',
              children: <Table dataSource={mockDailyContent} columns={columns} rowKey="date" pagination={false} />,
            },
            {
              key: 'top',
              label: '热门内容',
              children: <Table dataSource={mockTopContent} columns={topColumns} rowKey="rank" pagination={false} />,
            },
            {
              key: 'category',
              label: '分类分布',
              children: (
                <Table
                  dataSource={mockCategoryStats}
                  columns={[
                    { title: '分类', dataIndex: 'category', key: 'category' },
                    { title: '内容量', dataIndex: 'count', key: 'count', sorter: true, render: (v: number) => v.toLocaleString() },
                    { title: '占比', dataIndex: 'percentage', key: 'percentage', render: (v: number) => `${v}%` },
                  ]}
                  rowKey="category"
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

export default StatsContentPage;
