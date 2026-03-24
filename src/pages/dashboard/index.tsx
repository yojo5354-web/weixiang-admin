import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, List, Avatar, Typography, Progress, Spin } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getDashboardStats, getContentList, getReportList } from '@/services/api';
import styles from './index.less';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [pendingContents, setPendingContents] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, contentsRes, reportsRes]: any[] = await Promise.allSettled([
        getDashboardStats(),
        getContentList({ page: 1, limit: 5, status: 0 }),
        getReportList({ page: 1, limit: 5, status: 'pending' })
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.code === 'SUCCESS') {
        setStats(statsRes.value.data);
      }
      if (contentsRes.status === 'fulfilled' && contentsRes.value?.code === 'SUCCESS') {
        setPendingContents(contentsRes.value.data.list || []);
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value?.code === 'SUCCESS') {
        setPendingReports(reportsRes.value.data.list || []);
      }
    } catch (err) {
      // 静默处理
    } finally {
      setLoading(false);
    }
  };

  const contentColumns: ColumnsType<any> = [
    {
      title: '内容标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (t: string) => <Text>{t}</Text>,
    },
    {
      title: '作者',
      key: 'author',
      width: 120,
      render: (_, r) => r.user?.nickname || '-',
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'time',
      width: 130,
      render: (t: string) => {
        if (!t) return '-';
        const d = new Date(t);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
        if (diff < 60) return `${diff}分钟前`;
        if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
        return `${Math.floor(diff / 1440)}天前`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 0 ? 'orange' : 'green'}>
          {status === 0 ? '待审核' : '已发布'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
        <Spin size="large" tip="加载数据中..." />
      </div>
    );
  }

  const overview = stats?.overview || {};

  return (
    <div className={styles.dashboard}>
      <Title level={4}>数据概览</Title>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="注册用户总数"
              value={overview.totalUsers ?? 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增用户"
              value={overview.todayNewUsers ?? 0}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="内容总数"
              value={overview.totalContents ?? 0}
              prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增内容"
              value={overview.todayNewContents ?? 0}
              prefix={<FileTextOutlined style={{ color: '#fa8c16' }} />}
              suffix="篇"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核内容"
              value={overview.pendingAudit ?? 0}
              prefix={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
              suffix="条"
              valueStyle={{ color: overview.pendingAudit > 0 ? '#f5222d' : undefined }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={overview.totalOrders ?? 0}
              prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理举报"
              value={pendingReports.filter(r => r.status === 'pending').length}
              prefix={<WarningOutlined style={{ color: '#f5222d' }} />}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月 GMV"
              value={0}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              precision={0}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 待审核内容 */}
        <Col span={12}>
          <Card
            title={`待审核内容（${overview.pendingAudit ?? 0}条）`}
            extra={<a href="/content/review">查看全部</a>}
          >
            {pendingContents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>暂无待审核内容 🎉</div>
            ) : (
              <Table
                dataSource={pendingContents}
                columns={contentColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>

        {/* 待处理举报 */}
        <Col span={12}>
          <Card
            title="待处理举报"
            extra={<a href="/content/report">查看全部</a>}
          >
            {pendingReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>暂无待处理举报 🎉</div>
            ) : (
              <List
                dataSource={pendingReports}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#ff6b35' }}>{item.reason?.slice(0, 1) || '举'}</Avatar>}
                      title={<span>{item.reason || '未知原因'}</span>}
                      description={
                        <span>
                          举报人: {item.reporterName || '匿名'} ·{' '}
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN') : ''}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 7天趋势 */}
      {stats?.trend && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="近7天趋势">
              <Row gutter={16}>
                {stats.trend.days?.map((day: string, i: number) => (
                  <Col span={3} key={day} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{day}</div>
                    <div style={{ fontWeight: 600, color: '#1890ff' }}>
                      用户 +{stats.trend.users?.[i] ?? 0}
                    </div>
                    <div style={{ fontWeight: 600, color: '#722ed1' }}>
                      内容 +{stats.trend.contents?.[i] ?? 0}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* AI 服务统计 Mock */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="AI服务调用统计（演示数据）">
            <Row gutter={16}>
              {[
                { name: '食谱生成', calls: 12568, successRate: 99.2 },
                { name: '封面图生成', calls: 4563, successRate: 97.8 },
                { name: '食物识别', calls: 23456, successRate: 98.5 },
                { name: '智能标签', calls: 34567, successRate: 99.8 },
              ].map((item) => (
                <Col span={6} key={item.name}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={5}>{item.name}</Title>
                    <Statistic value={item.calls} suffix="次" />
                    <Progress
                      percent={item.successRate}
                      status="active"
                      strokeColor="#52c41a"
                      format={(p) => `${p}%成功率`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
