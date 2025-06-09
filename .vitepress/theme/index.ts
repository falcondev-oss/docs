import DefaultTheme from 'vitepress/theme'
import './custom.css'
import 'virtual:group-icons.css'
import CustomLayout from './CustomLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
}
