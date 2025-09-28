"use client";

import React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { googleApi } from "@/utils/endpoints";

// La Grange location
const LA_GRANGE = { lat: 41.8153, lng: -87.8695 }; 
const PLACE_NAME = "La Grange - Kama Bistro";

const Mapview: React.FC = () => {
    return (
        <APIProvider apiKey={googleApi || ""}>
            <Map
                defaultCenter={LA_GRANGE}
                defaultZoom={15}
                style={{ width: "100%", height: "100%", borderRadius: "15px" }}
                gestureHandling="greedy"
            >
                <AdvancedMarker position={LA_GRANGE} title={PLACE_NAME}>
                    <div className="custom-marker p-2 bg-red-500 text-white rounded-full border-2 border-white shadow-lg">
                        🍴
                    </div>
                </AdvancedMarker>
            </Map>
        </APIProvider>
    );
};

export default Mapview;
