import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export const useLang = () => {
  const store = useStore()
  const { locale, t } = useI18n()

  const langList = [
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ]

  const currentLang = computed(() => store.state.lang)

  const elementLocale = computed(() => {
    return currentLang.value === 'zh' ? zhCn : en
  })

  const changeLanguage = (lang: 'zh' | 'en') => {
    store.commit('SET_LANG', lang)
    locale.value = lang
  }

  const i18nContent = <T extends Record<string, any>, K extends keyof T>(obj: T, field: K): string => {
    if (field in obj && currentLang.value === 'zh') {
      const k = `${field.toString()}_zh`
      return k in obj ? obj[k] : obj[field]
    }
    return obj[field] || ''
  }

  return {
    langList,
    currentLang,
    elementLocale,
    changeLanguage,
    i18nContent,
    t
  }
}

export default useLang