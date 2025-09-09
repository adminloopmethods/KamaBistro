"use client";

import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import { formatWithCommas } from "../../_functionality/commons";

// Default map settings
const DEFAULT_CENTER = { lat: 17.9714, lng: -76.7931 }; // Jamaica center
const DEFAULT_ZOOM = 12;

// Restaurant location (always pinned)
const RESTAURANT_LOCATION = { lat: 17.975, lng: -76.792 }; // example coordinates
const RESTAURANT_NAME = "Kama Bistro"; // example name

interface LocationData {
    _id: string;
    images: string[];
    title: string;
    price?: number;
    address?: {
        geometry?: {
            location?: {
                coordinates?: number[];
            };
        };
    };
    createdByDoc?: {
        firstName?: string;
    };
}

interface MapviewProps {
    width: string | number;
    height: string | number;
    data: LocationData[] | LocationData;
    fullScreen?: boolean;
    center?: { lat: number; lng: number };
    isSingleBookDetails?: boolean;
    onExitFullScreen?: () => void;
}

const MapMarkers: React.FC<{
    locations: LocationData[];
    userLocationData?: { latitude: number; longitude: number; currentLocation: boolean };
    router: ReturnType<typeof useRouter>;
}> = ({ locations, userLocationData, router }) => {
    return (
        <>
            {/* User location marker */}
            {userLocationData?.currentLocation && (
                <AdvancedMarker
                    position={{
                        lat: userLocationData.latitude,
                        lng: userLocationData.longitude,
                    }}
                    title="Your Location"
                >
                    <div className="custom-marker p-2 bg-blue-500 text-white rounded-full border-2 border-white shadow-lg">
                        📍
                    </div>
                </AdvancedMarker>
            )}

            {/* Restaurant marker */}
            <AdvancedMarker position={RESTAURANT_LOCATION} title={RESTAURANT_NAME}>
                <div className="custom-marker p-2 bg-red-500 text-white rounded-full border-2 border-white shadow-lg">
                    🍴
                </div>
            </AdvancedMarker>

            {/* Data markers */}
            {locations.map((item, index) => {
                const coords = item?.address?.geometry?.location?.coordinates;
                if (!coords || coords.length < 2) return null;

                return (
                    <AdvancedMarker
                        key={index}
                        position={{ lat: coords[1], lng: coords[0] }}
                        title={item?.createdByDoc?.firstName || ""}
                    >
                        <div
                            className="custom-marker relative z-10 hover:z-[9999] p-3 bg-white rounded shadow-lg"
                            onClick={() => router.push(`/book-detail?id=${item._id}`)}
                        >
                            <img
                                className="border aspect-[3/4] mx-auto w-[50px]"
                                src={item.images[0]}
                                alt={item.title}
                            />
                            <div className="text-md mt-2">{item.title}</div>
                            {item.price && (
                                <div className="text-md mt-2">J${formatWithCommas(item.price)}</div>
                            )}
                            <div className="triangle absolute bottom-[-15px] left-[30%]"></div>
                        </div>
                    </AdvancedMarker>
                );
            })}
        </>
    );
};

const Mapview: React.FC<MapviewProps> = ({
    width,
    height,
    data,
    fullScreen = false,
    center,
    isSingleBookDetails = false,
    onExitFullScreen = () => { },
}) => {
    const router = useRouter();
    const userLocationData = useAppSelector(
        (state) => state.storeData.userLocationData
    );

    const [loading, setLoading] = useState(true);

    const locations = Array.isArray(data) ? data : [data];

    const mapCenter = isSingleBookDetails && center ? center : userLocationData
        ? { lat: userLocationData.latitude, lng: userLocationData.longitude }
        : DEFAULT_CENTER;

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return <Skeleton height={height} />;
    }

    const mapStyle = fullScreen
        ? {
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            borderRadius: 0,
        }
        : {
            width,
            height,
            borderRadius: "15px",
        };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_NEW_API_KEY || ""}>
            <Map
                defaultCenter={mapCenter}
                defaultZoom={DEFAULT_ZOOM}
                style={mapStyle}
                gestureHandling="greedy"
            >
                <MapMarkers
                    locations={locations}
                    userLocationData={userLocationData ?? undefined}
                    router={router}
                />

            </Map>

            {fullScreen && (
                <button
                    className="fixed top-[10px] right-[10px] z-[10000] h-[40px] w-[40px] border-0 font-black text-white flex items-center justify-center shadow"
                    style={{
                        background:
                            "linear-gradient(268.27deg, #211F54 11.09%, #0161AB 98.55%)",
                    }}
                    onClick={onExitFullScreen}
                >
                    ✕
                </button>
            )}
        </APIProvider>
    );
};

export default Mapview;
