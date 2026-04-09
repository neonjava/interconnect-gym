import api from './api';

// AUTH
export const authService = {
    me: () => api.get('/auth/me'),
};

// ADMIN
export const adminService = {
    getDashboard: () => api.get('/admin/dashboard'),
    getMembers: (params) => api.get('/admin/members', { params }),
    getMemberById: (id) => api.get(`/admin/members/${id}`),
    createMember: (data) => api.post('/admin/members', data),
    updateMember: (id, data) => api.put(`/admin/members/${id}`, data),
    deleteMember: (id) => api.delete(`/admin/members/${id}`),
    getTrainers: () => api.get('/admin/trainers'),
    createTrainer: (data) => api.post('/admin/trainers', data),
    getMemberships: () => api.get('/admin/memberships'),
    createMembership: (data) => api.post('/admin/memberships', data),
    updateMembership: (id, data) => api.put(`/admin/memberships/${id}`, data),
    deleteMembership: (id) => api.delete(`/admin/memberships/${id}`),
    getSubscriptions: (params) => api.get('/admin/subscriptions', { params }),
    updateSubscription: (id, data) => api.put(`/admin/subscriptions/${id}`, data),
    getPayments: (params) => api.get('/admin/payments', { params }),
    createPayment: (data) => api.post('/admin/payments', data),
    getRevenueAnalytics: () => api.get('/admin/analytics/revenue'),
    getMemberAnalytics: () => api.get('/admin/analytics/members'),
    getAttendanceAnalytics: () => api.get('/admin/analytics/attendance'),
    broadcastNotification: (data) => api.post('/admin/notifications/broadcast', data),
};

// TRAINER
export const trainerService = {
    getMyMembers: () => api.get('/trainer/my-members'),
    getMemberDetail: (id) => api.get(`/trainer/members/${id}`),
    getWorkoutPlans: () => api.get('/trainer/workout-plans'),
    createWorkoutPlan: (data) => api.post('/trainer/workout-plans', data),
    updateWorkoutPlan: (id, data) => api.put(`/trainer/workout-plans/${id}`, data),
    deleteWorkoutPlan: (id) => api.delete(`/trainer/workout-plans/${id}`),
    getDietPlans: () => api.get('/trainer/diet-plans'),
    createDietPlan: (data) => api.post('/trainer/diet-plans', data),
    updateDietPlan: (id, data) => api.put(`/trainer/diet-plans/${id}`, data),
    markAttendance: (data) => api.post('/trainer/attendance/mark', data),
    getMemberAttendance: (memberId, params) => api.get(`/trainer/attendance/${memberId}`, { params }),
    getMemberProgress: (memberId) => api.get(`/trainer/progress/${memberId}`),
};

// MEMBER
export const memberService = {
    getDashboard: () => api.get('/member/dashboard'),
    getSubscription: () => api.get('/member/subscription'),
    getPayments: () => api.get('/member/payments'),
    getWorkoutPlan: () => api.get('/member/workout-plan'),
    getDietPlan: () => api.get('/member/diet-plan'),
    checkIn: () => api.post('/member/attendance/checkin'),
    getAttendance: (params) => api.get('/member/attendance', { params }),
    getProgress: () => api.get('/member/progress'),
    addProgress: (data) => api.post('/member/progress', data),
    updateProfile: (data) => api.put('/member/profile', data),
    getNotifications: () => api.get('/member/notifications'),
    markNotificationRead: (id) => api.put(`/member/notifications/${id}/read`),
};
