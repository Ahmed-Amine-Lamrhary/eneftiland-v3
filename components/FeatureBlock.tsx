import React from "react";

interface FeatureBlockProps {
  Icon: any;
  title: string;
  content: string;
}

const FeatureBlock = ({ Icon, title, content }: FeatureBlockProps) => {
  return (
    <div className="feature-block">
      <div className="icon">
        <Icon size={35} />
      </div>
      <h5>{title}</h5>
      <p>{content}</p>
    </div>
  );
};

export default FeatureBlock;
