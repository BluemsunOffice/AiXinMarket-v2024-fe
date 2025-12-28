// 民族字典常量
export const ETHNICITY_MAP: { [key: number]: string } = {
  0: "汉族",
  1: "蒙古族",
  2: "回族",
  3: "藏族",
  4: "维吾尔族",
  5: "苗族",
  6: "彝族",
  7: "壮族",
  8: "布依族",
  9: "朝鲜族",
  10: "满族",
  11: "侗族",
  12: "瑶族",
  13: "白族",
  14: "土家族",
  15: "哈尼族",
  16: "哈萨克族",
  17: "傣族",
  18: "黎族",
  19: "傈僳族",
  20: "佤族",
  21: "畲族",
  22: "高山族",
  23: "拉祜族",
  24: "水族",
  25: "东乡族",
  26: "纳西族",
  27: "景颇族",
  28: "柯尔克孜族",
  29: "土族",
  30: "达斡尔族",
  31: "仫佬族",
  32: "羌族",
  33: "布朗族",
  34: "撒拉族",
  35: "毛难族",
  36: "仡佬族",
  37: "锡伯族",
  38: "阿昌族",
  39: "普米族",
  40: "塔吉克族",
  41: "怒族",
  42: "乌孜别克族",
  43: "俄罗斯族",
  44: "鄂温克族",
  45: "崩龙族",
  46: "保安族",
  47: "裕固族",
  48: "京族",
  49: "塔塔尔族",
  50: "独龙族",
  51: "鄂伦春族",
  52: "赫哲族",
  53: "门巴族",
  54: "珞巴族",
  55: "基诺族",
} as const;

// 学院字典常量
export const COLLEGE_MAP: { [key: number]: string } = {
  10: "数学与统计学院",
  19: "国际汉学院",
  18: "传媒科学学院",
  17: "体育学院",
  16: "环境学院",
  15: "地理科学学院",
  14: "生命科学学院",
  13: "化学学院",
  12: "物理学院",
  11: "信息科学与技术学院",
  0: "教育学部",
  9: "马克思主义学部",
  8: "美术学院",
  7: "音乐学院",
  6: "外国语学院",
  5: "历史文化学院",
  4: "文学院",
  3: "经济与管理学院",
  2: "政法学院",
  1: "心理学院",
} as const;

// 专业字典常量
export const MAJOR_MAP: { [key: number]: string } = {
  51: "图书馆学",
  61: "生物技术",
  60: "生物科学",
  59: "应用化学",
  58: "化学",
  57: "电气工程及其自动化",
  56: "电子信息科学与技术",
  55: "材料物理",
  54: "物理学",
  53: "智能科学与技术",
  52: "信息资源管理",
  62: "药学",
  50: "软件工程",
  49: "计算机科学与技术",
  48: "教育技术学",
  47: "应用统计学",
  46: "经济统计学",
  45: "数据科学与大数据技术",
  44: "统计学",
  43: "数学与应用数学",
  42: "社会学",
  72: "运动训练",
  81: "汉语言",
  80: "广播电视学",
  79: "数字媒体技术",
  78: "播音与主持艺术",
  77: "广播电视编导",
  76: "广告学",
  75: "新闻学",
  74: "冰雪运动",
  73: "武术与民族传统体育",
  41: "社会工作",
  71: "体育教育",
  70: "环境生态工程",
  69: "环境工程",
  68: "环境科学",
  67: "生态学",
  66: "自然地理与资源环境",
  65: "地理信息科学",
  64: "人文地理与城乡规划",
  63: "地理科学",
  10: "物流管理",
  20: "汉语言文学",
  19: "工商管理",
  18: "财务管理",
  17: "人力资源管理",
  16: "会计学",
  15: "市场营销",
  14: "国际经济与贸易",
  13: "金融学",
  12: "财政学",
  11: "经济学",
  21: "汉语国际教育",
  9: "政治学与行政学",
  8: "行政管理",
  7: "思想政治教育",
  6: "国际政治",
  5: "法学",
  4: "心理学",
  3: "公共事业管理",
  2: "小学教育",
  1: "学前教育",
  31: "舞蹈编导",
  40: "哲学",
  39: "数字媒体艺术",
  38: "表演",
  37: "产品设计",
  36: "服装与服饰设计",
  35: "环境设计",
  34: "视觉传达设计",
  33: "雕塑",
  32: "美术学",
  0: "教育学",
  30: "音乐学",
  29: "德语",
  28: "商务英语",
  27: "日语",
  26: "俄语",
  25: "英语",
  24: "考古学",
  23: "旅游管理",
  22: "历史学",
} as const;

