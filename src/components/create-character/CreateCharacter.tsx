import {
  CommandButton,
  DefaultEffects,
  DetailsListLayoutMode,
  IStackTokens,
  PrimaryButton,
  SelectionMode,
  SpinButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ControlledTextField } from "../textfield/ControlledTextField";
import {
  EditableGrid,
  EditControlType,
  IColumnConfig,
  EventEmitter,
  EventType,
  NumberAndDateOperators,
  StringOperators,
} from "fluentui-editable-grid";

interface CreateCharacterProps {
  user: User | null;
  gameId: string;
  callback: () => void;
}

interface Weapon {
  name: string;
  bonus: number;
  die: string; // 1d6
  modifier: number;
}
type Form = {
  name: string;
  strength: [number, number];
  dexterity: [number, number];
  constitution: [number, number];
  intelligence: [number, number];
  wisdom: [number, number];
  charisma: [number, number];
  proficiencyModifier: number;
  weapons: Array<Weapon>;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const CreateCharacter: React.FC<CreateCharacterProps> = ({
  user,
  gameId,
  callback,
}: CreateCharacterProps) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [weapons, setWeapons] = useState([]);

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const checkOverflow = (): boolean => {
    return primaryRef.current.offsetHeight < cardRef.current.offsetHeight;
  };

  const columns: IColumnConfig[] = [
    {
      key: "name",
      text: "Name",
      name: "Name",
      minWidth: 100,
      editable: true,
      dataType: "string",
      isResizable: true,
      includeColumnInExport: true,
      includeColumnInSearch: true,
      applyColumnFilter: true,
    },
    {
      key: "bonus",
      text: "Bonus",
      name: "Bonus",
      minWidth: 100,
      editable: true,
      dataType: "number",
      isResizable: true,
      includeColumnInExport: true,
      includeColumnInSearch: true,
      applyColumnFilter: true,
    },
    {
      key: "die",
      text: "Die",
      editable: true,
      name: "Die",
      minWidth: 100,
      dataType: "string",
      isResizable: true,
      includeColumnInExport: true,
      includeColumnInSearch: true,
      // inputType: EditControlType.MultilineTextField,
      applyColumnFilter: true,
    },
    {
      key: "modifier",
      text: "Modifier",
      editable: true,
      name: "Modifier",
      minWidth: 100,
      dataType: "number",
      isResizable: true,
      includeColumnInExport: true,
      includeColumnInSearch: true,
      // inputType: EditControlType.MultilineTextField,
      applyColumnFilter: true,
    },
  ];

  const {
    handleSubmit: handleCreateCharacter,
    getValues,
    formState,
    control: controlCharacter,
  } = useForm<Form, any>({
    defaultValues: {
      name: "",
      strength: [0, 0],
      dexterity: [0, 0],
      constitution: [0, 0],
      intelligence: [0, 0],
      wisdom: [0, 0],
      charisma: [0, 0],
      weapons: [],
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const watch = useWatch({ control: controlCharacter });

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (checkOverflow()) {
      cardRef.current.style.top = "0";
    } else {
      cardRef.current.style.top = "auto";
    }
  }, []);

  // useEffect(() => {
  //   const values = getValues();
  //   if (formState.isValid && values["gameId"].length == 5) {
  //     setIsEditing(true);
  //   } else {
  //     setIsEditing(false);
  //   }
  // }, [watch]);

  const goBack = (): void => {
    navigate(-1);
  };

  const keyDown = (e: any) => {
    if (e.key === "Enter") {
      createCharacter();
    }
  };

  const createCharacter = () => {
    handleCreateCharacter(
      (data) => {
        // setLoading(true);
        // getGame(gameKey).then((snapshot) => {
        //   if (snapshot.exists()) {
        //     setJoinError(false);
        //     addGameToUser(gameKey);
        //     callback();
        //     addPlayerToGame(gameKey).then(() => {
        //       navigate(`/game/${gameKey}`);
        //     });
        //   } else {
        //     setJoinError(true);
        //   }
        //   setLoading(false);
        // });
      },
      (err) => {}
    )();
  };

  return (
    <div className="primary-div" ref={primaryRef}>
      <div className="secondary-div">
        {user !== null && (
          <div
            className="card"
            ref={cardRef}
            style={{ boxShadow: DefaultEffects.elevation16 }}
          >
            <Stack
              style={{ width: "100%", zIndex: 1000 }}
              tokens={verticalGapStackTokens}
            >
              <div
                style={{
                  display: "inline-block",
                }}
              >
                <Text variant={"xxLarge"} nowrap>
                  Create Character
                </Text>
                <Text
                  variant={"large"}
                  nowrap
                  style={{ float: "right", lineHeight: "37px" }}
                >
                  {gameId}
                </Text>
              </div>

              <ControlledTextField
                onKeyDown={keyDown}
                onError={() => console.log("error")}
                label="Name"
                autoComplete="off"
                control={controlCharacter}
                maxLength={15}
                minLength={1}
                name={nameof<Form>("name")}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/i,
                    message: "This is not a valid character name",
                  },
                  required: "This field is required",
                }}
              />

              <Stack
                horizontal
                tokens={{
                  childrenGap: 40,
                }}
              >
                <Stack>
                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Strength
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Dexterity
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Constitution
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Intelligence
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Wisdom
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack
                    style={{
                      width: 200,
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Charisma
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <SpinButton
                        label="Score"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <SpinButton
                        label="Modifier"
                        defaultValue="0"
                        min={0}
                        max={100}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          root: {
                            float: "right",
                          },
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack>
                  <Text variant={"xLarge"} nowrap>
                    Weapons
                  </Text>

                  <EditableGrid
                    id={1}
                    columns={columns}
                    items={[]}
                    enableCellEdit={true}
                    enableExport={true}
                    enableTextFieldEditMode={true}
                    enableTextFieldEditModeCancel={true}
                    enableGridRowsDelete={true}
                    enableGridRowsAdd={true}
                    height={"70vh"}
                    width={"140vh"}
                    position={"relative"}
                    enableUnsavedEditIndicator={true}
                    onGridSave={() => {}}
                    enableGridReset={true}
                    enableColumnFilters={true}
                    enableColumnFilterRules={true}
                    enableRowAddWithValues={{
                      enable: true,
                      enableRowsCounterInPanel: true,
                    }}
                    // layoutMode={DetailsListLayoutMode.justified}
                    // selectionMode={SelectionMode.multiple}
                    enableRowEdit={true}
                    enableRowEditCancel={true}
                    enableBulkEdit={true}
                    enableColumnEdit={true}
                    enableSave={true}
                  />
                </Stack>
              </Stack>

              {joinError ? (
                <Text
                  className="error-text"
                  style={{
                    margin: 0,
                  }}
                  block
                  variant="large"
                >
                  Invalid Game ID
                </Text>
              ) : (
                <Stack style={{ height: "64px", margin: 0 }}> </Stack>
              )}
              <Stack
                horizontal
                style={{
                  marginTop: 30,
                  height: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  bottom: 0,
                }}
                tokens={{
                  childrenGap: 10,
                }}
              >
                <CommandButton
                  iconProps={{ iconName: "SkypeArrow" }}
                  text="Back"
                  onClick={goBack}
                />
                {loading && (
                  <Spinner
                    style={{
                      marginLeft: "auto",
                    }}
                    size={SpinnerSize.large}
                  />
                )}
                <PrimaryButton
                  disabled={!isEditing}
                  onClick={createCharacter}
                  style={{
                    height: "38px",
                  }}
                >
                  Join
                </PrimaryButton>
              </Stack>
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCharacter;
