import { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

function GISMap() {
  const mapRef = useRef(null);
  const [markerPos, setMarkerPos] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const locateByCoord = () => {
    if (!lat || !lng) return;
    const position = [parseFloat(lat), parseFloat(lng)];
    setMarkerPos(position);
    mapRef.current.setView(position, 16);
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* 坐标输入框 */}
      <div className="coord-panel">
        <input
          type="text"
          placeholder="纬度 (lat)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="经度 (lng)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <button onClick={locateByCoord}>定位</button>
      </div>

      <MapContainer
        center={[25.0330, 121.5654]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <LayersControl position="topright">
          {/* 普通地图 */}
          <BaseLayer checked name="普通地图">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
          </BaseLayer>

          {/* 卫星地图 */}
          <BaseLayer name="卫星地图">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="© Esri"
            />
          </BaseLayer>
        </LayersControl>

        {markerPos && (
          <Marker position={markerPos}>
            <Popup>
              坐标位置：<br />
              {markerPos[0]}, {markerPos[1]}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default GISMap;
