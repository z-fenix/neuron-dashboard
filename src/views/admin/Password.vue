<template>
  <el-card class="about">
    <div class="card-hd-with-btn">
      <h3 class="card-title">{{ $t('common.changePassword') }}</h3>
    </div>
    <el-form ref="formRef" label-position="top" :model="formData" :rules="rules" class="pw-form" @submit.prevent>
      <el-form-item prop="oldPass" :label="$t('common.oldPassword')" required>
        <el-input
          v-model.trim="formData.oldPass"
          type="password"
          show-password
          :placeholder="$t('common.oldPassword')"
        />
      </el-form-item>
      <el-form-item prop="newPass" :label="$t('common.newPassword')" required>
        <el-input
          v-model.trim="formData.newPass"
          type="password"
          show-password
          :placeholder="$t('common.newPassword')"
        />
      </el-form-item>
      <el-form-item prop="newPassConfirm" :label="$t('common.confirmPassword')" required>
        <el-input
          v-model.trim="formData.newPassConfirm"
          type="password"
          show-password
          :placeholder="$t('common.newPassword')"
        />
      </el-form-item>
    </el-form>

    <footer class="change-psw-footer">
      <el-button type="primary" size="small" @click="submit" :loading="isSubmitting">
        {{ $t('common.submit') }}
      </el-button>
    </footer>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { changePassword } from '@/api/common'
import { ElMessage } from 'element-plus'
import { createCommonErrorMessage } from '@/utils/utils'
import { useStore } from 'vuex'

const { t } = useI18n()
const store = useStore()

const formRef = ref()
const formState = reactive({
  formData: {
    name: 'admin',
    oldPass: '',
    newPass: '',
    newPassConfirm: '',
  },
  isSubmitting: false,
})
const { formData, isSubmitting } = toRefs(formState)

const isNewPassMatch = computed(() => {
  return formState.formData.newPass === formState.formData.newPassConfirm
})

const checkNewPassMatch = (rule: any, value: string, callback: any) => {
  const { newPassConfirm } = formState.formData

  if (!newPassConfirm || (newPassConfirm && isNewPassMatch.value)) {
    if (newPassConfirm) {
      const { form } = formRef.value
      form.validateField(['newPassConfirm'])
    }
    callback()
  } else {
    callback(new Error(`${t('common.newPassNotMatch')}`))
  }
}

const checkNewPassConfirmMatch = (rule: any, value: string, callback: any) => {
  const { form } = formRef.value
  if (isNewPassMatch.value) {
    form.validateField(['newPass'])
    callback()
  } else {
    callback(new Error(`${t('common.newPassNotMatch')}`))
  }
}

const rules = computed(() => {
  return {
    oldPass: [
      {
        required: true,
        message: createCommonErrorMessage('input', t('common.oldPassword')),
      },
    ],
    newPass: [
      {
        required: true,
        message: createCommonErrorMessage('input', t('common.newPassword')),
      },
      {
        validator: checkNewPassMatch,
        trigger: 'blur',
      },
    ],
    newPassConfirm: [
      {
        required: true,
        message: t('common.newPassConfirmRequired'),
      },
      {
        validator: checkNewPassConfirmMatch,
        trigger: 'blur',
      },
    ],
  }
})

watch(
  () => store.state.lang,
  () => {
    nextTick(() => {
      const keys = Object.keys(formState.formData) as (keyof typeof formState.formData)[]
      keys.forEach((key) => {
        const value = formState.formData[key]
        if (!value) {
          formRef.value.form?.clearValidate()
        } else {
          formRef.value.form?.validateField(key)
        }
      })
    })
  },
)

const changeUserPassword = async () => {
  try {
    isSubmitting.value = true
    const { name, oldPass: old_pass, newPass: new_pass } = formState.formData
    await changePassword({ name, old_pass, new_pass })
    ElMessage.success(t('common.changePwSuccessful'))
    formRef.value?.resetFields()
  } catch (error) {
    console.log(error)
  } finally {
    isSubmitting.value = false
  }
}

const submit = () => {
  formRef.value?.validate().then((valid:any) => {
    if (valid) {
      changeUserPassword()
    }
  })
}
</script>

<style lang="scss" scoped>
.pw-form {
  width: 50%;
  min-width: 500px;
}
</style>
