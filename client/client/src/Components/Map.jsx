import React from "react";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "./Navbar/Navbar";
import Card from "react-bootstrap/Card";
import axios from "axios";

function Map(props) {
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
      style: "mapbox://styles/mapbox/satellite-streets-v12",
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
        <NavBar />
      </div>
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

export default Map;
