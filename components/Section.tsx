import React from "react";

interface SectionProps {
  className?: string;
  id?: string;
  children: any;
}

const Section = ({ className, children, id }: SectionProps) => {
  return (
    <section className={`${className}`} id={id}>
      <div className="container">{children}</div>
    </section>
  );
};

export default Section;
