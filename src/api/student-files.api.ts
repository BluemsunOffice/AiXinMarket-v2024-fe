import request from '@/api/request'

export interface StudentListParams {
  pageNum: number
  pageSize: number
  [key: string]: any
}

export interface StudentDetailData {
  fundUserInfoVo: Record<string, any>
  fundProjectVo: any[]
  fundScholarshipVo: any[]
  fundPunishVo: any[]
}

export const studentFilesApi = {
  getStudentList: (params: StudentListParams) => request.get('/grow/userInfo/listAll', { params }),

  getStudentDetail: (userId: string) =>
    request.get('/grow/userInfo/detail', { params: { userId } }),

  exportStudentInfo: (userId: string) =>
    request.get('/grow/userOwnInfo/exportAll', {
      params: { userId },
      responseType: 'blob',
    }),

  exportSelectedStudentInfo: (userIds: string[]) =>
    request.post(
      '/grow/userOwnInfo/exportOne',
      { userId: userIds },
      {
        responseType: 'blob',
      },
    ),
}
