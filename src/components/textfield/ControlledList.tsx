import { CommandButton, IListProps, List, Stack, Text } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Weapon, WeaponMap } from "../create-character/CreateCharacter";
import { ControlledDropdown } from "./ControlledDropdown";
import { ControlledTextField } from "./ControlledTextField";
import { HookFormProps } from "./HookFormProps";

interface ControlledListProps {
  values: any;
  backgroundColor: string;
}

type WeaponForm = {
  name: string;
  modifier: string;
  die: string;
};

export const nameof = <T extends {}>(name: keyof T) => name;

export const ControlledList: React.FC<
  HookFormProps & IListProps & ControlledListProps
> = (props) => {
  const {
    handleSubmit: handleAddWeapon,
    getValues,
    formState,
    setValue,
    control: controlWeapon,
  } = useForm<WeaponForm, any>({
    defaultValues: {
      name: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

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
        <>
          <Stack
            horizontal
            style={{
              marginTop: 0,
            }}
          >
            <CommandButton
              style={{
                transform: "translateY(25px)",
              }}
              disabled={!formState.isValid}
              iconProps={{ iconName: "Add" }}
              onClick={() => {
                console.log(value);
                handleAddWeapon(
                  (data) => {
                    const skillBonus: number = props.values[data.modifier];
                    const skillRaw: string = data.modifier.replace(
                      "Modifier",
                      ""
                    );
                    const skill: string =
                      skillRaw.charAt(0).toUpperCase() + skillRaw.slice(1);

                    const newVal = {
                      ...value,
                      [`${data.name} (${skill})`]: {
                        name: `${data.name} (${skill})`,
                        bonus: props.values["proficiencyModifier"] + skillBonus,
                        skill: data.modifier,
                        die: data.die,
                        modifier: skillBonus > 0 ? skillBonus : 0,
                      },
                    };
                    onChange(newVal);
                  },
                  (_err: any) => {}
                )();
              }}
            />
            <Stack
              horizontal
              tokens={{
                childrenGap: 10,
              }}
            >
              <ControlledTextField
                onError={() => console.log("error")}
                label="Name"
                autoComplete="off"
                control={controlWeapon}
                maxLength={12}
                minLength={1}
                style={{
                  width: 125,
                }}
                name={nameof<WeaponForm>("name")}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/i,
                    message: "This is not a valid wepon name",
                  },
                  required: "Weapon name required",
                }}
              />

              <ControlledDropdown
                onError={() => console.log("error")}
                label="Modifier"
                control={controlWeapon}
                name={nameof<WeaponForm>("modifier")}
                options={[
                  { key: "strengthModifier", text: "Strength" },
                  { key: "dexterityModifier", text: "Dexterity" },
                  { key: "constitutionModifier", text: "Constitution" },
                  { key: "intelligenceModifier", text: "Intelligence" },
                  { key: "wisdomModifier", text: "Wisdom" },
                  { key: "charismaModifier", text: "Charisma" },
                ]}
                styles={{
                  root: {
                    width: 120,
                    marginBottom: 20,
                  },
                }}
                rules={{
                  required: "This field is required",
                }}
              />

              <ControlledDropdown
                onError={() => console.log("error")}
                label="Die"
                control={controlWeapon}
                name={nameof<WeaponForm>("die")}
                options={[
                  { key: "1d4", text: "1d4" },
                  { key: "1d6", text: "1d6" },
                  { key: "1d8", text: "1d8" },
                  { key: "1d10", text: "1d10" },
                  { key: "1d12", text: "1d12" },
                  { key: "1d20", text: "1d20" },
                  { key: "2d6", text: "2d6" },
                ]}
                styles={{
                  root: {
                    width: 75,
                    marginBottom: 20,
                  },
                }}
                rules={{
                  required: "This field is required",
                }}
              />
            </Stack>
          </Stack>
          {Object.keys(value).length > 0 && (
            <Stack
              horizontal
              style={{
                marginTop: 0,
              }}
            >
              <div
                style={{
                  width: "36px",
                }}
              />
              <Stack
                horizontal
                style={{
                  width: "100%",
                  padding: "0px 28px 0px 8px",
                }}
              >
                <Text
                  variant={"medium"}
                  nowrap
                  style={{
                    width: "calc(100% / 3)",
                    lineHeight: "32px",
                  }}
                >
                  Name
                </Text>
                <Text
                  variant={"medium"}
                  nowrap
                  style={{
                    width: "calc(100% / 3)",
                    lineHeight: "32px",
                  }}
                >
                  Attack Bonus
                </Text>
                <Text
                  variant={"medium"}
                  nowrap
                  style={{
                    width: "calc(100% / 3)",
                    lineHeight: "32px",
                  }}
                >
                  Damage/Type
                </Text>
              </Stack>
            </Stack>
          )}
          <List
            style={{
              marginTop: 0,
            }}
            {...props}
            onRenderCell={(
              item: any,
              _index: number | undefined
            ): JSX.Element => {
              return (
                <Stack horizontal>
                  <CommandButton
                    style={{
                      transform: "translateY(-4px)",
                    }}
                    iconProps={{ iconName: "Cancel" }}
                    onClick={() => {
                      const newVal = value;
                      delete newVal[item.name];
                      onChange(newVal);
                    }}
                  />
                  <Stack
                    horizontal
                    style={{
                      borderRadius: "2px",
                      height: "32px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      backgroundColor: props.backgroundColor,
                      borderColor:
                        props.backgroundColor === "#121212"
                          ? "rgb(234, 234, 234)"
                          : "rgb(55, 55, 55)",
                      width: "100%",
                      padding: "0px 28px 0px 8px",
                    }}
                  >
                    <Text
                      variant={"medium"}
                      nowrap
                      style={{
                        width: "calc(100% / 3)",
                        lineHeight: "32px",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      variant={"medium"}
                      nowrap
                      style={{
                        width: "calc(100% / 3)",
                        lineHeight: "32px",
                      }}
                    >
                      +{item.bonus}
                    </Text>
                    <Text
                      variant={"medium"}
                      nowrap
                      style={{
                        width: "calc(100% / 3)",
                        lineHeight: "32px",
                      }}
                    >
                      {item.die}+{item.modifier}
                    </Text>
                  </Stack>
                </Stack>
              );
            }}
            items={Array.from(Object.values(value))}
          />
        </>
      )}
    />
  );
};
