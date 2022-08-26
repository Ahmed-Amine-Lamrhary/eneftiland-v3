import dynamic from "next/dynamic"
import React from "react"

const DynamicReactJson: any = dynamic(import("react-json-view"), { ssr: false })

interface JsonPreviewProps {
  json: any
}

const JsonPreview = ({ json }: JsonPreviewProps) => {
  return (
    <div className="json-preview">
      <DynamicReactJson
        src={json}
        name={false}
        collapsed={1}
        displayDataTypes={false}
        enableClipboard={false}
        collapseStringsAfterLength={20}
        displayObjectSize={false}
        theme="grayscale:inverted"
      />
    </div>
  )
}

export default JsonPreview
