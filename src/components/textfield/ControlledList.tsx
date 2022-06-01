import { CommandButton, IListProps, List, Stack, Text } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Weapon, WeaponMap } from "../create-character/CreateCharacter";
import { HookFormProps } from "./HookFormProps";

interface ControlledListProps {
  proficiencyModifier: number;
  strengthModifier: number;
  dexterityModifier: number;
  constitutionModifier: number;
  intelligenceModifier: number;
  wisdomModifier: number;
  charismaModifier: number;
  backgroundColor: string;
}

interface WeaponRaw {
  name: string;
  skill: string;
  die: string;
}

const WEAPONS: { [key: string]: WeaponRaw } = {
  ["Mace (Strength)"]: {
    name: "Mace (Strength)",
    skill: "strengthModifier",
    die: "1d6",
  },
  ["Shortsword (Strength)"]: {
    name: "Shortsword (Strength)",
    skill: "strengthModifier",
    die: "1d6",
  },
  ["Shortsword (Dexterity)"]: {
    name: "Shortsword (Dexterity)",
    skill: "dexterityModifier",
    die: "1d6",
  },
  ["Thorn Whip (Wisdom)"]: {
    name: "Thorn Whip (Wisdom)",
    skill: "wisdomModifier",
    die: "1d6",
  },
  ["Thorn Whip (Intelligence)"]: {
    name: "Thorn Whip (Intelligence)",
    skill: "intelligenceModifier",
    die: "1d6",
  },
};

export const ControlledList: React.FC<
  HookFormProps & IListProps & ControlledListProps
> = (props) => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponRaw>({
    name: "",
    skill: "",
    die: "1d6",
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
          <Stack horizontal>
            <CommandButton
              style={{
                transform: "translateY(-4px)",
              }}
              disabled={
                selectedWeapon.name === "" ||
                value[selectedWeapon.name] !== undefined
              }
              iconProps={{ iconName: "Add" }}
              onClick={() => {
                let skillBonus: number = 0;
                switch (selectedWeapon.skill) {
                  case "strengthModifier":
                    skillBonus = +props.strengthModifier;
                    break;
                  case "dexterityModifier":
                    skillBonus = props.dexterityModifier;
                    break;
                  case "constitutionModifier":
                    skillBonus = props.constitutionModifier;
                    break;
                  case "intelligenceModifier":
                    skillBonus = props.intelligenceModifier;
                    break;
                  case "wisdomModifier":
                    skillBonus = props.wisdomModifier;
                    break;
                  case "charismaModifier":
                    skillBonus = props.charismaModifier;
                    break;
                  default:
                    skillBonus = 0;
                    break;
                }
                const newVal = {
                  ...value,
                  [selectedWeapon.name]: {
                    name: selectedWeapon.name,
                    bonus: props.proficiencyModifier + skillBonus,
                    skill: selectedWeapon.skill,
                    die: "1d6",
                    modifier: skillBonus > 0 ? skillBonus : 0,
                  },
                };
                onChange(newVal);
              }}
            />
            <Dropdown
              options={Object.values(WEAPONS).map((weapon) => {
                return {
                  key: weapon.name,
                  text: weapon.name,
                };
              })}
              styles={{
                root: {
                  width: "100%",
                },
              }}
              onChange={(_evt, op, _i) => {
                if (op) setSelectedWeapon(WEAPONS[op.text]);
              }}
            />
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
