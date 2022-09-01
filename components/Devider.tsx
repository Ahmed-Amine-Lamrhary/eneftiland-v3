import Image from "next/image"
import React from "react"
import { AnimationOnScroll } from "react-animation-on-scroll"

const Devider = () => {
  return (
    <AnimationOnScroll animateIn="animate__bounceInUp" animateOnce>
      <div className="img-divider">
        <Image
          className="img-divider"
          src={require("../assets/home/divider.svg")}
        />
      </div>
    </AnimationOnScroll>
  )
}

export default Devider
