import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, message, Tabs, Statistic, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, BankOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './settlement.less';

// 结算状态配置
const statusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待处理' },
  approved: { color: 'blue', label: '已通过' },
  processing: { color: 'purple', label: '打款中' },
  completed: { color: 'green', label: '已完成' },
  rejected: { color: 'red', label: '已驳回' },
};

// 模拟结算申请数据
const mockSettlementList = [
  {
    id: '1',
    applicant: { id: '1', name: '美食达人小王', avatar: '' },
    type: 'influencer',
    amount: 1256.80,
    orderCount: 45,
    account: '微信支付',
    accountNo: 'wechat_138****1234',
    applyTime: '2026-03-21 10:00',
    status: 'pending',
  },
  {
    id: '2',
    applicant: { id: '3', name: '粤菜师傅', avatar: '' },
    type: 'influencer',
    amount: 896.50,
    orderCount: 32,
    account: '支付宝',
    accountNo: 'alipay_136****9012',
    applyTime: '2026-03-20 15:30',
    status: 'pending',
  },
  {
    id: '3',
    applicant: { id: '2', name: '健身教练李姐', avatar: '' },
    type: 'influencer',
    amount: 567.20,
    orderCount: 28,
    account: '微信支付',
    accountNo: 'wechat_139****5678',
    applyTime: '2026-03-15 09:00',
    status: 'completed',
    processTime: '2026-03-16 14:00',
  },
  {
    id: '4',
    applicant: { id: '5', name: '健康轻食馆', avatar: '' },
    type: 'merchant',
    amount: 2345.60,
    orderCount: 78,
    account: '支付宝',
    accountNo: 'alipay_137****3456',
    applyTime: '2026-03-10 11:00',
    status: 'completed',
    processTime: '2026-03-11 10:00',
  },
];

const SettlementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const filteredList = activeTab === 'all'
    ? mockSettlementList
    : mockSettlementList.filter((item) => item.status === activeTab);

  const handleApprove = (record: any) => {
    Modal.confirm({
      title: '确认通过该结算申请?',
      icon: <CheckOutlined />,
      content: `向 ${record.applicant.name} 支付 ¥${record.amount}`,
      okText: '确认通过',
      onOk: () => {
        message.success('已通过，将进行打款');
      },
    });
  };

  const handleReject = (record: any) => {
    Modal.confirm({
      title: '确认驳回该结算申请?',
      icon: <CloseOutlined />,
      content: '请选择驳回原因',
      okText: '确认驳回',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('已驳回');
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '申请人',
      key: 'applicant',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.applicant.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>ID: {record.applicant.id}</div>
        </div>
      ),
    },
    {
      title: '身份类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={type === 'influencer' ? 'orange' : 'purple'}>{type === 'influencer' ? '达人' : '商家'}</Tag>,
    },
    {
      title: '结算金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => <span style={{ color: '#ff4d4f', fontWeight: 500 }}>¥{amount.toFixed(2)}</span>,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 80,
    },
    {
      title: '收款方式',
      key: 'account',
      render: (_, record) => (
        <div>
          <div>{record.account}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.accountNo}</div>
        </div>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => {
        if (record.status === 'pending') {
          return (
            <Space size="small">
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>通过</Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>驳回</Button>
            </Space>
          );
        }
        return <Button type="link" size="small">详情</Button>;
      },
    },
  ];

  const tabItems = [
    { key: 'pending', label: `待处理 (${mockSettlementList.filter((i) => i.status === 'pending').length})` },
    { key: 'approved', label: '已通过' },
    { key: 'processing', label: '打款中' },
    { key: 'completed', label: '已完成' },
    { key: 'rejected', label: '已驳回' },
    { key: 'all', label: '全部' },
  ];

  // 统计数据
  const pendingAmount = mockSettlementList.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const completedAmount = mockSettlementList.filter((i) => i.status === 'completed').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className={styles.page}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="待处理笔数" value={2} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待处理金额" value={pendingAmount} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="本月已结算" value={completedAmount} prefix="¥" precision={2} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="本月结算笔数" value={2} /></Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <Table
          dataSource={filteredList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredList.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default SettlementPage;
