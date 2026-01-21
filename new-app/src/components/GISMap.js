// src/components/GISMap.js
import React, { useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 修复 Leaflet 默认 marker 图标在 React 中丢失的问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 点击地图添加标记的组件
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
    mousemove(e) {
      // 可选：用于显示坐标（我们用状态提升到父组件）
    }
  });
  return null;
}

// 底图控制组件（自定义）
function BaseLayerControl() {
  const map = useMap();

  const switchLayer = (type) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url, attribution;
    if (type === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles © Esri';
    } else {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }

    L.tileLayer(url, { attribution }).addTo(map);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        background: 'white',
        padding: '8px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <button onClick={() => switchLayer('satellite')} style={{ display: 'block', marginBottom: '4px' }}>
        卫星图
      </button>
      <button onClick={() => switchLayer('osm')} style={{ display: 'block' }}>
        街道图
      </button>
    </div>
  );
}

// 主 GIS 组件
export default function GISMap() {
  const [markers, setMarkers] = useState([]);
  const [mousePosition, setMousePosition] = useState({ lat: null, lng: null });

  const handleMapClick = (latlng) => {
    setMarkers((prev) => [...prev, latlng]);
  };

  const handleMapMouseMove = (e) => {
    const { lat, lng } = e.latlng;
    setMousePosition({ lat, lng });
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[35.8617, 104.1954]} // 中国中心
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        onMouseMove={handleMapMouseMove}
      >
        {/* 默认加载卫星图 */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri'
        />

        {/* 自定义控件 */}
        <BaseLayerControl />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* 渲染用户添加的标记 */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker}>
            <Popup>
              纬度: {marker.lat.toFixed(5)}<br />
              经度: {marker.lng.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 鼠标坐标显示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'rgba(255,255,255,0.8)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {mousePosition.lat !== null
          ? `纬度: ${mousePosition.lat.toFixed(5)}, 经度: ${mousePosition.lng.toFixed(5)}`
          : '移动鼠标查看坐标'}
      </div>

      {/* 清除按钮 */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          background: 'white',
          padding: '8px',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={() => setMarkers([])}
          style={{ padding: '6px 12px' }}
        >
          🗑️ 清除标记
        </button>
      </div>
    </div>
  );
}