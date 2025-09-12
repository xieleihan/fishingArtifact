import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// 导入路由内置组件
import { HashRouter } from "react-router-dom";
// 导入项目配置的路由对象
import Router from "./router/index";

// 导入Lenis
import "lenis/dist/lenis.css";
import Lenis from "lenis";
const lenis = new Lenis();
function raf(time: DOMHighResTimeStamp) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    <Router />
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
