export interface SelectOption {
  value: string
  label: string
}

type CodeValue = string | number | null | undefined
type NumberCodeMap = Record<number, string>
type StringCodeMap = Record<string, string>

const normalizeNumberMap = (source: NumberCodeMap): StringCodeMap =>
  Object.keys(source).reduce<StringCodeMap>((acc, key) => {
    acc[key] = source[Number(key)]
    return acc
  }, {})

const makeOptionsFromMap = (map: NumberCodeMap): SelectOption[] =>
  Object.keys(map).map((key) => ({
    value: key,
    label: map[Number(key)],
  }))

export const mapCodeToLabel = (map: StringCodeMap, code?: CodeValue, fallback = '未知'): string => {
  if (code === null || code === undefined || code === '') {
    return fallback
  }
  return map[String(code)] ?? fallback
}

export const createFormatter =
  (map: StringCodeMap, fallback = '未知') =>
  (code: CodeValue): string =>
    mapCodeToLabel(map, code, fallback)

// 民族字典常量
export const ETHNICITY_MAP: NumberCodeMap = {
  0: '汉族',
  1: '蒙古族',
  2: '回族',
  3: '藏族',
  4: '维吾尔族',
  5: '苗族',
  6: '彝族',
  7: '壮族',
  8: '布依族',
  9: '朝鲜族',
  10: '满族',
  11: '侗族',
  12: '瑶族',
  13: '白族',
  14: '土家族',
  15: '哈尼族',
  16: '哈萨克族',
  17: '傣族',
  18: '黎族',
  19: '傈僳族',
  20: '佤族',
  21: '畲族',
  22: '高山族',
  23: '拉祜族',
  24: '水族',
  25: '东乡族',
  26: '纳西族',
  27: '景颇族',
  28: '柯尔克孜族',
  29: '土族',
  30: '达斡尔族',
  31: '仫佬族',
  32: '羌族',
  33: '布朗族',
  34: '撒拉族',
  35: '毛难族',
  36: '仡佬族',
  37: '锡伯族',
  38: '阿昌族',
  39: '普米族',
  40: '塔吉克族',
  41: '怒族',
  42: '乌孜别克族',
  43: '俄罗斯族',
  44: '鄂温克族',
  45: '崩龙族',
  46: '保安族',
  47: '裕固族',
  48: '京族',
  49: '塔塔尔族',
  50: '独龙族',
  51: '鄂伦春族',
  52: '赫哲族',
  53: '门巴族',
  54: '珞巴族',
  55: '基诺族',
} as const

// 学院字典常量
export const COLLEGE_MAP: NumberCodeMap = {
  0: '教育学部',
  1: '心理学院',
  2: '政法学院',
  3: '经济与管理学院',
  4: '文学院',
  5: '历史文化学院',
  6: '外国语学院',
  7: '音乐学院',
  8: '美术学院',
  9: '马克思主义学部',
  10: '数学与统计学院',
  11: '信息科学与技术学院',
  12: '物理学院',
  13: '化学学院',
  14: '生命科学学院',
  15: '地理科学学院',
  16: '环境学院',
  17: '体育学院',
  18: '传媒科学学院',
  19: '国际汉学院',
  99: '未知学院',
} as const

// 专业字典常量
export const MAJOR_MAP: NumberCodeMap = {
  0: '教育学',
  1: '学前教育',
  2: '小学教育',
  3: '公共事业管理',
  4: '心理学',
  5: '法学',
  6: '国际政治',
  7: '思想政治教育',
  8: '行政管理',
  9: '政治学与行政学',
  10: '物流管理',
  11: '经济学',
  12: '财政学',
  13: '金融学',
  14: '国际经济与贸易',
  15: '市场营销',
  16: '会计学',
  17: '人力资源管理',
  18: '财务管理',
  19: '工商管理',
  20: '汉语言文学',
  21: '汉语国际教育',
  22: '历史学',
  23: '旅游管理',
  24: '考古学',
  25: '英语',
  26: '俄语',
  27: '日语',
  28: '商务英语',
  29: '德语',
  30: '音乐学',
  31: '舞蹈编导',
  32: '美术学',
  33: '雕塑',
  34: '视觉传达设计',
  35: '环境设计',
  36: '服装与服饰设计',
  37: '产品设计',
  38: '表演',
  39: '数字媒体艺术',
  40: '哲学',
  41: '社会工作',
  42: '社会学',
  43: '数学与应用数学',
  44: '统计学',
  45: '数据科学与大数据技术',
  46: '经济统计学',
  47: '应用统计学',
  48: '教育技术学',
  49: '计算机科学与技术',
  50: '软件工程',
  51: '图书馆学',
  52: '信息资源管理',
  53: '智能科学与技术',
  54: '物理学',
  55: '材料物理',
  56: '电子信息科学与技术',
  57: '电气工程及其自动化',
  58: '化学',
  59: '应用化学',
  60: '生物科学',
  61: '生物技术',
  62: '药学',
  63: '地理科学',
  64: '人文地理与城乡规划',
  65: '地理信息科学',
  66: '自然地理与资源环境',
  67: '生态学',
  68: '环境科学',
  69: '环境工程',
  70: '环境生态工程',
  71: '体育教育',
  72: '运动训练',
  73: '武术与民族传统体育',
  74: '冰雪运动',
  75: '新闻学',
  76: '广告学',
  77: '广播电视编导',
  78: '播音与主持艺术',
  79: '数字媒体技术',
  80: '广播电视学',
  81: '汉语言',
} as const