// 学历字典常量
export const DEGREE_MAP: { [key: number]: string } = {
  0: "本科",
  1: "研究生",
} as const;

export const FUNDTYPE_MAP: { [key: number]: string } = {
  0: "国家奖学金",
  1: "国家励志奖学金",
  2: "学校励志奖学金",
  3: "励志学子",
  4: "宝钢奖学金",
  5: "小米奖学金",
  6: "小米特等奖",
  7: "恒兴助学奖学金",
  8: "小米助学金",
  9: "理想与成才",
} as const;

export const PUNISHTYPE_MAP: { [key: number]: string } = {
  0: "警告",
  1: "严重警告",
  2: "记过",
  3: "留校察看",
  4: "开除学籍",
} as const;

export const MARRY_MAP: { [key: number]: string } = {
  0: "未婚",
  1: "已婚",
} as const;

export const ASSISTLEVEL_MAP: { [key: number]: string } = {
  0: "经济关注对象",
  1: "特别资助对象",
  2: "重点资助对象",
  3: "一般资助对象",
  4: "公费师范生",
} as const;

export const STUDENTSTATUS_MAP: { [key: number]: string } = {
  0: "在校",
  1: "肄业",
  2: "离校",
} as const;

export const CAMPUS_MAP: { [key: number]: string } = {
  0: "本部",
  1: "净月"
} as const;

export const GENDER_MAP: { [key: number]: string } = {
  0: "男",
  1: "女",
} as const;

// 政治面貌
export const POLITICALSTATUS_MAP: { [key: number]: string } = {
  0: "共青团员",
  1: "中共党员",
  2: "中共预备党员",
  3: "民革党员",
  4: "民盟盟员",
  5: "民建会员",
  6: "民进会员",
  7: "农工党党员",
  8: "致公党党员",
  9: "九三学社社员",
  10: "台盟盟员",
  11: "无党派人士",
  12: "群众",
} as const;

type keyType = string | number;

// 对应的格式化函数
export const formatEthnicity = (code: keyType): string => ETHNICITY_MAP[+code] || "未知";
export const formatCollege = (collegeCode: keyType): string => COLLEGE_MAP[+collegeCode] || "未知";
export const formatMajor = (majorCode: keyType): string => MAJOR_MAP[+majorCode] || "未知";
export const formatDegree = (code: keyType): string => DEGREE_MAP[+code] || "未知";
export const formatFundType = (code: keyType): string => FUNDTYPE_MAP[+code] || "未知";
export const formatPunishType = (code: keyType): string => PUNISHTYPE_MAP[+code] || "未知";
export const formatMarry = (code: keyType): string => MARRY_MAP[+code] || "未知"
export const formatAssistLevel = (code: keyType): string => ASSISTLEVEL_MAP[+code] || "未知"
export const formatStudentStatus = (code: keyType): string => STUDENTSTATUS_MAP[+code] || "未知"
export const formatCampus = (code: keyType): string => CAMPUS_MAP[+code] || "未知"
export const formatGender = (code: keyType): string => GENDER_MAP[+code] || "未知";
export const formatPoliticalStatus = (code: keyType): string => POLITICALSTATUS_MAP[+code] || "未知";
