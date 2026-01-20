// src/App.js
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// === 修复图标问题 ===
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// === 省级数据 ===
const provinces = [
  { name: "北京", lat: 39.9042, lng: 116.4074, population: 21540000 },
  { name: "上海", lat: 31.2304, lng: 121.4737, population: 24240000 },
  { name: "广东", lat: 23.1291, lng: 113.2644, population: 126010000 },
  { name: "江苏", lat: 32.0608, lng: 118.7969, population: 85050000 },
  { name: "山东", lat: 36.6733, lng: 117.0000, population: 101500000 },
  { name: "河南", lat: 34.7557, lng: 113.6693, population: 99360000 },
  { name: "四川", lat: 30.5728, lng: 104.0668, population: 83710000 },
  { name: "河北", lat: 38.0488, lng: 114.5388, population: 75560000 },
  { name: "湖南", lat: 27.6607, lng: 111.7004, population: 69180000 },
  { name: "安徽", lat: 31.8612, lng: 117.2830, population: 61020000 },
  { name: "浙江", lat: 30.2741, lng: 120.1551, population: 65400000 },
  { name: "湖北", lat: 30.5928, lng: 114.3055, population: 58300000 },
  { name: "云南", lat: 25.0462, lng: 102.7076, population: 47210000 },
  { name: "广西", lat: 23.8177, lng: 108.3844, population: 50130000 },
  { name: "重庆", lat: 29.5630, lng: 106.5515, population: 32050000 },
  { name: "陕西", lat: 34.3416, lng: 108.9398, population: 39530000 },
  { name: "辽宁", lat: 41.8043, lng: 123.3754, population: 42590000 },
  { name: "山西", lat: 37.5443, lng: 112.5340, population: 34920000 },
  { name: "江西", lat: 28.6374, lng: 115.8921, population: 45180000 },
  { name: "贵州", lat: 26.5708, lng: 106.7153, population: 38560000 },
  { name: "福建", lat: 26.0753, lng: 119.3062, population: 41870000 },
  { name: "吉林", lat: 43.8886, lng: 125.3548, population: 24070000 },
  { name: "黑龙江", lat: 47.1336, lng: 126.5348, population: 31850000 },
  { name: "内蒙古", lat: 40.8283, lng: 111.7072, population: 24710000 },
  { name: "甘肃", lat: 36.0374, lng: 103.8163, population: 25020000 },
  { name: "新疆", lat: 43.8307, lng: 87.6204, population: 25850000 },
  { name: "西藏", lat: 30.0000, lng: 91.0000, population: 3640000 },
  { name: "宁夏", lat: 38.1667, lng: 106.0833, population: 7200000 },
  { name: "青海", lat: 36.6200, lng: 95.7700, population: 6030000 },
  { name: "海南", lat: 19.0000, lng: 109.5000, population: 9350000 },
  { name: "天津", lat: 39.1385, lng: 117.2000, population: 13860000 },
  { name: "香港", lat: 22.3193, lng: 114.1694, population: 7410000 },
  { name: "澳门", lat: 22.1987, lng: 113.5439, population: 683000 },
];

// === 颜色映射函数 ===
const getColor = (population) => {
  if (population > 100000000) return '#CC0000'; // 朱砂红
  if (population > 80000000) return '#FF6B00'; // 赤金
  if (population > 60000000) return '#FFA500'; // 橘黄
  if (population > 40000000) return '#8B4513'; // 檀香褐
  return '#808080'; // 青灰
};

// === 格式化人口显示 ===
const formatPopulation = (pop) => {
  if (pop >= 10000000) return `${(pop / 1000000).toFixed(1)} 百万`;
  return `${(pop / 10000).toFixed(1)} 万人`;
};

// === 主组件 ===
function App() {
  const [selectedProvince, setSelectedProvince] = useState(null);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[35, 105]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 渲染每个省份为一个可交互的圆圈 */}
        {provinces.map((province) => (
          <CircleMarker
            key={province.name}
            center={[province.lat, province.lng]}
            radius={Math.sqrt(province.population / 100000)}
            fillColor={getColor(province.population)}
            color="#000"
            weight={1}
            opacity={1}
            fillOpacity={0.8}
            eventHandlers={{
              click: () => {
                setSelectedProvince(province);
              },
              mouseover: () => {
                // 高亮效果（仅用于视觉反馈）
                const layer = document.querySelector(`[data-testid="circle-marker-${province.name}"]`);
                if (layer) {
                  layer.style.filter = 'brightness(1.2)';
                }
              },
              mouseout: () => {
                const layer = document.querySelector(`[data-testid="circle-marker-${province.name}"]`);
                if (layer) {
                  layer.style.filter = 'none';
                }
              }
            }}
          >
            <Popup>
              <b>{province.name}</b><br />
              人口：{formatPopulation(province.population)}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* 弹窗显示选中省份信息 */}
      {selectedProvince && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <h4>{selectedProvince.name}</h4>
          <p>人口：{formatPopulation(selectedProvince.population)}</p>
        </div>
      )}
    </div>
  );
}

export default App;