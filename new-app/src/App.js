import GISMap from "./components/GISMap";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* 顶部标题栏 */}
      <header className="app-header">
        🌍 Web GIS 地理信息平台
      </header>

      {/* 地图主体 */}
      <div className="map-wrapper">
        <GISMap />
      </div>
    </div>
  );
}

export default App;
