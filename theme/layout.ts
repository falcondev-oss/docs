import DefaultTheme from 'vitepress/theme'
import CustomLayout from './CustomLayout.vue'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
}
