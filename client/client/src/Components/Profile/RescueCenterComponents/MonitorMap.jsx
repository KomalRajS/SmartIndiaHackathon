import React from "react";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import Card from "react-bootstrap/Card";
import axios from "axios";
import MapboxGeocoder from "mapbox-gl-geocoder";
import RainLayer from "mapbox-gl-rain-layer";

function MonitorMap(props) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmFnYXJhai1wb29qYXJpIiwiYSI6ImNsOGw1M3d6ZjF3bmIzdXF4dzJzbDI0OXMifQ.YKQSwfcvRCUlD4Vx0pKpyQ";

  const mapContainer = useRef("map-container");
  const map = useRef(null);
  const [location, setLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(9);
  const [instructionDisplay, setInstructionDisplay] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (map && locations.length > 0) {
      const geoJsonFeatures = locations.map((location) => ({
        type: "Feature",
        properties: {
          id: location._id,
          centername: location.username,
        },
        geometry: {
          type: "Point",
          coordinates: [...location.rest.geometry.coordinates.reverse(), 0.0],
        },
      }));

      map.current.on("load", () => {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: true,
          placeholder: "Search for places",
          render: function (item) {
            return '<div class="custom-geocoder-item">' + item + "</div>";
          },
        });

        let marker = null;
        geocoder.on("result", function (event) {
          const selectedLocation = event.result;
          if (marker) {
            marker.remove();
          }
          marker = new mapboxgl.Marker()
            .setLngLat(selectedLocation.geometry.coordinates)
            .addTo(map.current);
          map.current.setCenter(selectedLocation.geometry.coordinates);
        });
        //map.current.addControl(geocoder);
        map.current.on("load", () => {
          map.current.addSource("single-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.current.addLayer({
            id: "point",
            source: "single-point",
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": "#FF0E0E",
            },
          });

          geocoder.on("result", (event) => {
            map.current
              .getSource("single-point")
              .setData(event.result.geometry);
          });
        });

        const rainLayer = new RainLayer({
          id: "rain",
          source: "rainviewer",
          scale: "noaa",
        });
        map.current.addLayer(rainLayer);

        const legendHTML = rainLayer.getLegendHTML();

        rainLayer.on("refresh", (data) => {
          console.log(data.timestamp);
        });

        map.current.addSource("earthquakes", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: geoJsonFeatures,
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 150,
        });

        map.current.addLayer(
          {
            id: "trees-heat",
            type: "heatmap",
            source: "earthquakes",
            maxzoom: 15,
            paint: {
              // increase weight as diameter breast height increases
              "heatmap-weight": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [1, 0],
                  [62, 1],
                ],
              },
              // increase intensity as zoom level increases
              "heatmap-intensity": {
                stops: [
                  [11, 1],
                  [15, 3],
                ],
              },
              // assign color values be applied to points depending on their density
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(236,222,239,0)",
                0.2,
                "rgb(208,209,230)",
                0.4,
                "rgb(166,189,219)",
                0.6,
                "rgb(103,169,207)",
                0.8,
                "rgb(28,144,153)",
              ],
              // increase radius as zoom increases
              "heatmap-radius": {
                stops: [
                  [11, 15],
                  [15, 20],
                ],
              },
              // decrease opacity to transition into the circle layer
              "heatmap-opacity": {
                default: 1,
                stops: [
                  [14, 1],
                  [15, 0],
                ],
              },
            },
          },
          "waterway-label"
        );
        map.current.addLayer(
          {
            id: "trees-point",
            type: "circle",
            source: "earthquakes",
            minzoom: 14,
            paint: {
              // increase the radius of the circle as the zoom level and dbh value increases
              "circle-radius": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [{ zoom: 15, value: 1 }, 5],
                  [{ zoom: 15, value: 62 }, 10],
                  [{ zoom: 22, value: 1 }, 20],
                  [{ zoom: 22, value: 62 }, 50],
                ],
              },
              "circle-color": {
                property: "dbh",
                type: "exponential",
                stops: [
                  [0, "rgba(236,222,239,0)"],
                  [10, "rgb(236,222,239)"],
                  [20, "rgb(208,209,230)"],
                  [30, "rgb(166,189,219)"],
                  [40, "rgb(103,169,207)"],
                  [50, "rgb(28,144,153)"],
                  [60, "rgb(1,108,89)"],
                ],
              },
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
              "circle-opacity": {
                stops: [
                  [14, 0],
                  [15, 1],
                ],
              },
            },
          },
          "waterway-label"
        );
      });

      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#BCF7C7",
            50,
            "#f1f075",
            100,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            50,
            30,
            100,
            40,
          ],
        },
      });

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#BCF7C7",
          "circle-radius": 10,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        },
      });

      map.current.on("mouseenter", "clusters", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        map.current.getCanvas().style.cursor = "";
      });
    }
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,

      style: "mapbox://styles/nagaraj-poojari/clmbjvzva017201qu57augk40",

      center: [76, 14],
      zoom: zoom,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.current.addControl(geolocate);

    geolocate.on("geolocate", (event) => {
      const { latitude, longitude } = event.coords;
      setLocation([longitude, latitude]);
    });
  }, [map.current, locations]);

  useEffect(() => {
    // Fetch location data from your backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/rescue/${props.url}/${props.id}`
        );
        const { data } = response;
        setLocations(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data from the backend:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location[0] != 0) {
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      async function getRoute(end) {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${location[0]},${location[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: "GET" }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        };

        if (map.current.getSource("route")) {
          map.current.getSource("route").setData(geojson);
        } else {
          map.current.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: geojson,
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#00FF22",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });
        }
        const instructions = document.getElementById("instructions");
        const steps = data.legs[0].steps;

        let tripInstructions = "";
        for (const step of steps) {
          tripInstructions += `<li>${step.maneuver.instruction}</li>`;
        }
        instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
          data.duration / 60
        )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
      }

      map.current.on("load", () => {
        getRoute(location);

        // Add   locationing point to the map
        map.current.addLayer({
          id: "point",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: location,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#3887be",
          },
        });
      });

      map.current.on("click", (event) => {
        const coords = Object.keys(event.lngLat).map(
          (key) => event.lngLat[key]
        );
        const end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          ],
        };
        if (map.current.getLayer("end")) {
          map.current.getSource("end").setData(end);
        } else {
          map.current.addLayer({
            id: "end",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: coords,
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#f30",
            },
          });
          setInstructionDisplay(true);
        }
        getRoute(coords);
      });
    }
  }, [location]);

  return (
    <>
      <div>
        <Card
          body
          id="instructions"
          className={
            instructionDisplay
              ? "bg-dark text-white "
              : "bg-dark text-white d-none"
          }
        ></Card>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  );
}

export default MonitorMap;
