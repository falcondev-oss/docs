import DefaultTheme from 'vitepress/theme'
import 'virtual:group-icons.css'
import CustomLayout from './CustomLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
}
