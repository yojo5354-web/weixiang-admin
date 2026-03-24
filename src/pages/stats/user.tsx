import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs, Progress, Typography } from 'antd';
import { UserOutlined, RiseOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './user.less';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// 模拟用户数据
const mockDailyUsers = [
  { date: '2026-03-22', newUsers: 156, dau: 8234, retained: 98.2 },
  { date: '2026-03-21', newUsers: 234, dau: 8567, retained: 97.8 },
  { date: '2026-03-20', newUsers: 198, dau: 7890, retained: 98.5 },
  { date: '2026-03-19', newUsers: 267, dau: 8234, retained: 97.9 },
  { date: '2026-03-18', newUsers: 312, dau: 9123, retained: 98.1 },
  { date: '2026-03-17', newUsers: 289, dau: 8678, retained: 98.3 },
  { date: '2026-03-16', newUsers: 245, dau: 8234, retained: 97.6 },
];

const mockUserPortrait = {
  gender: [
    { name: '女性', value: 62 },
    { name: '男性', value: 35 },
    { name: '未知', value: 3 },
  ],
  age: [
    { name: '18-24岁', value: 28 },
    { name: '25-34岁', value: 45 },
    { name: '35-44岁', value: 18 },
    { name: '45岁以上', value: 9 },
  ],
  device: [
    { name: 'iOS', value: 52 },
    { name: 'Android', value: 42 },
    { name: 'Web', value: 6 },
  ],
  region: [
    { name: '广东', value: 22 },
    { name: '北京', value: 15 },
    { name: '上海', value: 12 },
    { name: '浙江', value: 10 },
    { name: '江苏', value: 8 },
    { name: '其他', value: 33 },
  ],
};

const StatsUserPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<any> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '新增用户', dataIndex: 'newUsers', key: 'newUsers', width: 100, sorter: true },
    { title: 'DAU', dataIndex: 'dau', key: 'dau', width: 100, sorter: true },
    {
      title: '次日留存率',
      dataIndex: 'retained',
      key: 'retained',
      width: 120,
      sorter: true,
      render: (v: number) => <Text type={v >= 98 ? 'success' : 'warning'}>{v}%</Text>,
    },
  ];

  const portraitColumns: ColumnsType<any> = [
    { title: '维度', dataIndex: 'name', key: 'name', width: 100 },
    { title: '占比', dataIndex: 'value', key: 'value', render: (v: number) => <Progress percent={v} size="small" /> },
    { title: '占比', dataIndex: 'value', key: 'value', render: (v: number) => <Text>{v}%</Text> },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="用户数据统计"
        extra={
          <RangePicker defaultValue={[dayjs().subtract(7, 'day'), dayjs()]} />
        }
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Statistic title="总用户数" value={125680} prefix={<UserOutlined />} /></Col>
          <Col span={6}><Statistic title="本月新增" value={4521} prefix={<UserOutlined />} valueStyle={{ color: '#52c41a' }} /></Col>
          <Col span={6}><Statistic title="今日DAU" value={8234} prefix={<RiseOutlined />} valueStyle={{ color: '#1890ff' }} /></Col>
          <Col span={6}><Statistic title="今日新增" value={156} prefix={<UserOutlined />} valueStyle={{ color: '#722ed1' }} /></Col>
        </Row>

        <Tabs
          items={[
            {
              key: 'trend',
              label: '用户趋势',
              children: (
                <Table dataSource={mockDailyUsers} columns={columns} rowKey="date" pagination={false} />
              ),
            },
            {
              key: 'portrait',
              label: '用户画像',
              children: (
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="性别分布">
                      {mockUserPortrait.gender.map((item) => (
                        <div key={item.name} style={{ marginBottom: 16 }}>
                          <Text>{item.name}</Text>
                          <Progress percent={item.value} size="small" status="active" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="年龄分布">
                      {mockUserPortrait.age.map((item) => (
                        <div key={item.name} style={{ marginBottom: 16 }}>
                          <Text>{item.name}</Text>
                          <Progress percent={item.value} size="small" status="active" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12} style={{ marginTop: 24 }}>
                    <Card title="设备分布">
                      {mockUserPortrait.device.map((item) => (
                        <div key={item.name} style={{ marginBottom: 16 }}>
                          <Text>{item.name}</Text>
                          <Progress percent={item.value} size="small" status="active" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12} style={{ marginTop: 24 }}>
                    <Card title="地区分布">
                      {mockUserPortrait.region.map((item) => (
                        <div key={item.name} style={{ marginBottom: 16 }}>
                          <Text>{item.name}</Text>
                          <Progress percent={item.value} size="small" status="active" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default StatsUserPage;
