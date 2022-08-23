import { Form, Formik } from "formik";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface AppFormProps {
  schema: any;
  onSubmit: any;
  children: any;
  initialValues?: any;
  loading?: boolean;
  id?: string;
}

const AppForm = ({
  schema,
  onSubmit,
  children,
  initialValues = {},
  loading = false,
  id,
}: AppFormProps) => {
  return (
    <div className="app-form">
      {loading && (
        <div className="loading">
          <AiOutlineLoading size={40} className="icon" />
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {() => <Form id={id}>{children}</Form>}
      </Formik>
    </div>
  );
};

export default AppForm;
