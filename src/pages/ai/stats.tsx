import { useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './stats.less';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// AI功能定价
const aiPricing = [
  { feature: '食物识别', price: 0.01, unit: '次', description: '图像识别食物种类和营养成分' },
  { feature: '食谱生成', price: 0.10, unit: '次', description: '根据食材生成完整食谱' },
  { feature: '语音识别', price: 0.005, unit: '次', description: 'ASR语音转文字' },
  { feature: '封面图生成', price: 0.50, unit: '次', description: 'AI生成高质量封面图' },
  { feature: '智能标签', price: 0.005, unit: '次', description: '自动识别内容标签' },
  { feature: '内容审核', price: 0.01, unit: '次', description: '文本+图像内容审核' },
];

// 模拟调用统计
const mockCallStats = [
  { date: '2026-03-22', foodRecognition: 3456, recipeGeneration: 1234, voiceRecognition: 890, coverGeneration: 456, smartTag: 5678, contentReview: 8900 },
  { date: '2026-03-21', foodRecognition: 4230, recipeGeneration: 1567, voiceRecognition: 1023, coverGeneration: 523, smartTag: 6789, contentReview: 10234 },
  { date: '2026-03-20', foodRecognition: 3890, recipeGeneration: 1456, voiceRecognition: 967, coverGeneration: 489, smartTag: 6234, contentReview: 9567 },
  { date: '2026-03-19', foodRecognition: 4567, recipeGeneration: 1789, voiceRecognition: 1123, coverGeneration: 567, smartTag: 7234, contentReview: 11234 },
  { date: '2026-03-18', foodRecognition: 4234, recipeGeneration: 1678, voiceRecognition: 1056, coverGeneration: 534, smartTag: 6890, contentReview: 10567 },
];

const AiStatsPage: React.FC = () => {
  const [loading] = useState(false);

  // 计算统计数据
  const totalCalls = mockCallStats.reduce((sum, day) =>
    sum + day.foodRecognition + day.recipeGeneration + day.voiceRecognition + day.coverGeneration + day.smartTag + day.contentReview, 0
  );

  const callColumns: ColumnsType<any> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '食物识别', dataIndex: 'foodRecognition', key: 'foodRecognition', sorter: true },
    { title: '食谱生成', dataIndex: 'recipeGeneration', key: 'recipeGeneration', sorter: true },
    { title: '语音识别', dataIndex: 'voiceRecognition', key: 'voiceRecognition', sorter: true },
    { title: '封面图生成', dataIndex: 'coverGeneration', key: 'coverGeneration', sorter: true },
    { title: '智能标签', dataIndex: 'smartTag', key: 'smartTag', sorter: true },
    { title: '内容审核', dataIndex: 'contentReview', key: 'contentReview', sorter: true },
  ];

  const pricingColumns: ColumnsType<any> = [
    { title: '功能', dataIndex: 'feature', key: 'feature', render: (f: string) => <span style={{ fontWeight: 500 }}>{f}</span> },
    { title: '单价', dataIndex: 'price', key: 'price', render: (p: number) => <span>¥{p.toFixed(3)}</span> },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="AI服务调用统计"
        extra={<RangePicker defaultValue={[dayjs().subtract(7, 'day'), dayjs()]} />}
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Statistic title="总调用量" value={totalCalls} prefix={<RobotOutlined />} /></Col>
          <Col span={6}><Statistic title="今日调用量" value={20234} valueStyle={{ color: '#52c41a' }} /></Col>
          <Col span={6}><Statistic title="本月消耗" value={2567.89} prefix="¥" precision={2} /></Col>
          <Col span={6}><Statistic title="日均调用" value={(totalCalls / 5).toFixed(0)} /></Col>
        </Row>

        <Tabs
          items={[
            {
              key: 'trend',
              label: '调用趋势',
              children: <Table dataSource={mockCallStats} columns={callColumns} rowKey="date" loading={loading} pagination={false} />,
            },
            {
              key: 'pricing',
              label: '功能定价',
              children: <Table dataSource={aiPricing} columns={pricingColumns} rowKey="feature" pagination={false} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AiStatsPage;
