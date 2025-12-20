// src/utils/notify.js
import { ElMessage, ElMessageBox } from 'element-plus'

export const notify = {
  success(message) {
    ElMessage({
      type: 'success',
      message,
      duration: 2000
    })
  },

  error(message) {
    ElMessage({
      type: 'error',
      message,
      duration: 3000
    })
  },

  confirm(message, title = '确认') {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  }
}
