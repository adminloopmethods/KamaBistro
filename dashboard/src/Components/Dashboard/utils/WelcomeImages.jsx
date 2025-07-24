import { useEffect, useState, useRef } from "react";
// import LandingIntro from "../LandingIntro";
import bg from '../../../assets/login/restaurantSmall.jpg'

const BackroundImage = () => {

    const bgRef = useRef(null); // for accessing the background Image


    return (
        <div
            className='w-full border border-red h-full xl:max-w-6xl l-bg lg:flex-5 bg-repeat-none bg-center bg-cover'
            ref={bgRef}
            style={{ backgroundImage: `linear-gradient(#333333d1,rgba(0, 0, 0, 0.2)),url(${bg})` }}
        >
        </div>
    )
}

export default BackroundImage