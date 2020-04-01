/** When your routing table is too long, you can split it into small modules**/

const homeRouter = [{
  path: '/home',
  name: 'home',
  meta: {
    title: '主页'
  },
  component: () => import('@/views/home/index')
}]

export default homeRouter