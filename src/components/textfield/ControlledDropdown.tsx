import { Controller } from "react-hook-form";
import { Dropdown, IDropdownProps } from "@fluentui/react/lib/Dropdown";
import { HookFormProps } from "./HookFormProps";

export const ControlledDropdown: React.FC<HookFormProps & IDropdownProps> = (
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
        fieldState: { error },
      }) => (
        <Dropdown
          {...props}
          selectedKey={value}
          onChange={(_e, option) => {
            onChange(option?.key);
          }}
          
          onBlur={onBlur}
          errorMessage={error && error.message}
          defaultValue={undefined}
        />
      )}
    />
  );
};
