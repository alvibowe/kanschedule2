
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AppLayout from "@lib/components/Layouts/AppLayout";

const styles = {
  width: "90vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};


const Page = () => {

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        const initializeMap = ({ setMap, mapContainer }) => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
            center: [-73.985664, 40.748514],
            zoom: 12
        });

        map.on("load", () => {
            setMap(map);
            map.resize();
        });
        };

        if (!map) initializeMap({ setMap, mapContainer });

    }, [map])


    return (
        <>
            <AppLayout>
                <div className="m-10 flex justify-center min-h-screen">
                    <div ref={el => (mapContainer.current = el)} style={styles} />
                </div>
            </AppLayout>
        </>
        
    )
}

export default Page;