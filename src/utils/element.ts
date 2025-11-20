import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

export const MessageBoxConfirm = (
  content?: string,
  title?: string,
  type: 'success' | 'warning' | 'info' | 'error' = 'warning',
): Promise<any> => {
  const { t } = i18n.global as any

  const finalContent = content || t('common.confirmDelete')
  const finalTitle = title || t('common.operateConfirm')
  const finalConfirmText = t('common.confirmButtonText')
  const finalCancelText = t('common.cancelButtonText')

  return ElMessageBox.confirm(finalContent, finalTitle, {
    confirmButtonText: finalConfirmText,
    cancelButtonText: finalCancelText,
    type,
  }) as Promise<any>
}