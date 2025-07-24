import { useEffect, useState, useRef } from "react";
// import LandingIntro from "../LandingIntro";
import bg from '../../../assets/login/restaurantSmall.jpg'

import login from "../../../assets/index.js"

const BackroundImage = () => {

    const bgRef = useRef(null); // for accessing the background Image


    return (
        <div
            className='w-full h-full xl:max-w-6xl l-bg lg:flex-5 bg-repeat-none bg-center bg-cover'
            ref={bgRef}
            style={{ backgroundImage: `linear-gradient(#333333d1,rgba(0, 0, 0, 0.2)),url(${bg})` }}
        >
            {/** Logo */}
            <img src={login.logo} alt="" className="border" />
        </div>
    )
}

export default BackroundImage