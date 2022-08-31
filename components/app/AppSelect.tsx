import React from "react"
import Select from "react-select"

interface AppSelectProps {
  options: any
  value: any
  onChange: any
  placeholder: string
  isSearchable?: boolean
}

const AppSelect = ({
  options,
  value,
  onChange,
  placeholder,
  isSearchable,
}: AppSelectProps) => {
  return (
    <div className="react-select-box">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable={isSearchable}
        styles={{
          option: (provided, state) => ({
            ...provided,
            color: "#4b4b4b",
            backgroundColor: state.isSelected
              ? "rgba(75, 75, 75, 0.1)"
              : "white",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#724bf4",
            primary50: "#f7fbfe",
          },
        })}
      />
    </div>
  )
}

export default AppSelect
