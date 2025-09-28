"use client";

import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { googleApi } from "@/utils/endpoints";

const DEFAULT_CENTER = { lat: 41.8130, lng: -87.8690 }; // LA GRANGE

type SingleLocationMapProps = {
    style?: React.CSSProperties;
};

const SingleLocationMap: React.FC<SingleLocationMapProps> = ({ style }) => {
    return (
        <div style={{ ...style }}>
            {/* <div className="w-[100%] h-[100%]" style={{ pointerEvents: "none" }}> */}
                <APIProvider apiKey={googleApi || ""}>
                    <Map
                        defaultCenter={DEFAULT_CENTER}
                        defaultZoom={15}
                        style={{ minWidth: "100px", minHeight: "100px", borderRadius: "12px" }}
                    >
                        <Marker
                            position={DEFAULT_CENTER}
                            title="LA GRANGE, 9 South La Grange Road IL 60525"
                        />
                    </Map>
                </APIProvider>
            {/* </div> */}
        </div>
    );
};

export default SingleLocationMap;
