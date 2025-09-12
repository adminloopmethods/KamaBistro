"use client";

import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { googleApi } from "@/utils/endpoints";

const DEFAULT_CENTER = { lat: 41.8130, lng: -87.8690 }; // LA GRANGE

export default function SingleLocationMap() {
    return (
            <APIProvider apiKey={googleApi || ""}>
                <Map
                    defaultCenter={DEFAULT_CENTER}
                    defaultZoom={15}
                    style={{ width: "356px", height: "100%", borderRadius: "12px" }}
                >
                    <Marker position={DEFAULT_CENTER} title="LA GRANGE, 9 South La Grange Road IL 60525" />
                </Map>
            </APIProvider>
    );
}
