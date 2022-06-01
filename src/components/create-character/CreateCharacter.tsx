import {
  CommandButton,
  DefaultEffects,
  Dropdown,
  IStackTokens,
  List,
  PrimaryButton,
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
import { addCharacterToGame } from "../../firebase/FirebaseUtils";
import { ControlledDropdown } from "../textfield/ControlledDropdown";
import { ControlledList } from "../textfield/ControlledList";
import { ControlledSpinButton } from "../textfield/ControlledSpinButton";
import { ControlledTextField } from "../textfield/ControlledTextField";

interface CreateCharacterProps {
  user: User | null;
  gameId: string;
  backgroundColor: string;
  callback: () => void;
}

export interface Weapon {
  name: string;
  skill:
    | "strengthModifier"
    | "dexterityModifier"
    | "constitutionModifier"
    | "intelligenceModifier"
    | "wisdomModifier"
    | "charismaModifier";
  bonus: number;
  die: string; // 1d6
  modifier: number;
}

export interface WeaponMap {
  [key: string]: Weapon;
}

export type CharacterForm = {
  name: string;
  proficiencyModifier: number;
  strengthScore: number;
  strengthModifier: number;
  dexterityScore: number;
  dexterityModifier: number;
  constitutionScore: number;
  constitutionModifier: number;
  intelligenceScore: number;
  intelligenceModifier: number;
  wisdomScore: number;
  wisdomModifier: number;
  charismaScore: number;
  charismaModifier: number;
  weapons: WeaponMap;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const CreateCharacter: React.FC<CreateCharacterProps> = ({
  user,
  gameId,
  backgroundColor,
  callback,
}: CreateCharacterProps) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState(false);

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const checkOverflow = (): boolean => {
    return primaryRef.current.offsetHeight < cardRef.current.offsetHeight;
  };

  const {
    handleSubmit: handleCreateCharacter,
    getValues,
    formState,
    setValue,
    control: controlCharacter,
  } = useForm<CharacterForm, any>({
    defaultValues: {
      name: "",
      proficiencyModifier: 2,
      strengthScore: 10,
      strengthModifier: 0,
      dexterityScore: 10,
      dexterityModifier: 0,
      constitutionScore: 10,
      constitutionModifier: 0,
      intelligenceScore: 10,
      intelligenceModifier: 0,
      wisdomScore: 10,
      wisdomModifier: 0,
      charismaScore: 10,
      charismaModifier: 0,
      weapons: {},
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const watch = useWatch({ control: controlCharacter });

  const strengthWatch = useWatch({
    control: controlCharacter,
    name: "strengthModifier",
  });
  const dexterityhWatch = useWatch({
    control: controlCharacter,
    name: "dexterityModifier",
  });
  const constitutionWatch = useWatch({
    control: controlCharacter,
    name: "constitutionModifier",
  });
  const intelligenceWatch = useWatch({
    control: controlCharacter,
    name: "intelligenceModifier",
  });
  const widsomWatch = useWatch({
    control: controlCharacter,
    name: "wisdomModifier",
  });
  const charismaWatch = useWatch({
    control: controlCharacter,
    name: "charismaModifier",
  });
  const proficiencyWatch = useWatch({
    control: controlCharacter,
    name: "proficiencyModifier",
  });

  useEffect(() => {
    const values = getValues();
    if (
      formState.isValid &&
      values["name"].length > 0 &&
      Object.keys(values["weapons"]).length > 0
    ) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [watch]);

  useEffect(() => {
    const weapons: WeaponMap = { ...getValues()["weapons"] };
    Object.values(weapons).forEach((weapon) => {
      const val = getValues();
      const modifier = val[weapon.skill];
      const proficiencyModifier = val["proficiencyModifier"];
      weapon.bonus = proficiencyModifier + modifier;
      weapon.modifier = modifier > 0 ? modifier : 0;
    });

    setValue("weapons", weapons);
  }, [
    strengthWatch,
    dexterityhWatch,
    constitutionWatch,
    intelligenceWatch,
    widsomWatch,
    charismaWatch,
    proficiencyWatch,
  ]);

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
        console.log(data);
        setLoading(true);
        addCharacterToGame(gameId, data).then(() => {
          setCreateError(false);
          setLoading(false);
          navigate(`/game/${gameId}`);
        });
      },
      (_err: any) => {
        setCreateError(true);
      }
    )();
  };

  return (
    <div className="primary-div" ref={primaryRef}>
      <div className="secondary-div">
        {user !== null && (
          <div
            className="card"
            ref={cardRef}
            style={{
              boxShadow: DefaultEffects.elevation16,
              width: "clamp(20rem, 90vw, 60rem)",
            }}
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
                    <ControlledDropdown
                      onError={() => console.log("error")}
                      label="Proficiency Bonus"
                      control={controlCharacter}
                      name={nameof<CharacterForm>("proficiencyModifier")}
                      options={[
                        { key: 2, text: "2" },
                        { key: 3, text: "3" },
                        { key: 4, text: "4" },
                        { key: 5, text: "5" },
                        { key: 6, text: "6" },
                      ]}
                      styles={{
                        root: {
                          width: 190,
                          marginBottom: 20,
                        },
                      }}
                      rules={{
                        pattern: {
                          value: /^[2-6]$/i,
                          message: "This is not a valid proficiency bonus",
                        },
                        required: "This field is required",
                      }}
                    />

                    <Text
                      variant={"xLarge"}
                      nowrap
                      style={{
                        marginTop: 30,
                      }}
                    >
                      Strength
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("strengthScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("strengthModifier")}
                        rules={{
                          pattern: {
                            value: /^[-5-5]$/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
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
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("dexterityScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("dexterityModifier")}
                        rules={{
                          pattern: {
                            value: /^[(-5)-5]$/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
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
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("constitutionScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("constitutionModifier")}
                        rules={{
                          pattern: {
                            value: /^\d/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
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
                    <Text
                      variant={"xLarge"}
                      nowrap
                      style={{
                        marginTop: 20,
                      }}
                    >
                      Intelligence
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("intelligenceScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("intelligenceModifier")}
                        rules={{
                          pattern: {
                            value: /^[-5-5]$/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
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
                    <Text
                      variant={"xLarge"}
                      nowrap
                      style={{
                        marginTop: 20,
                      }}
                    >
                      Wisdom
                    </Text>
                    <Stack
                      horizontal
                      style={{
                        alignItems: "center",
                      }}
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("wisdomScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("wisdomModifier")}
                        rules={{
                          pattern: {
                            value: /^[-5-5]$/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
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
                      tokens={{
                        childrenGap: 20,
                      }}
                    >
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("charismaScore")}
                        rules={{
                          pattern: {
                            value: /^[1-20]$/i,
                            message: "This is not a valid score",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Score"
                        min={1}
                        max={20}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                      <ControlledSpinButton
                        name={nameof<CharacterForm>("charismaModifier")}
                        rules={{
                          pattern: {
                            value: /^[-5-5]$/i,
                            message: "This is not a valid modifier",
                          },
                          required: "This field is required",
                        }}
                        control={controlCharacter}
                        label="Modifier"
                        min={-5}
                        max={5}
                        step={1}
                        incrementButtonAriaLabel="Increase value by 1"
                        decrementButtonAriaLabel="Decrease value by 1"
                        styles={{
                          spinButtonWrapper: {
                            width: 75,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  style={{
                    width: "100%",
                    float: "right",
                  }}
                  tokens={{
                    childrenGap: 30,
                  }}
                >
                  <ControlledTextField
                    onKeyDown={keyDown}
                    onError={() => console.log("error")}
                    label="Name"
                    autoComplete="off"
                    control={controlCharacter}
                    maxLength={15}
                    minLength={1}
                    name={nameof<CharacterForm>("name")}
                    rules={{
                      pattern: {
                        value: /^[a-zA-Z0-9]+$/i,
                        message: "This is not a valid character name",
                      },
                      required: "This field is required",
                    }}
                  />
                  <Text variant={"xLarge"} nowrap>
                    Weapons
                  </Text>
                  <ControlledList
                    proficiencyModifier={getValues()["proficiencyModifier"]}
                    strengthModifier={getValues()["strengthModifier"]}
                    dexterityModifier={getValues()["dexterityModifier"]}
                    constitutionModifier={getValues()["constitutionModifier"]}
                    intelligenceModifier={getValues()["intelligenceModifier"]}
                    wisdomModifier={getValues()["wisdomModifier"]}
                    charismaModifier={getValues()["charismaModifier"]}
                    name={nameof<CharacterForm>("weapons")}
                    backgroundColor={backgroundColor}
                    control={controlCharacter}
                  />
                </Stack>
              </Stack>

              {createError ? (
                <Text
                  className="error-text"
                  style={{
                    margin: 0,
                  }}
                  block
                  variant="large"
                >
                  There was an error creating your character
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
                  Create
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
