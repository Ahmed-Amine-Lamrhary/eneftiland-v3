import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { AiFillQuestionCircle } from "react-icons/ai"

interface SelectBoxProps {
  label: string
  value: string | undefined
  onChange: any
  children: any
  hint?: string
}

const SelectBox = ({
  label,
  value,
  onChange,
  children,
  hint,
}: SelectBoxProps) => {
  return (
    <div className="form-group">
      <label>
        {label}{" "}
        {hint && (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                {hint}
              </Tooltip>
            )}
          >
            <button className="hint">
              <AiFillQuestionCircle />
            </button>
          </OverlayTrigger>
        )}
      </label>
      <select className="form-select" value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  )
}

export default SelectBox
