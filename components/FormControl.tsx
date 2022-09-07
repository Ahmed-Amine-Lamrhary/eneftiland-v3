import { ErrorMessage, Field } from "formik"
import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { AiFillQuestionCircle } from "react-icons/ai"
import AppEditor from "./AppEditor"
import AsyncSelect from "react-select/async"

const Error: any = ErrorMessage

interface FormControlProps {
  type: string
  name: string
  placeholder: string
  children?: any
  hint?: string
  hideLabel?: boolean
  disabled?: boolean
  loadOptions?: any
}

const renderControl = (
  type: string,
  name: string,
  placeholder: string,
  children?: any,
  disabled?: boolean,
  loadOptions?: any
) => {
  if (type === "textarea")
    return (
      <Field name={name} disabled={disabled}>
        {({ field }: any) => {
          return (
            <textarea
              className="form-control"
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              name={name}
            />
          )
        }}
      </Field>
    )

  if (type === "checkbox") {
    const id = Math.random() + ""
    return (
      <div className="form-group">
        <div className="form-check">
          <label className="switch">
            <Field
              type={type}
              name={name}
              className="form-check-input mt-0"
              id={id}
            />
            <span className="slider" />
          </label>

          <label className="text" htmlFor={id}>
            {placeholder}
          </label>
        </div>
      </div>
    )
  }

  if (type === "select")
    return (
      <>
        <Field
          as="select"
          name={name}
          className="form-select"
          disabled={disabled}
        >
          {children}
        </Field>
      </>
    )

  if (type === "editor")
    return (
      <Field name={name}>
        {({ form, field }: any) => {
          return (
            <AppEditor
              defaultValue={field.value}
              onChange={(value: any) => form.setFieldValue(field.name, value)}
            />
          )
        }}
      </Field>
    )

  if (type === "suggestions")
    return (
      <div className="react-select-box">
        <Field name={name}>
          {({ form, field }: any) => {
            return (
              <AsyncSelect
                loadOptions={loadOptions}
                value={field.value}
                onChange={(value: any) => {
                  form.setFieldValue(field.name, value)
                }}
                placeholder={placeholder}
              />
            )
          }}
        </Field>
      </div>
    )

  return (
    <Field
      type={type}
      name={name}
      className="form-control"
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}

const FormControl = ({
  type,
  name,
  placeholder,
  children,
  hint,
  hideLabel,
  disabled,
  loadOptions,
}: FormControlProps) => {
  return (
    <div className="form-group">
      {type !== "hidden" && !hideLabel && (
        <label>
          {placeholder}{" "}
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
      )}

      <div>
        {renderControl(
          type,
          name,
          placeholder,
          children,
          disabled,
          loadOptions
        )}
      </div>

      <Error name={name}>
        {(msg: any) => <div className="error-message">{msg}</div>}
      </Error>
    </div>
  )
}

export default FormControl
