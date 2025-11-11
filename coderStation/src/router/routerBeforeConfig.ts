const routerBeforeConfig = [
    {
        path: '/',
        isNeedLogin: false
    },
    {
        path: '/issues',
        isNeedLogin: false
    },
    {
        path: '/issue/detail/:id',
        isNeedLogin: false
    },
    {
        path: '/books',
        isNeedLogin: false
    },
    {
        path: '/books/detail/:id',
        isNeedLogin: false
    },
    {
        path: '/search',
        isNeedLogin: false
    },
    {
        path: '/interviews',
        isNeedLogin: false
    },
    {
        path: '/addIssue',
        isNeedLogin: true
    },
    {
        path: '/personal',
        isNeedLogin: true
    }

]
export default routerBeforeConfig