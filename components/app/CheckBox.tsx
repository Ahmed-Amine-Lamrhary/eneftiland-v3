import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { AiFillQuestionCircle } from "react-icons/ai"

interface CheckBoxProps {
  checked: boolean | undefined
  onCheck: any
  label: string
  hint?: string
  disabled?: boolean
  hideLabel?: boolean
}

const CheckBox = ({
  checked,
  onCheck,
  label,
  hint,
  disabled,
  hideLabel,
}: CheckBoxProps) => {
  const id = Math.random() + ""
  return (
    <div className="form-group">
      <label className="form-title">{!hideLabel && label} </label>

      <div className="form-check">
        <label className="switch">
          <input
            type="checkbox"
            className="form-check-input mt-0"
            id={id}
            onChange={onCheck}
            checked={checked}
            disabled={disabled}
          />{" "}
          <span className="slider"></span>
        </label>

        <label className="text" htmlFor={id}>
          {label}

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
      </div>
    </div>
  )
}

export default CheckBox
