import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Avatar, Modal, message } from 'antd';
import { EyeOutlined, SearchOutlined, StopOutlined, UnlockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'umi';
import { getUserList, updateUserStatus } from '@/services/api';
import styles from './list.less';

// 账号状态：1=正常 2=禁言 3=封号
const statusMap: Record<number, { color: string; label: string }> = {
  1: { color: 'green', label: '正常' },
  2: { color: 'orange', label: '禁言' },
  3: { color: 'red', label: '已封号' },
};

const UserListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const navigate = useNavigate();

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getUserList({
        page,
        limit: pageSize,
        keyword: searchText || undefined,
        status: statusFilter
      });
      if (res.code === 'SUCCESS') {
        setList(res.data.list || []);
        setTotal(res.data.total || 0);
      }
    } catch (err: any) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, statusFilter]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleBan = (record: any) => {
    Modal.confirm({
      title: '确认封禁该用户?',
      content: `封禁后 ${record.nickname} 将无法正常使用平台功能`,
      okText: '确认封禁',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await updateUserStatus(record.id, { status: 'ban' });
          message.success('已封禁该用户');
          loadList();
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleMute = (record: any) => {
    Modal.confirm({
      title: '确认禁言该用户?',
      content: `禁言后 ${record.nickname} 将无法发布内容和评论`,
      okText: '确认禁言',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await updateUserStatus(record.id, { status: 'mute' });
          message.success('已禁言该用户');
          loadList();
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const handleUnban = (record: any) => {
    Modal.confirm({
      title: '确认恢复正常?',
      content: `恢复后 ${record.nickname} 将可正常使用平台`,
      okText: '确认',
      onOk: async () => {
        try {
          await updateUserStatus(record.id, { status: 'normal' });
          message.success('已恢复正常');
          loadList();
        } catch {
          message.error('操作失败');
        }
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户信息',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            src={record.avatar}
            style={{ backgroundColor: '#ff6b35' }}
          >
            {!record.avatar && record.nickname?.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.nickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.phone ? record.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : 'ID: ' + record.id.slice(0, 8)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.label || '未知'}
        </Tag>
      ),
    },
    {
      title: 'VIP',
      dataIndex: 'isVip',
      key: 'isVip',
      width: 70,
      render: (isVip: boolean) => isVip ? <Tag color="gold">VIP</Tag> : '-',
    },
    {
      title: '发布数',
      key: 'postCount',
      width: 80,
      render: (_, r) => r.postCount ?? r._count?.contents ?? 0,
      sorter: (a, b) => (a.postCount ?? 0) - (b.postCount ?? 0),
    },
    {
      title: '粉丝数',
      key: 'followerCount',
      width: 80,
      render: (_, r) => (r.followerCount ?? r._count?.followers ?? 0).toLocaleString(),
      sorter: (a, b) => (a.followerCount ?? 0) - (b.followerCount ?? 0),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (t: string) => t ? new Date(t).toLocaleDateString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/user/detail/${record.id}`)}
          >
            详情
          </Button>
          {record.status !== 1 ? (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => handleUnban(record)}
            >
              恢复
            </Button>
          ) : (
            <>
              <Button
                type="link"
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => handleMute(record)}
              >
                禁言
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => handleBan(record)}
              >
                封号
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card
        title="用户列表"
        extra={
          <Space>
            <Input
              placeholder="搜索昵称/手机号"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => { setPage(1); loadList(); }}
              allowClear
              onClear={() => { setSearchText(''); setPage(1); }}
            />
            <Select
              placeholder="账号状态"
              style={{ width: 120 }}
              allowClear
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { label: '全部', value: undefined },
                { label: '正常', value: 1 },
                { label: '禁言', value: 2 },
                { label: '封号', value: 3 },
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
            showTotal: (t) => `共 ${t.toLocaleString()} 位用户`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps || pageSize);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default UserListPage;
