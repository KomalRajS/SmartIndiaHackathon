import React from "react";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { SearchBox } from "@mapbox/search-js-react";
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "./Navbar/Navbar";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

function Map(props) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmFnYXJhai1wb29qYXJpIiwiYSI6ImNsOGw1M3d6ZjF3bmIzdXF4dzJzbDI0OXMifQ.YKQSwfcvRCUlD4Vx0pKpyQ";

  const mapContainer = useRef("map-container");
  const map = useRef(null);
  const [location, setLocation] = useState([0, 0]);
  const [zoom, setZoom] = useState(4);
  const [instructionDisplay, setInstructionDisplay] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => {
    setShowChat(!showChat);
  };

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
          clusterRadius: 100,
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
              "#A7F7B5",
              100,
              "#f1f075",
              500,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
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
            "text-field": "{point_count_abbreviated}",
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
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        map.current.on("click", "clusters", (e) => {
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties.cluster_id;
          map.current
            .getSource("earthquakes")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        map.current.on("click", "unclustered-point", (e) => {
          const text = e.features[0].properties.id;
          const coordinates = e.features[0].geometry.coordinates;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(text)
            .addTo(map.current);
        });

        map.current.on("mouseenter", "clusters", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "clusters", () => {
          map.current.getCanvas().style.cursor = "";
        });
      locations.forEach((loc) => {
        new mapboxgl.Marker({
          color: "#FF0000",
        })
          .setLngLat([
            loc.rest.geometry.coordinates[1],
            loc.rest.geometry.coordinates[0],
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <a href='/rescue/dashboard/${loc._id}' ><h4>${loc.username}</h4></a>
          `)
          )
          .addTo(map.current);
      });
    }
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/nagaraj-poojari/clmbjvzva017201qu57augk40",
      center: [80.1128, 23.6345],
      zoom: zoom,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.current.addControl(geolocate);

    // Listen for the `geolocate` event to get the user's location
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
          `http://localhost:4000/rescue/${props.url}`
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

        // Add locationing point to the map
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
        <NavBar
          searchbox={
            <SearchBox
              accessToken={mapboxgl.accessToken}
              marker={true}
              map={map.current}
              placeholder="search places"
              value=""
              mapboxgl={mapboxgl}
              popoverOptions={{
                placement: "top-start",
                flip: true,
                offset: 5,
              }}
            />
          }
        />
      </div>
      <div className="chat-button">
        {showChat && (
          <iframe
            width="350"
            height="430"
            allow="microphone;"
            className="chat-window"
            src="https://console.dialogflow.com/api-client/demo/embedded/7130a9d5-5926-40a1-ab4c-732d73178eab"
          ></iframe>
        )}
        <button onClick={toggleChat} className="chat-toggle-button">
          🤖
        </button>
      </div>
      <div ref={mapContainer} className="map-container" />
    </>
  );
}

export default Map;
