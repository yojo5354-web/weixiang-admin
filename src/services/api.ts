import request from '@/utils/request';

// 管理员登录
export const adminLogin = (data: { username: string; password: string }) => {
  return request.post('/api/admin/login', data);
};

// 获取管理员信息
export const getAdminInfo = () => {
  return request.get('/api/admin/info');
};

// 获取统计数据
export const getDashboardStats = () => {
  return request.get('/api/admin/stats/dashboard');
};

// 内容相关
export const getContentList = (params: any) => {
  return request.get('/api/admin/content/list', { params });
};

export const getContentDetail = (id: string) => {
  return request.get(`/api/admin/content/${id}`);
};

export const auditContent = (id: string, data: { status: string; reason?: string }) => {
  return request.post(`/api/admin/content/${id}/audit`, data);
};

export const deleteContent = (id: string) => {
  return request.post(`/api/admin/content/${id}/delete`);
};

// 举报相关
export const getReportList = (params: any) => {
  return request.get('/api/admin/report/list', { params });
};

export const handleReport = (id: string, data: { result: string; note?: string }) => {
  return request.post(`/api/admin/report/${id}/handle`, data);
};

// 标签相关
export const getTagList = (params?: any) => {
  return request.get('/api/admin/tag/list', { params });
};

export const createTag = (data: any) => {
  return request.post('/api/admin/tag/create', data);
};

export const updateTag = (id: string, data: any) => {
  return request.post(`/api/admin/tag/${id}/update`, data);
};

export const deleteTag = (id: string) => {
  return request.post(`/api/admin/tag/${id}/delete`);
};

// 用户相关
export const getUserList = (params: any) => {
  return request.get('/api/admin/user/list', { params });
};

export const getUserDetail = (id: string) => {
  return request.get(`/api/admin/user/${id}`);
};

export const updateUserStatus = (id: string, data: { status: string }) => {
  return request.post(`/api/admin/user/${id}/status`, data);
};

// 订单相关
export const getOrderList = (params: any) => {
  return request.get('/api/admin/order/list', { params });
};

export const getOrderDetail = (id: string) => {
  return request.get(`/api/admin/order/${id}`);
};

// 广告相关
export const getAdList = (params: any) => {
  return request.get('/api/admin/ad/list', { params });
};

export const createAd = (data: any) => {
  return request.post('/api/admin/ad/create', data);
};

export const updateAd = (id: string, data: any) => {
  return request.post(`/api/admin/ad/${id}/update`, data);
};

export const deleteAd = (id: string) => {
  return request.post(`/api/admin/ad/${id}/delete`);
};

// Banner相关
export const getBannerList = (params?: any) => {
  return request.get('/api/admin/banner/list', { params });
};

export const createBanner = (data: any) => {
  return request.post('/api/admin/banner/create', data);
};

export const updateBanner = (id: string, data: any) => {
  return request.post(`/api/admin/banner/${id}/update`, data);
};

export const deleteBanner = (id: string) => {
  return request.post(`/api/admin/banner/${id}/delete`);
};

// 话题相关
export const getTopicList = (params?: any) => {
  return request.get('/api/admin/topic/list', { params });
};

export const createTopic = (data: any) => {
  return request.post('/api/admin/topic/create', data);
};

export const updateTopic = (id: string, data: any) => {
  return request.post(`/api/admin/topic/${id}/update`, data);
};

// 敏感词相关
export const getKeywordList = (params?: any) => {
  return request.get('/api/admin/keyword/list', { params });
};

export const createKeyword = (data: any) => {
  return request.post('/api/admin/keyword/create', data);
};

export const deleteKeyword = (id: string) => {
  return request.post(`/api/admin/keyword/${id}/delete`);
};

// AI统计
export const getAiStats = () => {
  return request.get('/api/admin/ai/stats');
};

// 结算相关
export const getSettlementList = (params: any) => {
  return request.get('/api/admin/settlement/list', { params });
};

export const handleSettlement = (id: string, data: { status: string }) => {
  return request.post(`/api/admin/settlement/${id}/handle`, data);
};
