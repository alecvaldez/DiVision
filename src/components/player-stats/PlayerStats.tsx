import { List, Stack, Text } from "@fluentui/react";
import { ReactElement, ReactNode } from "react";
import { setSelectedWeapon } from "../../firebase/FirebaseUtils";
import { CharacterForm } from "../create-character/CreateCharacter";
import {StyledStack as SS } from "../master-view/MasterView";

interface PlayerStatsProps {
  character: CharacterForm;
  backgroundColor: string;
  primaryColor: string;
  gameKey: string;
  uid: string;
}

export const StyledStack: React.FC<{
  children: ReactNode;
  backgroundColor: string;
  width: string;
  height: string;
  padding: string;
}> = ({ children, backgroundColor, width, padding, height }) => (
  <Stack
    horizontal
    style={{
      borderRadius: "2px",
      height: height,
      borderWidth: "1px",
      borderStyle: "solid",
      backgroundColor: backgroundColor,
      marginBottom: 8,
      marginLeft: "auto",
      marginRight: "auto",
      borderColor:
        backgroundColor === "#121212"
          ? "rgb(234, 234, 234)"
          : "rgb(55, 55, 55)",
      width: width,
      padding: padding,
    }}
  >
    {children}
  </Stack>
);



const Section: React.FC<{
  backgroundColor: string;
  name: string;
  modifier: number;
  score: number;
}> = ({ backgroundColor, name, modifier, score}) => (
  <>
    <Text
      variant={"large"}
      
      block
      
      style={{
        marginBottom: 8,
        fontWeight: 600
      }}
    >
      {name}
    </Text>

    <Stack
      horizontal
      style={{
        alignItems: "center",
      }}
      tokens={{
        childrenGap: 10,
      }}
    >
      <Stack>
        <Text
          variant={"medium"}
          style={{
            marginBottom: 5,
          }}
        >
          Score
        </Text>
        <StyledStack padding="0" width="32px" height="32px" backgroundColor={backgroundColor}>
          <Text
            variant={"small"}
            style={{
              lineHeight: "32px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {score}
          </Text>
        </StyledStack>
      </Stack>
      <Stack>
        <Text
          variant={"medium"}
          style={{
            marginBottom: 5,
          }}
        >
          Modifier
        </Text>
        <StyledStack padding="0" width="32px" height="32px" backgroundColor={backgroundColor}>
          <Text
            variant={"small"}
            style={{
              lineHeight: "32px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {modifier}
          </Text>
        </StyledStack>
      </Stack>
    </Stack>
  </>
);

const PlayerStats: React.FC<PlayerStatsProps> = ({
  character,
  backgroundColor,
  primaryColor,
  gameKey,
  uid
}: PlayerStatsProps) => {
  return (
      <Stack tokens={{
          childrenGap: 20
      }}>
          <Text variant="xxLarge" nowrap>
            {character.name}
          </Text>
    <Stack
      horizontal
      tokens={{
        childrenGap: 40,
      }}
    >
      <Stack
        style={{
          width: 200,
          height: 250,
          overflowY: "auto"
        }}
      >
        <Section
          backgroundColor={backgroundColor}
          score={character.strengthScore}
          modifier={character.strengthModifier}
          name={"Strength"}
        />
        <Section
          backgroundColor={backgroundColor}
          score={character.dexterityScore}
          modifier={character.dexterityModifier}
          name={"Dexterity"}
        />
        <Section
          backgroundColor={backgroundColor}
          score={character.constitutionScore}
          modifier={character.constitutionModifier}
          name={"Constitution"}
        />
        <Section
          backgroundColor={backgroundColor}
          score={character.intelligenceScore}
          modifier={character.intelligenceModifier}
          name={"Intelligence"}
        />
        <Section
          backgroundColor={backgroundColor}
          score={character.charismaScore}
          modifier={character.charismaModifier}
          name={"Charisma"}
        />
      </Stack>
      <Stack
        style={{
          marginTop: 0,
          width: "100%",
          overflowX: "auto"
        }}
      >
        <Text variant={"xLarge"} nowrap>
          Weapons
        </Text>
        <Stack horizontal>
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
        <List
          style={{
            marginTop: 0,
          }}
          onRenderCell={(
            item: any,
            _index: number | undefined
          ): JSX.Element => {
            return (
              <SS
              padding="0px 28px 0px 8px"
              width={"100%"}
              backgroundColor={backgroundColor}
              primaryColor={primaryColor}
              selected={item.name === character.selectedWeapon}
              clickCallback={() => {
                setSelectedWeapon(gameKey, item.name, uid);
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
              </SS>
            );
          }}
          items={Array.from(Object.values(character.weapons))}
        />
      </Stack>
    </Stack>
    </Stack>

  );
};

export default PlayerStats;
