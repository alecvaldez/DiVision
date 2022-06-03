import { CommandButton, Stack, TextField, Text, List } from "@fluentui/react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Enemy } from "../../App";
import { addEnemy, deleteEnemy, setSelectedEnemy } from "../../firebase/FirebaseUtils";
import { StyledStack } from "../master-view/MasterView";
import { ControlledTextField } from "../textfield/ControlledTextField";

interface EnemiesListProps {
  backgroundColor: string;
  primaryColor: string;
  enemies: { [key: string]: Enemy };
  gameKey: string;
  selectedEnemy: string;
}

type EnemyForm = {
  name: string;
  hp: number;
  ac: number;
};

export const nameof = <T extends {}>(name: keyof T) => name;

const EnemiesList: React.FC<EnemiesListProps> = ({
  backgroundColor,
  primaryColor,
  gameKey,
  enemies,
  selectedEnemy
}: EnemiesListProps) => {

  const {
    handleSubmit: handleCreateEnemy,
    getValues,
    formState,
    setValue,
    control: controlEnemy,
  } = useForm<EnemyForm, any>({
    defaultValues: {
      name: "",
      hp: 0,
      ac: 0,
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const createEnemy = () => {
    handleCreateEnemy(
      (data) => {
        addEnemy(gameKey, data);
      },
      (err) => {}
    )();
  };

  return (
    <Stack>
      <Stack horizontal>
        <CommandButton
          style={{
            transform: "translateY(25px)",
          }}
          iconProps={{ iconName: "Add" }}
          disabled={!formState.isValid}
          onClick={createEnemy}
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
            control={controlEnemy}
            maxLength={18}
            minLength={1}
            name={nameof<EnemyForm>("name")}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9]+$/i,
                message: "This is not a valid enemy name",
              },
              required: "Enemy name is required",
            }}
          />

          <ControlledTextField
            onError={() => console.log("error")}
            label="HP"
            autoComplete="off"
            control={controlEnemy}
            maxLength={4}
            minLength={1}
            name={nameof<EnemyForm>("hp")}
            rules={{
              pattern: {
                value: /^\d+$/i,
                message: "Error",
              },
              required: "Error",
            }}
            style={{
              width: 48,
            }}
          />

          <ControlledTextField
            onError={() => console.log("error")}
            label="AC"
            autoComplete="off"
            control={controlEnemy}
            maxLength={2}
            minLength={1}
            name={nameof<EnemyForm>("ac")}
            rules={{
              pattern: {
                value: /^\d+$/i,
                message: "Error",
              },
              required: "Error",
            }}
            style={{
              width: 32,
            }}
          />
        </Stack>
      </Stack>
      <Stack
        style={{
          height: 120,
          maxHeight: 120,
        }}
      >
        <List
          style={{
            marginTop: 0,
          }}
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
                    deleteEnemy(gameKey, item.name);
                  }}
                />
                <StyledStack
                  padding="0px 0px 0px 8px"
                  width={"100%"}
                  backgroundColor={backgroundColor}
                  primaryColor={primaryColor}
                  selected={item.name === selectedEnemy}
                  clickCallback={() => {
                    setSelectedEnemy(gameKey, item.name);
                  }}
                >
                  <Text
                    variant={"medium"}
                    nowrap
                    style={{
                      width: 185,
                      lineHeight: "32px",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    variant={"medium"}
                    nowrap
                    style={{
                      width: 45,
                      lineHeight: "32px",
                    }}
                  >
                    {item.hp}
                  </Text>
                  <Text
                    variant={"medium"}
                    nowrap
                    style={{
                      width: 24,
                      lineHeight: "32px",
                    }}
                  >
                    {item.ac}
                  </Text>
                </StyledStack>
              </Stack>
            );
          }}
          items={enemies && Array.from(Object.values(enemies))}
        />
      </Stack>
    </Stack>
  );
};

export default EnemiesList;
