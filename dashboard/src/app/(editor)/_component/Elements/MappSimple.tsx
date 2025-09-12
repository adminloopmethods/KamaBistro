"use client";

import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { googleApi } from "@/utils/endpoints";
import { BaseElement } from "../../_functionality/createElement";

const DEFAULT_CENTER = { lat: 41.8130, lng: -87.8690 }; // LA GRANGE

type DivisionProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
    parentRef: HTMLElement | null;
};

export default function SingleLocationMap({ }) {
    return (
        <APIProvider apiKey={googleApi || ""}>
            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={15}
                style={{ width: "100%", height: "100%", borderRadius: "12px" }}
            >
                <Marker position={DEFAULT_CENTER} title="LA GRANGE, 9 South La Grange Road IL 60525" />
            </Map>
        </APIProvider>
    );
}
