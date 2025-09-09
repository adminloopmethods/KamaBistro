import React from 'react'
import Image from 'next/image';

function HotelTimings() {
  return (
        <article className="flex relative poppins-text">
          <article className="max-sm:w-full flex-shrink basis-[500px] h-[417px] bg-[#AE9060] text-white p-[20px] space-y-2">
            <article>LA GRANGE, 9 South La Grange Road IL 60525</article>
            <article>(708)352-3300</article>
            <article>Kama@kamabistro.com</article>
            <hr className="text-white" />
            <article className="flex gap-5">
              <article className="space-y-2">
                <h3 className="font-extralight">Opening Hours,</h3>
                <p>Mon: Closed</p>
                <p>Tue-Thr: 5pm-9pm</p>
                <p>Fri: 5pm-10pm</p>
                <p>Sat: 12pm-10pm</p>
                <p>Sun: 12pm- 9pm</p>
              </article>
              <article className="space-y-2">
                <h3 className="font-extralight">Happy Hours,</h3>
                <p>Mon - Fri: 5pm-9pm</p>
                <h3 className="font-extralight">Brunch Hours,</h3>
                <p>Mon - Fri: 4pm-12pm</p>
                <h3 className="font-extralight">Business Hours,</h3>
                <p>Mon - Fri: 4pm-12pm</p>
              </article>
            </article>
          </article>
          <Image  src={"/embroid-light.png"} width={500} height={500} alt="idk" className="max-sm:w-full absolute top-30 -left-25 scale-190 rotate-180"/>
        </article>
    );
}

export default HotelTimings