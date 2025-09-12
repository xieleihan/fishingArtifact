// 导入React
import { lazy, Suspense } from 'react';

// 导入Antd组件
import { Spin } from 'antd';

const App = lazy(() => import('../App')) // 主视图
const DevicePages = lazy(() => import('../pages/DevicePages')) // 设备页面
const AboutPages = lazy(() => import('../pages/AboutPages')) // 关于页面

const routes = [
    {
        path: '/',
        element: (
            <Suspense fallback={<Spin size="large" />}>
                <App />
            </Suspense>
        ),
        children: [
            {
                path: 'device',
                element: (
                    <Suspense fallback={<Spin size="large" />}>
                        <DevicePages />
                    </Suspense>
                )
            },
            {
                path: 'about',
                element: (
                    <Suspense fallback={<Spin size="large" />}>
                        <AboutPages />
                    </Suspense>
                )
            }
        ]
    }
]

// 导出路由表
export default routes;