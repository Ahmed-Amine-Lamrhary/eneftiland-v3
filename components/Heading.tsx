import React from "react"
import { AnimationOnScroll } from "react-animation-on-scroll"

interface HeadingProps {
  title: string
  subTitle?: string
  paragraph?: string
  className?: string
  children?: any
}

const Heading = ({
  title,
  subTitle,
  paragraph,
  className,
  children,
}: HeadingProps) => {
  return (
    <AnimationOnScroll animateIn="animate__fadeIn" animateOnce>
      <div className={`heading-section ${className}`}>
        {subTitle && <h6 className="subtitle">{subTitle}</h6>}
        <h2 className="title">{title}</h2>
        {paragraph && <p className="paragraph">{paragraph}</p>}

        {children}
      </div>
    </AnimationOnScroll>
  )
}

export default Heading
