// src/App.js
import React from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// === 修复 Leaflet 图标路径问题 ===
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// === 城市数据 ===
const cities = [
  { name: "北京", lat: 39.9042, lng: 116.4074, population: 21540000 },
  { name: "上海", lat: 31.2304, lng: 121.4737, population: 24240000 },
  { name: "广州", lat: 23.1291, lng: 113.2644, population: 15300000 },
  { name: "深圳", lat: 22.5431, lng: 114.0579, population: 13000000 },
  { name: "成都", lat: 30.5728, lng: 104.0668, population: 16330000 },
  { name: "杭州", lat: 30.2741, lng: 120.1551, population: 12200000 },
  { name: "西安", lat: 34.3416, lng: 108.9398, population: 12950000 },
  { name: "武汉", lat: 30.5928, lng: 114.3055, population: 13600000 },
];

// === 辅助函数 ===
const getRadius = (population) => Math.max(5, Math.sqrt(population / 100000));
const getColor = (population) => {
  if (population > 20000000) return '#d73027';
  if (population > 15000000) return '#fdae61';
  if (population > 10000000) return '#ffffbf';
  return '#a6d8d8';
};

// === 主组件 ===
function App() {
  return (
    <>
      {/* 页面标题 */}
      <h1 style={{
        textAlign: 'center',
        margin: '0',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '1.4em',
        fontWeight: '600',
        zIndex: 1000,
        position: 'relative'
      }}>
        中国主要城市人口分布
      </h1>

      {/* 地图容器 */}
      <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
        <MapContainer
          center={[32, 105]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          {/* 底图：OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 渲染城市气泡 */}
          {cities.map((city) => (
            <CircleMarker
              key={city.name}
              center={[city.lat, city.lng]}
              radius={getRadius(city.population)}
              fillColor={getColor(city.population)}
              color="#000"
              weight={1}
              opacity={1}
              fillOpacity={0.7}
            >
              <Popup>
                <b>{city.name}</b><br />
                人口：{(city.population / 10000).toFixed(1)} 万人
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* 图例（使用 div 实现） */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 1000,
          transform: 'translateY(50%)'
        }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>人口规模</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#d73027', marginRight: '6px' }}></div>
            <span>＞2000万</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fdae61', marginRight: '6px' }}></div>
            <span>1500万～2000万</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ffffbf', marginRight: '6px' }}></div>
            <span>1000万～1500万</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#a6d8d8', marginRight: '6px' }}></div>
            <span>＜1000万</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;