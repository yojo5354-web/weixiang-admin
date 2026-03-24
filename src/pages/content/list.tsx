import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Button, Input, Select, Space, Modal, Image, Typography, message, Drawer, Descriptions, Divider } from 'antd';
import { EyeOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './list.less';
import { getContentList, getContentDetail, auditContent, deleteContent } from '@/services/api';

const { Text } = Typography;
const { confirm } = Modal;

// 状态映射：后端 0=待审核 1=通过 2=驳回 3=删除
const statusMap: Record<number, { color: string; text: string }> = {
  0: { color: 'orange', text: '待审核' },
  1: { color: 'green', text: '正常' },
  2: { color: 'red', text: '已驳回' },
  3: { color: 'default', text: '已删除' },
};

const ContentListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getContentList({
        page,
        limit: pageSize,
        status: statusFilter,
        keyword: searchText || undefined
      });
      if (res.code === 'SUCCESS') {
        setList(res.data.list || []);
        setTotal(res.data.total || 0);
      }
    } catch (err: any) {
      message.error('加载失败：' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, searchText]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleView = async (record: any) => {
    setPreviewVisible(true);
    setDetailLoading(true);
    try {
      const res: any = await getContentDetail(record.id);
      if (res.code === 'SUCCESS') {
        setCurrentContent(res.data);
      }
    } catch {
      setCurrentContent(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReviewPass = (record: any) => {
    confirm({
      title: '确认通过审核?',
      content: `通过后《${record.title}》将正常发布`,
      okText: '确认通过',
      onOk: async () => {
        try {
          await auditContent(record.id, { status: 'pass' });
          message.success('审核通过');
          loadList();
          if (previewVisible) setPreviewVisible(false);
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleReviewReject = (record: any) => {
    confirm({
      title: '驳回内容',
      content: `确定驳回《${record.title}》?`,
      okText: '确认驳回',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await auditContent(record.id, { status: 'reject', reason: '违反社区规范' });
          message.success('已驳回');
          loadList();
          if (previewVisible) setPreviewVisible(false);
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleDelete = (record: any) => {
    confirm({
      title: '确认删除该内容?',
      icon: <ExclamationCircleOutlined />,
      content: `《${record.title}》将被删除`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteContent(record.id);
          message.success('删除成功');
          loadList();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const parseImages = (images: string) => {
    try { return JSON.parse(images) || []; } catch { return []; }
  };
  const parseTags = (tags: string | null) => {
    if (!tags) return [];
    try { return JSON.parse(tags); } catch { return []; }
  };

  const columns: ColumnsType<any> = [
    {
      title: '封面',
      dataIndex: 'coverImage',
      key: 'cover',
      width: 100,
      render: (cover: string, record: any) => {
        const imgs = parseImages(record.images);
        const src = cover || imgs[0] || 'https://picsum.photos/80/60?random=1';
        return <Image src={src} width={80} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />;
      },
    },
    {
      title: '内容信息',
      key: 'info',
      render: (_, record) => {
        const tags = parseTags(record.tags);
        return (
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.title}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {(record.content || '').slice(0, 50)}{record.content?.length > 50 ? '...' : ''}
            </Text>
            {tags.length > 0 && (
              <div style={{ marginTop: 4 }}>
                {tags.slice(0, 3).map((tag: string) => (
                  <Tag key={tag} style={{ marginRight: 4 }}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '发布者',
      key: 'author',
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>{record.user?.nickname || '-'}</div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text || status}</Tag>
      ),
    },
    {
      title: '点赞',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 70,
      sorter: (a, b) => a.likeCount - b.likeCount,
    },
    {
      title: '评论',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 70,
      sorter: (a, b) => a.commentCount - b.commentCount,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (t: string) => t ? new Date(t).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleReviewPass(record)}>通过</Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleReviewReject(record)}>驳回</Button>
            </>
          )}
          {record.status !== 3 && (
            <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="内容列表"
        extra={
          <Space>
            <Input
              placeholder="搜索内容标题"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => { setPage(1); loadList(); }}
              allowClear
              onClear={() => { setSearchText(''); setPage(1); }}
            />
            <Select
              placeholder="状态筛选"
              style={{ width: 120 }}
              allowClear
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: '全部', value: undefined },
                { label: '待审核', value: 0 },
                { label: '正常', value: 1 },
                { label: '已驳回', value: 2 },
                { label: '已删除', value: 3 },
              ]}
            />
            <Button type="primary" onClick={() => { setPage(1); loadList(); }}>搜索</Button>
          </Space>
        }
      >
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps || pageSize);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 内容预览 Drawer */}
      <Drawer
        title="内容详情"
        placement="right"
        width={560}
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        loading={detailLoading}
      >
        {currentContent && !detailLoading && (
          <div>
            {(() => {
              const imgs = parseImages(currentContent.images);
              const cover = currentContent.coverImage || imgs[0];
              return cover ? <Image src={cover} width="100%" style={{ borderRadius: 8, marginBottom: 16 }} /> : null;
            })()}
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="标题" span={2}>{currentContent.title}</Descriptions.Item>
              <Descriptions.Item label="作者">{currentContent.user?.nickname || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentContent.status]?.color}>
                  {statusMap[currentContent.status]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="点赞">{currentContent.likeCount}</Descriptions.Item>
              <Descriptions.Item label="评论">{currentContent.commentCount}</Descriptions.Item>
              <Descriptions.Item label="收藏">{currentContent.collectCount}</Descriptions.Item>
              <Descriptions.Item label="浏览">{currentContent.viewCount}</Descriptions.Item>
              <Descriptions.Item label="发布时间" span={2}>
                {currentContent.createdAt ? new Date(currentContent.createdAt).toLocaleString('zh-CN') : '-'}
              </Descriptions.Item>
              {parseTags(currentContent.tags).length > 0 && (
                <Descriptions.Item label="标签" span={2}>
                  {parseTags(currentContent.tags).map((t: string) => <Tag key={t}>{t}</Tag>)}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider />
            <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>{currentContent.content}</Text>
            {currentContent.status === 0 && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button type="primary" icon={<CheckOutlined />} onClick={() => handleReviewPass(currentContent)}>
                  通过审核
                </Button>
                <Button danger icon={<CloseOutlined />} onClick={() => handleReviewReject(currentContent)}>
                  驳回
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ContentListPage;
