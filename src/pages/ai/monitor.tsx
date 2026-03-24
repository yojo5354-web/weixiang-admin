import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Badge, Timeline, Typography, Space } from 'antd';
import { CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './monitor.less';

const { Title, Text } = Typography;

// AI服务状态配置
const serviceStatusMap: Record<string, { color: string; icon: any; label: string }> = {
  running: { color: 'green', icon: <CheckCircleOutlined />, label: '正常' },
  warning: { color: 'orange', icon: <WarningOutlined />, label: '警告' },
  error: { color: 'red', icon: <ExclamationCircleOutlined />, label: '异常' },
  stopped: { color: 'default', icon: <ClockCircleOutlined />, label: '停机' },
};

// 模拟AI服务数据
const mockAiServices = [
  { id: '1', name: '食谱生成服务', status: 'running', avgResponseTime: 0.85, todayCalls: 125680, errorRate: 0.3, successRate: 99.7 },
  { id: '2', name: '封面图生成服务', status: 'running', avgResponseTime: 2.35, todayCalls: 45632, errorRate: 0.8, successRate: 99.2 },
  { id: '3', name: '食物识别服务', status: 'running', avgResponseTime: 0.45, todayCalls: 234567, errorRate: 0.2, successRate: 99.8 },
  { id: '4', name: '语音识别服务', status: 'running', avgResponseTime: 0.35, todayCalls: 78900, errorRate: 0.5, successRate: 99.5 },
  { id: '5', name: '智能标签服务', status: 'warning', avgResponseTime: 1.25, todayCalls: 345678, errorRate: 2.1, successRate: 97.9 },
  { id: '6', name: '内容审核服务', status: 'running', avgResponseTime: 0.55, todayCalls: 567890, errorRate: 0.4, successRate: 99.6 },
];

// 模拟告警记录
const mockAlerts = [
  { time: '10:30:15', type: 'warning', service: '智能标签服务', message: '响应时间超过阈值(1s)' },
  { time: '09:15:00', type: 'info', service: '食谱生成服务', message: '调用量突增，当前负载78%' },
  { time: '08:00:00', type: 'success', service: '智能标签服务', message: '服务已恢复正常' },
  { time: '07:45:30', type: 'error', service: '智能标签服务', message: '服务响应超时，错误率上升至5.2%' },
];

const AiMonitorPage: React.FC = () => {
  const columns: ColumnsType<any> = [
    { title: '服务名称', dataIndex: 'name', key: 'name', render: (name: string) => <Text strong>{name}</Text> },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Space>
          <Badge status={serviceStatusMap[status]?.color as any} />
          <Tag color={serviceStatusMap[status]?.color}>{serviceStatusMap[status]?.label}</Tag>
        </Space>
      ),
    },
    {
      title: '平均响应时间',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      width: 130,
      render: (t: number) => <Text type={t > 1 ? 'warning' : 'secondary'}>{t}s</Text>,
    },
    {
      title: '今日调用量',
      dataIndex: 'todayCalls',
      key: 'todayCalls',
      width: 120,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: '错误率',
      dataIndex: 'errorRate',
      key: 'errorRate',
      width: 100,
      render: (r: number) => <Text type={r > 1 ? 'danger' : 'secondary'}>{r}%</Text>,
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 150,
      render: (r: number) => <Progress percent={r} size="small" status={r >= 99 ? 'active' : 'exception'} />,
    },
  ];

  // 计算统计数据
  const totalCalls = mockAiServices.reduce((sum, s) => sum + s.todayCalls, 0);
  const avgResponseTime = (mockAiServices.reduce((sum, s) => sum + s.avgResponseTime, 0) / mockAiServices.length).toFixed(2);
  const avgErrorRate = (mockAiServices.reduce((sum, s) => sum + s.errorRate, 0) / mockAiServices.length).toFixed(2);
  const avgSuccessRate = (mockAiServices.reduce((sum, s) => sum + s.successRate, 0) / mockAiServices.length).toFixed(1);

  return (
    <div className={styles.page}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="服务状态" value="6/6正常" prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日总调用量" value={totalCalls} precision={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均响应时间" value={avgResponseTime} suffix="s" /></Card></Col>
        <Col span={6}><Card><Statistic title="平均成功率" value={avgSuccessRate} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card title="服务监控">
        <Table dataSource={mockAiServices} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Card title="告警记录" style={{ marginTop: 16 }}>
        <Timeline
          items={mockAlerts.map((alert) => ({
            color: alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'orange' : alert.type === 'success' ? 'green' : 'blue',
            children: (
              <div>
                <Text type="secondary">{alert.time}</Text>
                <Tag color={alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'orange' : alert.type === 'success' ? 'green' : 'blue'}>
                  {alert.type === 'error' ? '错误' : alert.type === 'warning' ? '警告' : alert.type === 'success' ? '恢复' : '通知'}
                </Tag>
                <Text strong> {alert.service}</Text>
                <div><Text type="secondary">{alert.message}</Text></div>
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
};

export default AiMonitorPage;
