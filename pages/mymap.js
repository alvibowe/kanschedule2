
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AppLayout from "@lib/components/Layouts/AppLayout";
// import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import Loader from "@lib/components/Loader";

const styles = {
  width: "90vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};


const Page = () => {

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

        // const directions = new MapboxDirections({
        //     accessToken: mapboxgl.accessToken,
        //     unit: 'metric',
        //     profile: 'mapbox/driving',
        //     controls: {
        //         inputs: false,
        //         instructions: false,
        //         profileSwitcher: false
        //     }

        // })


        const initializeMap = ({ setMap, mapContainer }) => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
            center: [-73.985664, 40.748514],
            zoom: 12
        });

        map.on("load", () => {
            setLoading(false);
            setMap(map);
            map.resize();
        });
        };

        if (mapContainer.current && !map) initializeMap({ setMap, mapContainer });

    }, [map, mapContainer])


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