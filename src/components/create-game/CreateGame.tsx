import {
    ContextualMenu,
    DefaultEffects,
    DirectionalHint,
    FontIcon,
    Icon,
    IconButton,
    IContextualMenuItem,
    IPersonaSharedProps,
    IStackTokens,
    Persona,
    PersonaPresence,
    PersonaSize,
    PrimaryButton,
    Stack,
    Text,
} from "@fluentui/react";
import { getAuth, User } from "firebase/auth";
import React, { ReactElement, useEffect } from "react";
import {
    Navigate,
    NavigateFunction,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import TitleBar from "../title-bar/TitleBar";
import "./CreateGame.css";

interface CreateGameProps {
    user: User | null;
}

const verticalGapStackTokens: IStackTokens = {
    childrenGap: 40,
    padding: 10,
};

const CreateGame: React.FC<CreateGameProps> = ({
    user
}: CreateGameProps) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (user == null) {
            navigate("/login");
        }
    }, [user]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                width: "100vw",
                height: "100vh",
                zIndex: 100,
                alignItems: "center",
                top: "3.5rem",
                overflowY: "auto"
            }}
        >
            {user !== null && (
                <div
                    style={{
                        display: "flex",
                        width: "100vw",
                        height: "100vh",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="create-account-card">
                        <Stack
                            style={{ width: "100%", zIndex: 1000 }}
                            tokens={verticalGapStackTokens}
                        >
                            <Text variant={"xxLarge"} nowrap block>
                                Create Game
                            </Text>
                        </Stack>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGame;
