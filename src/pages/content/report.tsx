import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Image, Typography, message, Select, Form, Timeline } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './report.less';

const { Text, Paragraph } = Typography;

// 举报类型配置
const reportTypeMap: Record<string, { color: string; priority: string }> = {
  plagiarism: { color: 'purple', priority: 'P1' },
  rumor: { color: 'purple', priority: 'P1' },
  porn: { color: 'red', priority: 'P0' },
  violence: { color: 'red', priority: 'P0' },
  violation: { color: 'orange', priority: 'P2' },
  advertising: { color: 'orange', priority: 'P2' },
  other: { color: 'default', priority: 'P3' },
};

const reportTypeLabels: Record<string, string> = {
  plagiarism: '抄袭',
  rumor: '谣言',
  porn: '色情',
  violence: '暴力',
  violation: '违规',
  advertising: '广告',
  other: '其他',
};

// 模拟数据
const mockReportList = [
  {
    id: '1',
    contentCover: 'https://picsum.photos/200/150?random=20',
    contentTitle: '川味水煮鱼做法详解',
    contentAuthor: '川菜大师',
    type: 'plagiarism',
    reason: '该内容完全抄袭了博主"美食研究所"于2026-03-10发布的原创内容',
    reporter: { id: '1', name: '用户123', avatar: '' },
    createTime: '2026-03-22 10:00',
    status: 'pending',
    evidence: ['证据1: 原文链接', '证据2: 截图'],
  },
  {
    id: '2',
    contentCover: 'https://picsum.photos/200/150?random=21',
    contentTitle: '减肥药内幕大揭秘',
    contentAuthor: '匿名用户',
    type: 'rumor',
    reason: '文章声称某种减肥药可以一周瘦10斤，属于虚假宣传',
    reporter: { id: '2', name: '用户456', avatar: '' },
    createTime: '2026-03-22 09:30',
    status: 'pending',
    evidence: [],
  },
  {
    id: '3',
    contentCover: 'https://picsum.photos/200/150?random=22',
    contentTitle: '隔夜菜会致癌？真相来了',
    contentAuthor: '营养师小李',
    type: 'rumor',
    reason: '文章传播隔夜菜致癌的谣言',
    reporter: { id: '3', name: '用户789', avatar: '' },
    createTime: '2026-03-22 08:15',
    status: 'pending',
    evidence: [],
  },
  {
    id: '4',
    contentCover: 'https://picsum.photos/200/150?random=23',
    contentTitle: '某某减肥药推荐',
    contentAuthor: '微商代理',
    type: 'advertising',
    reason: '恶意营销推广，疑似三无产品',
    reporter: { id: '4', name: '用户001', avatar: '' },
    createTime: '2026-03-21 16:00',
    status: 'pending',
    evidence: [],
  },
];

const handleResults = [
  { label: '举报成立', value: 'valid' },
  { label: '举报不成立', value: 'invalid' },
  { label: '内容整改', value: 'rectify' },
  { label: '待核实', value: 'pending_verify' },
];

const ReportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [handleVisible, setHandleVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const handleReport = (record: any, result: string) => {
    message.success(`已处理：${result === 'valid' ? '举报成立' : result === 'invalid' ? '举报不成立' : result}`);
  };

  const columns: ColumnsType<any> = [
    {
      title: '被举报内容',
      key: 'content',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Image src={record.contentCover} width={60} height={45} style={{ objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.contentTitle}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>发布者: {record.contentAuthor}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '举报类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Space direction="vertical" size={0}>
          <Tag color={reportTypeMap[type]?.color}>{reportTypeLabels[type]}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>{reportTypeMap[type]?.priority}</Text>
        </Space>
      ),
    },
    {
      title: '举报原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '举报人',
      key: 'reporter',
      width: 100,
      render: (_, record) => <span>{record.reporter.name}</span>,
    },
    {
      title: '举报时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'handled' ? 'green' : 'default'}>
          {status === 'pending' ? '待处理' : '已处理'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setCurrentReport(record);
            setDetailVisible(true);
          }}>
            详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => {
                setCurrentReport(record);
                setHandleVisible(true);
              }}>
                处理
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card title="举报管理">
        <Table
          dataSource={mockReportList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 3,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条待处理举报`,
          }}
        />
      </Card>

      {/* 举报详情弹窗 */}
      <Modal
        title="举报详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button key="invalid" onClick={() => {
            handleReport(currentReport, 'invalid');
            setDetailVisible(false);
          }}>
            举报不成立
          </Button>,
          <Button key="valid" type="primary" danger onClick={() => {
            setDetailVisible(false);
            setHandleVisible(true);
          }}>
            举报成立
          </Button>,
        ]}
        width={700}
      >
        {currentReport && (
          <div>
            <h4>被举报内容</h4>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Image src={currentReport.contentCover} width={150} height={112} style={{ objectFit: 'cover' }} />
              <div>
                <h3>{currentReport.contentTitle}</h3>
                <p>发布者: {currentReport.contentAuthor}</p>
              </div>
            </div>

            <h4>举报信息</h4>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>举报类型:</Text>
                <Tag color={reportTypeMap[currentReport.type]?.color}>
                  {reportTypeLabels[currentReport.type]}
                </Tag>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报原因:</Text>
              <Paragraph>{currentReport.reason}</Paragraph>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报人:</Text> {currentReport.reporter.name}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报时间:</Text> {currentReport.createTime}
            </div>
            {currentReport.evidence.length > 0 && (
              <div>
                <Text strong>证据:</Text>
                <ul>
                  {currentReport.evidence.map((e: string, i: number) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 处理弹窗 */}
      <Modal
        title="处理举报"
        open={handleVisible}
        onCancel={() => setHandleVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={(values) => {
          message.success('处理成功');
          setHandleVisible(false);
        }}>
          <Form.Item label="处理结果" name="result" rules={[{ required: true }]}>
            <Select options={handleResults} placeholder="请选择处理结果" />
          </Form.Item>
          <Form.Item label="处理备注" name="note">
            <Select
              mode="multiple"
              placeholder="选择或输入原因标签"
              options={[
                { label: '抄袭他人内容', value: 'plagiarism_content' },
                { label: '传播虚假信息', value: 'fake_info' },
                { label: '低俗内容', value: 'vulgar_content' },
                { label: '恶意营销', value: 'malicious_marketing' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setHandleVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确认处理</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportPage;
