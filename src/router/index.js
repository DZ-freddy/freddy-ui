import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SearchSelectTree from '@/index/SearchSelectTree'

Vue.use(Router)

export default new Router({
  routes: [
      {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
      },
      {
          path: '/components/searchSelectTree',
          name: 'searchSelectTree',
          component: SearchSelectTree
      }
  ]
})
