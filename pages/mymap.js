
import React, { useEffect, useRef, useState, createElement } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AppLayout from "@lib/components/Layouts/AppLayout";

import { useSession, getSession } from "next-auth/react";

import Loader from "@lib/components/Loader";

import * as turf from '@turf/turf'

const styles = {
  width: "90vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};

const van = {
    width: "20px",
    height: "20px",
    border: "2px solid #fff",
    borderRadius:"50%",
    background: "#3887be",
    pointerEvents: "none"
}


const Page = () => {

    const [myMap, setMyMap] = useState();
    const [technician, setTechnician] = useState([])

    const [allEvents, setAllEvents] = useState([]);
    
    const mapContainer = useRef(null);
    const [loading, setLoading] = useState(true);
    const [routePayload, setRoutePayload] = useState([])
    const [waypoints, setWaypoints] = useState([])

    

    // initial van location
    const [vanLocation, setVanLocation] = useState([-83.093, 42.376]);
    const [startingLocation, setStartingLocation] =  useState([-122.42,37.78])

    const { data: session } = useSession();

    // waypoints
    

    const marker = createElement('div');

    // Empty GeoJSON feature collection, which will be used as the data source for the route before users add any new data
    const nothing = turf.featureCollection([]);




    const getUser = async() => {
    

      const result = await fetch('/api/get-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: session.user.email,
            
        }),
      })
  
      const data = await result.json()
  
      
      setTechnician(data)
      setAllEvents(data?.calendar?.events)

    }

    useEffect(() => {
        if(allEvents && allEvents.length > 0){
            const waypoints = allEvents.map((event) => {
                return `${event.lng},${event.lat}`
            })
            setWaypoints(waypoints.join(';'))  
        }
    }, [allEvents])

    useEffect(() => {
      if(session) getUser();
      
      
      
    }, [session]);

    
    useEffect(() => {

        

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

        const startingPoint = turf.featureCollection([turf.point(startingLocation)]);

        // optimize route using fetch
        
        const optimizeRoute = () => {
          return `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/-122.42,37.78;-122.45,37.91;-122.48,37.73?geometries=geojson&access_token=${mapboxgl.accessToken}`
        }
         
        



        const initializeMap = ({ setMyMap, mapContainer }) => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
            center: [-83.093, 42.376],
            zoom: 12
        });

        

        map.on("load", async () => {
            setLoading(false);

            const handleOptandResponse = async() => {
              const query = await fetch(optimizeRoute(), { method: 'GET' });
              const response = await query.json();
    
              
    
              const routeGeoJSON = turf.featureCollection([
                turf.feature(response.trips[0].geometry)
              ]);
    
              // Update the `route` source by getting the route source
              // and setting the data equal to routeGeoJSON
              map.getSource('route').setData(routeGeoJSON);
            }
            
            
            // handleOptandResponse()

            setMyMap(map);
            
            
            
            map.resize();

        });


        // optimization function

        

        };

        

        if (mapContainer.current && !myMap) {
          initializeMap({ setMyMap, mapContainer })
        };

        

        

        
        

       
        // Create a new marker
        if(myMap){
            
            new mapboxgl.Marker(marker).setLngLat(vanLocation).addTo(myMap);

            myMap.addSource('route', {
              type: 'geojson',
              data: {
                "type": "FeatureCollection",
                "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [-122.42,37.78]
                  } 
                }]
              }
            });

            myMap.addLayer({
                id: 'warehouse',
                type: 'circle',
                source: {
                  data: startingPoint,
                  type: 'geojson'
                },
                paint: {
                  'circle-radius': 20,
                  'circle-color': 'white',
                  'circle-stroke-color': '#3887be',
                  'circle-stroke-width': 3
                }
              });
              
              // Create a symbol layer on top of circle layer
            myMap.addLayer({
                id: 'warehouse-symbol',
                type: 'symbol',
                source: {
                  data: startingPoint,
                  type: 'geojson'
                },
                layout: {
                  'icon-image': 'grocery-15',
                  'icon-size': 1
                },
                paint: {
                  'text-color': '#3887be'
                }
              });


              // Layer with all the dropoffs
            // myMap.addLayer({
            //     id: 'dropoffs-symbol',
            //     type: 'symbol',
            //     source: {
            //       data: waypoints,
            //       type: 'geojson'
            //     },
            //     layout: {
            //       'icon-allow-overlap': true,
            //       'icon-ignore-placement': true,
            //       'icon-image': 'marker-15'
            //     }
            // });

            
              
        }

        
        

    }, [myMap, mapContainer, waypoints])


    

    
    
    return (
        <>
            <AppLayout>

                
                {/* <div className="m-10 flex justify-center min-h-screen">
                    <Loader />
                </div>  */}

                <div className="m-10 flex justify-center min-h-screen">
                    <div ref={mapContainer} style={styles} />
                </div>
            </AppLayout>
        </>
        
    )
}

export default Page;