// 学历字典常量
export const DEGREE_MAP: NumberCodeMap = {
  0: '本科',
  1: '研究生',
  99: '未知',
} as const

export const FUNDTYPE_MAP: NumberCodeMap = {
  0: '国家奖学金',
  1: '国家励志奖学金',
  2: '学校励志奖学金',
  3: '励志学子',
  4: '宝钢奖学金',
  5: '小米奖学金',
  6: '小米特等奖',
  7: '恒兴助学奖学金',
  8: '小米助学金',
  9: '理想与成才',
} as const

export const PUNISHTYPE_MAP: NumberCodeMap = {
  0: '警告',
  1: '严重警告',
  2: '记过',
  3: '留校察看',
  4: '开除学籍',
} as const

export const MARRY_MAP: NumberCodeMap = {
  0: '未婚',
  1: '已婚',
} as const

export const ASSISTLEVEL_MAP: NumberCodeMap = {
  0: '经济关注对象',
  1: '特别资助对象',
  2: '重点资助对象',
  3: '一般资助对象',
  4: '公费师范生',
} as const

export const STUDENTSTATUS_MAP: NumberCodeMap = {
  0: '在校',
  1: '肄业',
  2: '离校',
  3: '未知',
} as const

export const CAMPUS_MAP: NumberCodeMap = {
  0: '本部',
  1: '净月',
} as const

export const GENDER_MAP: NumberCodeMap = {
  0: '男',
  1: '女',
} as const

// 政治面貌
export const POLITICALSTATUS_MAP: NumberCodeMap = {
  0: '共青团员',
  1: '中共党员',
  2: '中共预备党员',
  3: '民革党员',
  4: '民盟盟员',
  5: '民建会员',
  6: '民进会员',
  7: '农工党党员',
  8: '致公党党员',
  9: '九三学社社员',
  10: '台盟盟员',
  11: '无党派人士',
  12: '群众',
} as const

// 小驼峰映射（兼容新页面）
export const ethnicMap = normalizeNumberMap(ETHNICITY_MAP)
export const collegeMap = normalizeNumberMap(COLLEGE_MAP)
export const majorMap = normalizeNumberMap(MAJOR_MAP)
export const degreeMap = normalizeNumberMap(DEGREE_MAP)
export const fundTypeMap = normalizeNumberMap(FUNDTYPE_MAP)
export const punishTypeMap = normalizeNumberMap(PUNISHTYPE_MAP)
export const marryMap = normalizeNumberMap(MARRY_MAP)
export const assistLevelMap = normalizeNumberMap(ASSISTLEVEL_MAP)
export const statusMap = normalizeNumberMap(STUDENTSTATUS_MAP)
export const campusMap = normalizeNumberMap(CAMPUS_MAP)
export const genderMap = normalizeNumberMap(GENDER_MAP)
export const politicalMap = normalizeNumberMap(POLITICALSTATUS_MAP)

// 统一选项数组（减少重复定义）
export const marryOptions = makeOptionsFromMap(MARRY_MAP)
export const statusOptions = makeOptionsFromMap(STUDENTSTATUS_MAP)
export const degreeOptions = makeOptionsFromMap(DEGREE_MAP)
export const politicalOptions = makeOptionsFromMap(POLITICALSTATUS_MAP)
export const collegeOptions = makeOptionsFromMap(COLLEGE_MAP)
export const majorOptions = makeOptionsFromMap(MAJOR_MAP)

// 历史兼容格式化函数（保留原导出）
export const formatEthnicity = createFormatter(ethnicMap, '未知')
export const formatCollege = createFormatter(collegeMap, '未知')
export const formatMajor = createFormatter(majorMap, '未知')
export const formatDegree = createFormatter(degreeMap, '未知')
export const formatFundType = createFormatter(fundTypeMap, '未知')
export const formatPunishType = createFormatter(punishTypeMap, '未知')
export const formatMarry = createFormatter(marryMap, '未知')
export const formatAssistLevel = createFormatter(assistLevelMap, '未知')
export const formatStudentStatus = createFormatter(statusMap, '未知')
export const formatCampus = createFormatter(campusMap, '未知')
export const formatGender = createFormatter(genderMap, '未知')
export const formatPoliticalStatus = createFormatter(politicalMap, '未知')

// 初始格式化函数（统一入口）
export const initFormatters = () => ({
  ethnicity: formatEthnicity,
  college: formatCollege,
  major: formatMajor,
  degree: formatDegree,
  fundType: formatFundType,
  punishType: formatPunishType,
  marry: formatMarry,
  assistLevel: formatAssistLevel,
  studentStatus: formatStudentStatus,
  campus: formatCampus,
  gender: formatGender,
  politicalStatus: formatPoliticalStatus,
  fromMap: mapCodeToLabel,
})
