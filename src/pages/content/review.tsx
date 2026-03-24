import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Image, Typography, message, Input, Select, Form } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './review.less';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// 待审核内容
const mockReviewList = [
  {
    id: '1',
    cover: 'https://picsum.photos/200/150?random=10',
    title: '减脂餐必备！鸡胸肉的神仙吃法，低卡又美味',
    summary: '很多减肥的朋友都觉得减脂餐很单调，今天教大家做一道非常好吃的鸡胸肉料理...',
    author: { id: '2', name: '健身教练李姐', avatar: '' },
    category: '减脂餐',
    tags: ['减脂', '鸡胸肉', '健康'],
    createTime: '2026-03-22 09:15',
    aiResult: '可疑度15%',
  },
  {
    id: '2',
    cover: 'https://picsum.photos/200/150?random=11',
    title: '自制酸奶，干净卫生无添加',
    summary: '外面买的酸奶添加剂太多，不如自己在家做，简单几步就能做出香浓的酸奶...',
    author: { id: '6', name: '健康生活家', avatar: '' },
    category: '健康饮食',
    tags: ['酸奶', '自制', '健康'],
    createTime: '2026-03-22 08:30',
    aiResult: '正常',
  },
  {
    id: '3',
    cover: 'https://picsum.photos/200/150?random=12',
    title: '懒人版披萨，10分钟搞定早餐',
    summary: '用吐司面包做底，放上芝士和火腿，放进烤箱烤5分钟，超级简单...',
    author: { id: '7', name: '懒人美食家', avatar: '' },
    category: '快手菜',
    tags: ['披萨', '快手', '早餐'],
    createTime: '2026-03-22 07:45',
    aiResult: '正常',
  },
];

const rejectReasons = [
  { label: '夸大宣传', value: 'exaggerate' },
  { label: '低质内容', value: 'low_quality' },
  { label: '抄袭搬运', value: 'plagiarism' },
  { label: '违规信息', value: 'violation' },
  { label: '营销广告', value: 'advertising' },
  { label: '其他', value: 'other' },
];

const ContentReviewPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [rejectForm] = Form.useForm();

  const handlePass = (record: any) => {
    Modal.confirm({
      title: '确认通过审核?',
      icon: <CheckOutlined />,
      content: `通过后该内容将正常发布`,
      okText: '确认通过',
      cancelText: '取消',
      onOk: () => {
        message.success('审核通过');
      },
    });
  };

  const handleReject = (record: any) => {
    setCurrentContent(record);
    setRejectVisible(true);
  };

  const submitReject = () => {
    rejectForm.validateFields().then((values) => {
      message.success('已驳回该内容');
      setRejectVisible(false);
      rejectForm.resetFields();
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '内容封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      render: (cover: string) => <Image src={cover} width={80} height={60} style={{ objectFit: 'cover' }} />,
    },
    {
      title: '内容信息',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.title}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.summary.slice(0, 50)}...</Text>
          <div style={{ marginTop: 4 }}>
            {record.tags.slice(0, 3).map((tag: string) => (
              <Tag key={tag} style={{ marginRight: 4 }}>{tag}</Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '发布者',
      key: 'author',
      width: 120,
      render: (_, record) => <span>{record.author.name}</span>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 80,
    },
    {
      title: 'AI预审',
      dataIndex: 'aiResult',
      key: 'aiResult',
      width: 100,
      render: (result: string) => (
        <Tag color={result === '正常' ? 'green' : 'orange'}>{result}</Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
            setCurrentContent(record);
            setDetailVisible(true);
          }}>
            查看
          </Button>
          <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handlePass(record)}>
            通过
          </Button>
          <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card title="内容审核">
        <Table
          dataSource={mockReviewList}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 18,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条待审核内容`,
          }}
        />
      </Card>

      {/* 查看详情弹窗 */}
      <Modal
        title="内容详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => {
            setDetailVisible(false);
            handleReject(currentContent);
          }}>
            驳回
          </Button>,
          <Button key="pass" type="primary" icon={<CheckOutlined />} onClick={() => {
            handlePass(currentContent);
            setDetailVisible(false);
          }}>
            通过
          </Button>,
        ]}
        width={700}
      >
        {currentContent && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <Image src={currentContent.cover} width={200} height={150} style={{ objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3>{currentContent.title}</h3>
                <p>作者: {currentContent.author.name}</p>
                <p>分类: {currentContent.category}</p>
                <p>标签: {currentContent.tags.join(', ')}</p>
                <p>提交时间: {currentContent.createTime}</p>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4>内容摘要:</h4>
              <Paragraph>{currentContent.summary}</Paragraph>
            </div>
            <div>
              <h4>AI预审结果:</h4>
              <Tag color={currentContent.aiResult === '正常' ? 'green' : 'orange'}>
                {currentContent.aiResult}
              </Tag>
            </div>
          </div>
        )}
      </Modal>

      {/* 驳回弹窗 */}
      <Modal
        title="驳回内容"
        open={rejectVisible}
        onCancel={() => setRejectVisible(false)}
        onOk={submitReject}
        okText="确认驳回"
        cancelText="取消"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="驳回原因"
            rules={[{ required: true, message: '请选择驳回原因' }]}
          >
            <Select options={rejectReasons} placeholder="请选择驳回原因" />
          </Form.Item>
          <Form.Item name="note" label="补充说明">
            <TextArea rows={3} placeholder="可选，补充说明具体情况" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentReviewPage;
