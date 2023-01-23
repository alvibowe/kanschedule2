import { useState, useMemo } from "react";
import mapboxgl from 'mapbox-gl';
import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, NavigationControl } from 'react-map-gl';

const Page = () => {
  const { data: session } = useSession();
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 41.5868,
    longitude: -93.625,
    zoom: 13
  })

  const mapboxApiAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <>
      <AppLayout>
        <div className="flex justify-center text-center flex-row">
          <Map
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 14
            }}
            mapboxAccessToken={mapboxApiAccessToken}
            style={{width: 600, height: 400}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <NavigationControl />
            <Marker longitude={-122.4} latitude={37.8}  anchor="bottom" color="#AA4A44"></Marker>
            <Marker longitude={-122.4} latitude={39.9}  anchor="bottom" color="#AA4A44"></Marker>
            <Marker longitude={-128.8} latitude={37.8}  anchor="bottom" color="#AA4A44"></Marker>


          </Map>
          
          {/* <p>This will display under the map</p> */}
        </div>
        
      </AppLayout>
    </>
  );
};

Page.auth = {
  redirectTo: "/",
};

export default Page;