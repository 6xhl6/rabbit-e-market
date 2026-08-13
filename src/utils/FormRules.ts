export const ADDRESS_FORM_RULES = {
  // 对name字段进行必填验证
  receiver: {
    // name 字段的校验规则
    rules: [
      {
        required: true,
        errorMessage: '请填写正确的收货人姓名',
      },
      {
        minLength: 3,
        maxLength: 10,
        errorMessage: '收货人姓名长度在 3 到 10 个字符',
      },
    ],
    label: '收货人姓名',
    validateTrigger: 'blur',
  },
  contact: {
    rules: [
      {
        required: true,
        errorMessage: '请填写收货人手机号码',
      },
      {
        pattern: '^1[3456789]\\d{9}$',
        errorMessage: '收货人手机号码格式错误',
      },
    ],
    label: '收货人手机号码',
    validateTrigger: 'blur',
  },
  fullLocation: {
    rules: [
      {
        required: true,
        errorMessage: '请选择所在地区',
      },
    ],
    label: '所在地区',
    validateTrigger: 'blur',
  },
  address: {
    // name 字段的校验规则
    rules: [
      {
        required: true,
        errorMessage: '请填写详细地址',
      },
    ],
    label: '详细地址',
    validateTrigger: 'blur',
  },
}
