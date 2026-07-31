<template>
<div class="page-login-style">
  <div class="login-main" v-if="state.loading">
    <el-header>
      <h3>{{state.sysData.sys_name || '网络交易智慧监管平台'}}</h3>
    </el-header>
    <div class="login-form">
      <div class="form-card">
        <h2>用户登陆</h2>
        <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" label-width="0" class="login-ruleForm">
          <el-form-item prop="mobile">
            <el-input :prefix-icon="PhoneFilled" type="text" v-model="ruleForm.mobile" placeholder="请输入手机号" maxlength="11" show-word-limit></el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="state.showType === 1">
            <div class="ruleForm_code">
              <div class="ruleForm_code_input">
                <el-input :prefix-icon="SwitchFilled" type="text" v-model="ruleForm.code" placeholder="请输入验证码" maxlength="4"></el-input>
              </div>
              <div class="ruleForm_code_button">
                <el-button type="primary" @click="getCode(state.count)" :plain="state.count !== '获取验证码'">{{ state.count === '获取验证码' ? state.count : state.count + 's' }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="password" v-if="state.showType === 2">
            <el-input :type="state.showPassword ? 'text' : 'password'" :prefix-icon="Unlock" v-model="ruleForm.password" maxlength="16" oninput="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" placeholder="请输入密码">
              <template #suffix>
                <el-icon @click="togglePassword" v-show="!state.showPassword"><View /></el-icon>
                <el-icon @click="togglePassword" v-show="state.showPassword"><Hide /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <p class="loginTypeStyle"><span tabindex="0" @click="loginType"  @keydown.space="loginType">{{ state.showType === 1 ? '使用账号密码登陆！' : '短信验证码登陆！' }}</span></p>
          <el-form-item class="loginBtn">
            <el-button type="primary" @click="submitForm(ruleFormRef)" @keyup.enter="submitForm(ruleFormRef)"> 登 录 </el-button>
          </el-form-item>
          <p class="sulgloginStyle" v-if="state.showWay" @click="roleClick">
            <span>————————</span>  管理员登陆  <span>————————</span>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { submitItem } from '@/api/index.js'
import { setsystem, login } from '@/api/setting.js'
import { getlocation, parseEnvArray } from '@/utils/tools.js'
import { PhoneFilled, SwitchFilled, Unlock } from '@element-plus/icons-vue'
import { ElLoading, ElMessage } from 'element-plus'
import { useSystemStore } from "@/store/system.js";
import { useRouter } from "vue-router";
import { getRules } from '@/utils/validate/validateForm.js'

const loginRules = getRules(['mobile', 'code', 'password'])

const LOGIN_MSG = {
  loading: '正在加载，请稍候...',
  sysFail: '系统信息加载失败，请刷新页面重试',
  captchaSent: '验证码已发送，请注意查收',
  loginFail: '登录失败，请检查账号信息',
}

const showMessage = (message, type = 'warning') => {
  ElMessage({ message: message || '操作失败，请稍后重试', type })
}

const router = useRouter()
const ruleFormRef = ref(null)
const ruleForm = ref({})
const rules = ref(loginRules)

const state = reactive({
  loading: false,
  showType: 1,
  showCode: false,
  showWay: false,
  showPassword: false,
  count: '获取验证码',
  sysData: {
    sys_name: '',
    sys_sub: '市场监督管理局',
    license: '',
    domain_name: ''
  }
})

const togglePassword = () => {
  state.showPassword = !state.showPassword
}

onMounted(() => {
  store.clearInfo()
  state.showWay = parseEnvArray(import.meta.env.VITE_SYSTEM_TYPE)[0] === 5 ? true : false
  const loading = ElLoading.service({
    lock: true,
    text: LOGIN_MSG.loading,
    background: 'rgba(0, 0, 0, .8)',
  })
  const domain_name = getlocation()
  submitItem('/v1/sys', 'post', { domain_name: domain_name.host }).then(response => {
    if (response.code === 200) {
      state.loading = true
      const res = response
      state.sysData = {
        sys_name: response.sys_name || '网络交易智慧监管平台',
        sys_sub: response.foot || '市场监督管理局',
        license: response.license,
        domain_name: response.domain_name
      }
      store.setSysInfo(state.sysData)
    } else {
      showMessage(response.msg || LOGIN_MSG.sysFail, 'error')
    }
  }).catch(() => {
    showMessage(LOGIN_MSG.sysFail, 'error')
  }).finally(() => {
    loading.close()
  })
  const env = import.meta.env
  if (env.MODE === 'development') {
    ruleForm.value = { mobile: env.VITE_MOBILE, code: env.VITE_CODE, password: env.VITE_PASSWORD, login_type: 1, domain_name: getlocation().hostname }
  }

  const handleGlobalEnter = (e) => {
    const target = e.target
    const tagName = target.tagName.toLowerCase()
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'

    if (e.key === 'Enter') {
      if (!isInput || (target.type === 'button' || target.type === 'submit')) {
        e.preventDefault()
        e.stopPropagation()
        if (ruleFormRef.value) {
          submitForm(ruleFormRef.value)
        }
      }
    }

    if (e.key === 'Tab') {
      loginType()
    }
  }

  document.addEventListener('keydown', handleGlobalEnter)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalEnter)
  })
})
let timer = ref(null)
const getCode = async () => {
  await ruleFormRef.value.validateField('mobile', response => {
    if (response) {
      submitItem('/v1/captcha/send', 'post', { mobile: ruleForm.value.mobile, type: 2 }).then(response => {
        if (response.code === 200) {
          showMessage(response.msg || LOGIN_MSG.captchaSent, 'success')
          const TIME_COUNT = 60
          if (!timer.value) {
            state.count = TIME_COUNT
            timer.value = setInterval(() => {
              if (state.count > 0 && state.count <= TIME_COUNT) {
                state.count--
              } else {
                state.count = '获取验证码'
                clearInterval(timer.value)
                timer.value = null
              }
            }, 1000)
          }
        } else {
          showMessage(response.msg, 'warning')
        }
      })
    }
  })
}
const store = useSystemStore()
const goUrl = import.meta.env.VITE_INDEX_URL || '/index'
const submitForm = async (ruleFormRef) => {
  await ruleFormRef.validate((valid) => {
    if (valid) {
      login(ruleForm.value).then(response => {
        if (response.code === 200) {
          let data = { system_url: '/maindata', system_id: 1, system_name: state.sys_name, sys_name: state.sys_name, sys_sub: state.sys_sub, license: state.license, domain_name: state.domain_name }
          if (response.data.slug_list_all && response.data.slug_list_all.length > 0) {
            data = { system_url: response.data.slug_list_all[0].url, system_id: response.data.slug_list_all[0].id, system_name: response.data.slug_list_all[0].name, sys_name: state.sys_name, sys_sub: state.sys_sub, license: state.license, domain_name: state.domain_name }
          }
          const param = Object.assign({}, response.data, data)
          store.setUserInfo(param)
          setsystem(param.system_id)
          router.push({ path: goUrl })
        } else {
          showMessage(response.msg || LOGIN_MSG.loginFail, 'warning')
        }
      })
    }
  })
}

