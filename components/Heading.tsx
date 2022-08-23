import React from "react";

interface HeadingProps {
  title: string;
  subTitle?: string;
  paragraph?: string;
  className?: string;
  children?: any;
}

const Heading = ({
  title,
  subTitle,
  paragraph,
  className,
  children,
}: HeadingProps) => {
  return (
    <div className={`heading-section ${className}`}>
      {subTitle && <h6 className="subtitle">{subTitle}</h6>}
      <h2 className="title">{title}</h2>
      {paragraph && <p className="paragraph">{paragraph}</p>}

      {children}
    </div>
  );
};

export default Heading;
