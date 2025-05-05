import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Cluster } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import 'ol/ol.css';

class MapView extends React.Component {
  render() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!mapRef.current) return;

      // Базовый слой OSM
      const baseLayer = new TileLayer({
        source: new XYZ({url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'})
      });

      // Инициализация карты
      const map = new Map({
        target: mapRef.current,
        layers: [baseLayer],
        view: new View({
          center: [3828274, 8217571],
          zoom: 4
        })
      });

      // Загрузка данных
      fetch('/mocks/mock_points.json') // '/api/consumption/points_geojson/'
          .then(res => res.json())
          .then(data => {
            // Общий источник данных
            const vectorSource = new VectorSource({
              features: new GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
              })
            });

            // Тепловая карта
            const heatmapLayer = new Heatmap({
              source: vectorSource,
              blur: 20,
              radius: 10,
              weight: feature => {
                const consumption = feature.get('value') || 0;
                return consumption / 1000.0;
              }
            });

            // Кластерный слой
            const features = vectorSource.getFeatures();
            const clusterSource = new Cluster({
              distance: 40,
              source: new VectorSource({ features: features }) // Клонируем источник для разделения слоёв
            });

            const clusterLayer = new VectorLayer({
              source: clusterSource,
              style: feature => {
                const size = feature.get('features').length;
                return new Style({
                  image: new CircleStyle({
                    radius: 10 + Math.min(size, 20),
                    fill: new Fill({color: 'rgba(255, 153, 0, 0.8)'})
                  }),
                  text: new Text({
                    text: size.toString(),
                    fill: new Fill({color: '#000'})
                  })
                });
              }
            });

            // Добавляем оба слоя
            map.addLayer(heatmapLayer);
            map.addLayer(clusterLayer);
          });

      return () => map.setTarget(undefined);
    }, []);

    return <div ref={mapRef} style={{width: '100%', height: '600px'}}/>;
  }
}

export default MapView;