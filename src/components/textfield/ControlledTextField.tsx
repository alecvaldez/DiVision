import { Controller } from "react-hook-form";
import { TextField, ITextFieldProps } from "@fluentui/react/lib/TextField";
import * as React from "react";
import { HookFormProps } from "./HookFormProps";

export const ControlledTextField: React.FC<HookFormProps & ITextFieldProps> = (
  props
) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || ""}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <TextField
          {...props}
          autoComplete={"on"}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
          name={fieldName}
          errorMessage={error && error.message}
          defaultValue={undefined}
        />
      )}
    />
  );
};
