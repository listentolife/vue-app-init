/** When your routing table is too long, you can split it into small modules**/

const homeRouter = [{
  path: '/others',
  name: 'others',
  meta: {
    title: 'others'
  },
  component: () => import('@/views/home/index')
}]

export default homeRouter