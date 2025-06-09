import DefaultTheme from 'vitepress/theme'
import CustomLayout from '../../../../.vitepress/theme/CustomLayout.vue'
import './custom.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
}
