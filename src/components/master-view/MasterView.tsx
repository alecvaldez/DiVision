import {
  Checkbox,
  Dropdown,
  IDropdownOption,
  IRenderFunction,
  ISelectableOption,
  List,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  Text,
} from "@fluentui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { getPersonaIntialsColor } from "../../App";
import {
  setSelectedPlayer,
  setSelectedRoll,
  setSelectedWeapon,
} from "../../firebase/FirebaseUtils";
import { CharacterForm } from "../create-character/CreateCharacter";
import { Player, PlayerMap } from "../game/Game";
import { ControlledDropdown } from "../textfield/ControlledDropdown";

interface PlayerStatsProps {
  characters: { [key: string]: CharacterForm };
  players: PlayerMap;
  backgroundColor: string;
  primaryColor: string;
  selectedPlayer: string;
  selectedRoll: string;
  gameKey: string;
}

type SelectForm = {
  character: string;
};

export function increase_brightness(hex: string, percent: number) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return (
    "#" +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
}

export const StyledStack: React.FC<{
  children: ReactNode;
  backgroundColor: string;
  width: string;
  padding: string;
  primaryColor: string;
  selected: boolean;
  clickCallback: () => void;
}> = ({
  children,
  backgroundColor,
  width,
  padding,
  primaryColor,
  selected,
  clickCallback,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Stack
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      horizontal
      style={{
        borderRadius: "2px",
        height: "32px",
        borderWidth: "1px",
        borderStyle: "solid",
        backgroundColor: hover
          ? increase_brightness(backgroundColor, 10)
          : backgroundColor,
        marginBottom: 8,
        marginLeft: "auto",
        marginRight: "auto",
        borderColor: selected
          ? primaryColor
          : backgroundColor === "#121212"
          ? "rgb(234, 234, 234)"
          : "rgb(55, 55, 55)",
        width: width,
        cursor: "pointer",
        padding: padding,
      }}
      onClick={clickCallback}
    >
      {children}
    </Stack>
  );
};

export const nameof = <T extends {}>(name: keyof T) => name;

const MasterView: React.FC<PlayerStatsProps> = ({
  characters,
  players,
  primaryColor,
  backgroundColor,
  selectedPlayer,
  selectedRoll,
  gameKey,
}: PlayerStatsProps) => {
  const onChangeSelectCharacter = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ): void => {
    setSelectedPlayer(gameKey, option?.data.uid);
  };

  const onChangeSelectRoll = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ): void => {
    if (option) setSelectedRoll(gameKey, option.key);
  };

  const characterSelection = useMemo(() => {
    return Object.entries(players).map(([id, player]) => {
      return {
        key: id,
        text: characters[id].name,
        data: { imageUrl: player.photoUrl, email: player.email, uid: id },
      };
    });
  }, [players, characters]);

  useEffect(() => {
    if (characterSelection.length == 1) {
      setSelectedPlayer(gameKey, characterSelection[0].key);
    }
  }, [characterSelection]);

  const onRenderOption = (props: any): JSX.Element => {
    return (
      <Stack horizontal>
        {props.data && (
          <Persona
            {...{
              imageUrl: props.data.imageUrl ? props.data.imageUrl : "",
              imageInitials: props.data.email.slice(0, 2).toUpperCase(),
              initialsColor: props.data.email
                ? getPersonaIntialsColor(props.data.email)
                : 0,
            }}
            presence={PersonaPresence.none}
            size={PersonaSize.size32}
            coinSize={25}
            styles={{
              root: {
                whiteSpace: "nowrap",
              },
            }}
            imageAlt=""
          />
        )}
        <span
          style={{
            transform: "translateY(2px)",
          }}
        >
          {props.text}
        </span>
      </Stack>
    );
  };

  return (
    <Stack
      horizontal
      tokens={{
        childrenGap: 50,
      }}
    >
      <Stack
        style={{
          width: 150,
        }}
      >
        <Text
          variant={"large"}
          block
          style={{
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Select Character
        </Text>
        <Dropdown
          onError={() => console.log("error")}
          options={characterSelection}
          styles={{
            root: {
              width: "100%",
              marginBottom: 20,
            },
          }}
          defaultSelectedKey={selectedPlayer}
          onChange={onChangeSelectCharacter}
          onRenderOption={onRenderOption}
        />
        {characters &&
          characters[selectedPlayer] &&
          characters[selectedPlayer].selectedWeapon && (
            <>
              <Text
                variant={"large"}
                block
                style={{
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Choose Roll
              </Text>
              <Dropdown
                onError={() => console.log("error")}
                defaultSelectedKey={selectedRoll}
                options={
                  characters && characters[selectedPlayer].selectedWeapon
                    ? [
                        {
                          key: `Roll 1 (+${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].bonus
                          })`,
                          text: `Roll 1 (+${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].bonus
                          })`,
                        },
                        {
                          key: `Roll 2 (${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].die
                          }+${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].modifier
                          })`,
                          text: `Roll 2 (${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].die
                          }+${
                            characters[selectedPlayer].weapons[
                              characters[selectedPlayer].selectedWeapon
                            ].modifier
                          })`,
                        },
                      ]
                    : []
                }
                onChange={onChangeSelectRoll}
                styles={{
                  root: {
                    width: "100%",
                    marginBottom: 20,
                  },
                }}
              />
            </>
          )}
      </Stack>

      <Stack
        style={{
          width: "calc(100% - 150px)",
        }}
      >
        <Text
          variant={"large"}
          block
          style={{
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Weapons
        </Text>

        <Stack
          horizontal
          style={{
            width: "100%",
            padding: "0px 28px 0px 8px",
            visibility:
              selectedPlayer && selectedPlayer === "" ? "hidden" : "visible",
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
        <Stack
          style={{
            overflow: "auto",
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
                <StyledStack
                  padding="0px 28px 0px 8px"
                  width={"100%"}
                  backgroundColor={backgroundColor}
                  primaryColor={primaryColor}
                  selected={
                    characters
                      ? item.name === characters[selectedPlayer].selectedWeapon
                      : false
                  }
                  clickCallback={() => {
                    setSelectedWeapon(gameKey, item.name, selectedPlayer);
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
                </StyledStack>
              );
            }}
            items={
              selectedPlayer
                ? Array.from(Object.values(characters[selectedPlayer].weapons))
                : []
            }
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MasterView;
