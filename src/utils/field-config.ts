export interface FieldConfigType {
  prop: keyof any;
  label: string;
  formatter?: null | ((value: any) => string);
  icon?: string;
}

// 获取显示值
export const getFieldDisplayValue = (config: FieldConfigType, data: any) => {
  const value = data[config.prop];
  if (config.formatter) {
    return config.formatter(value);
  }
  return value || "-";
};