const loginType = () => {
  state.showType = state.showType === 1 ? 2 : 1
  ruleForm.value.login_type = state.showType
  ruleForm.value.code = ''
  ruleForm.value.password = ''
  state.count = '获取验证码'
  clearInterval(timer.value)
  timer.value = null
}

const roleClick = () => {

}

</script>

<style scoped lang="scss">
$primary-color: #03a9f4;
$text-color: #5f5f5f;
$input-height: 48px;

@keyframes shimmer {
  0%, 100% {
    background-position: -200% center;
    text-shadow: 0 0 10px rgba($primary-color, 0.5);
  }
  50% {
    background-position: 200% center;
    text-shadow: 0 0 20px rgba($primary-color, 0.8), 0 0 30px rgba($primary-color, 0.5);
  }
}

@mixin gradient-text {
  background: linear-gradient(90deg, #f5f5f5, $primary-color, #f5f5f5);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-login-style {
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;

  .login-main {
    background: url("../../assets/png/login_bg.png") top center no-repeat fixed;
    background-size: cover;
    text-align: center;
    min-height: 100vh;

    .el-header {
      height: 110px;
      width: 100%;
      position: relative;
      top: 20vh;

      h3 {
        font-size: 64px;
        font-weight: 500;
        letter-spacing: 5px;
        white-space: nowrap;
        @include gradient-text;
        animation: shimmer 20s linear infinite;
      }

      img {
        height: 60px;
        vertical-align: middle;
      }
    }

    .login-form {
      width: 600px;
      min-height: 450px;
      border-radius: 16px 16px 8px 8px;
      margin: 26vh auto 0;
      background: #fff;
      position: relative;

      .form-card {
        width: 400px;
        margin: 0 auto;
        padding: 10px 0 60px;

        h2 {
          height: 33px;
          font-size: 34px;
          color: $text-color;
          line-height: 33px;
          margin: 70px 0 50px;
        }
      }
    }
  }
}

.loginTypeStyle,
.sulgloginStyle {
  span {
    font-size: 15px;
    cursor: pointer;
  }
}

.loginTypeStyle {
  text-align: right;

  span {
    color: $mainPrimary;
  }
}

.sulgloginStyle {
  text-align: center;
  color: $blue-color;

  span {
    color: $blue-color;
  }

  &:hover {
    color: $mainPrimary;
  }
}

.login-ruleForm {
  margin-top: 5%;

  .loginBtn {
    width: 100%;
    margin: 20px 0;

    button {
      width: 100%;
    }
  }

  .ruleForm_code {
    display: flex;
    flex-wrap: nowrap;

    .ruleForm_code_input {
      flex: 1;
    }

    .ruleForm_code_button {
      width: 140px;
      text-align: right;
      margin-left: 10px;
    }
  }
}

:deep(.login-ruleForm) {
  .el-form-item {
    margin-bottom: 30px;

    .el-form-item__error {
      padding-top: 6px;
      font-size: 14px;
    }
  }

  .el-input--prefix {
    height: $input-height;
    line-height: $input-height;
    font-size: 18px;
  }

  .el-input__count-inner { font-size: 16px; }
  .el-input__icon { font-size: 20px; }

  .el-input__suffix {
    .password-toggle {
      width: 20px;
      height: 20px;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  }

  .el-button {
    height: $input-height;
    line-height: $input-height;
    width: 100%;
    font-size: 16px;

    &.loginBtn-el {
      font-size: 18px;
    }
  }
}
</style>
