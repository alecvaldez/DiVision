import { Controller } from "react-hook-form";
import { SpinButton, ISpinButtonProps } from "@fluentui/react/lib/SpinButton";
import { HookFormProps } from "./HookFormProps";

export const ControlledSpinButton: React.FC<
  HookFormProps & ISpinButtonProps
> = (props) => {
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
        <SpinButton
          {...props}
          styles={{
            root: {
              height: 80,
            },
          }}
          // onChange={onChange}
          value={value}
          onIncrement={(val: string) => {
            const num = val === "" ? 1 : parseInt(val) + 1;
            if (props.max && num <= props.max) onChange(num);
          }}
          onDecrement={(val: string) => {
            const num = val === "" ? -1 : parseInt(val) - 1;
            if (props.min && num >= props.min) onChange(num);
          }}
          onBlur={onBlur}
          defaultValue={undefined}
        />
      )}
    />
  );
};
