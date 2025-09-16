// 导入React
import { lazy, Suspense } from 'react';

// 导入Antd组件
import { Spin } from 'antd';

// 导入Navigate组件
import { Navigate } from 'react-router-dom';

const App = lazy(() => import('../App')) // 主视图
const DevicePages = lazy(() => import('../pages/DevicePages')) // 设备页面
const TerminalPages = lazy(() => import('../pages/TerminalPages')) // 终端页面
const AboutPages = lazy(() => import('../pages/AboutPages')) // 关于页面
const UploadfilePages = lazy(() => import('../pages/UploadfilePages')) // 上传页面
const XmlLayoutPages = lazy(() => import('../pages/XmllayoutPages')) // 布局页面

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
                index: true, // 访问 / 时默认渲染
                element: <Navigate to="/device" replace />
            },
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
            },
            {
                path: 'terminal',
                element: (
                    <Suspense fallback={<Spin size="large" />}>
                        <TerminalPages />
                    </Suspense>
                )
            },
            {
                path: 'upload',
                element: (
                    <Suspense fallback={<Spin size="large" />}>
                        <UploadfilePages />
                    </Suspense>
                )
            },
            {
                path: 'xmllayout',
                element: (
                    <Suspense fallback={<Spin size="large" />}>
                        <XmlLayoutPages />
                    </Suspense>
                )
            }
        ]
    }
]

// 导出路由表
export default routes;