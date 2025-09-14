import './App.scss';
// 导入图标
import Device from './assets/icon/device.svg';
import About from './assets/icon/about.svg';
import Terminal from './assets/icon/terminal.svg';

import { useState } from 'react';
import {Outlet,Link} from 'react-router-dom';

function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const config = [
    {
      title: '设备',
      icon: Device,
      activity: '#307dee',
      link: '/device'
    },
    {
      title:'终端',
      icon: Terminal,
      activity: '#307dee',
      link: '/terminal'
    },
    {
      title: '关于',
      icon: About,
      activity: '#307dee',
      link: '/about'
    }
  ];

  return (
    <div className="App">
      <div className="left">
        <nav>
          <ul>
            {config.map((item, index) => (
              <Link to={item.link} key={index}>
                <li
                  key={index}
                  title={item.title}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    color: activeIndex === index ? item.activity : '#333'
                  }}
                >
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt={item.title}
                    style={{
                      filter:
                        activeIndex === index
                          ? 'invert(37%) sepia(100%) saturate(747%) hue-rotate(190deg) brightness(94%) contrast(92%)'
                          : 'none'
                    }}
                  />
                  <div>{item.title}</div>
                </li>
              </Link>
              
            ))}
          </ul>
        </nav>
      </div>
      <div className="right">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
