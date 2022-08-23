import { Field } from "formik";
import React from "react";

interface SelectBoxProps {
  name: string;
  children: any;
}

const SelectBox = ({ name, children }: SelectBoxProps) => {
  return (
    <Field name={name}>
      {({ field }: any) => {
        return (
          <select
            className="form-control"
            name={name}
            value={field.value}
            onChange={field.onChange}
          >
            {children}
          </select>
        );
      }}
    </Field>
  );
};

export default SelectBox;
