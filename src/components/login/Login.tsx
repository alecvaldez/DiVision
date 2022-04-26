import React, { useState } from "react";
import "./Login.css";
import {
  Stack,
  IStackTokens,
  Dialog,
  DialogFooter,
  Callout,
} from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { DefaultEffects } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Text } from "@fluentui/react/lib/Text";
import {
  firebaseEmailCreate,
  firebaseEmailSigin,
} from "../../firebase/FirebaseUtils";
import { Controller, DeepMap, FieldError, useForm } from "react-hook-form";
import { ControlledTextField } from "../textfield/ControlledTextField";
import { useBoolean, useId } from "@fluentui/react-hooks";

const stackTokens: IStackTokens = { childrenGap: 40 };

type Form = {
  email: string;
  password: string;
};

export const nameof = <T extends {}>(name: keyof T) => name;

const Login: React.FC<{}> = () => {
  const [siginClass, setSiginClass] = useState("main-div");
  const [createClass, setCreateClass] = useState("main-div");
  const [siginError, setSiginError] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const [sigin, setSigin] = useState(true);

  const [validSiginFormData, setValidSiginFormData] = useState<Form>();
  const [validAccountFormData, setValidAccountFormData] = useState<Form>();

  const [siginValidationError, setSiginValidationError] =
    useState<DeepMap<Form, FieldError>>();

  const [accountValidationError, setAccountValidationError] =
    useState<DeepMap<Form, FieldError>>();

  const {
    handleSubmit: handleSubmitAccount,
    control: controlAccount,
    setValue: setAccountValue,
  } = useForm<Form, any>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const {
    handleSubmit: handleSubmitSigin,
    control: controlSigin,
    setValue: setSiginValue,
  } = useForm<Form, any>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const slideCreate = () => {
    setSiginClass("main-div slideOut");
    setCreateClass("main-div slideIn");
    setTimeout(() => {
      setSigin(!sigin);
      setSiginClass("main-div");
    }, 200);
  };

  const slideSigin = () => {
    setCreateClass("main-div slideOut");
    setSiginClass("main-div slideIn");
    setTimeout(() => {
      setSigin(!sigin);
      setCreateClass("main-div");
    }, 200);
  };

  const onSignIn = () => {
    setSiginValidationError(undefined);
    setValidSiginFormData(undefined);

    handleSubmitSigin(
      (data) => {
        setValidSiginFormData(data);
        firebaseEmailSigin(data.email, data.password).then((bool) => {
          setSiginError(bool);
        });
      },
      (err) => {
        setSiginValidationError(undefined);
      }
    )();
  };

  const onCreateAccount = () => {
    setAccountValidationError(undefined);
    setValidAccountFormData(undefined);

    handleSubmitAccount(
      (data) => {
        setValidAccountFormData(data);
        firebaseEmailCreate(data.email, data.password).then((bool) => {
          setAccountError(bool);
        });
      },
      (err) => {
        console.log(err);
        setAccountValidationError(undefined);
      }
    )();
  };

  return (
    <div
      className="backdrop"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {sigin ? (
        <div
          className={siginClass}
          style={{ boxShadow: DefaultEffects.elevation16 }}
        >
          <form>
            <Stack tokens={stackTokens}>
              <Text variant={"xxLarge"} nowrap block>
                Sign In
              </Text>
              <ControlledTextField
                required={true}
                label="Email"
                control={controlSigin}
                name={nameof<Form>("email")}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "This is not a valid email address",
                  },
                  required: "This field is required",
                }}
              />
              <ControlledTextField
                required={true}
                label="Password"
                control={controlSigin}
                name={nameof<Form>("password")}
                type="password"
                canRevealPassword
                revealPasswordAriaLabel="Show password"
                rules={{ required: "This field is required" }}
              />
              <Stack horizontal>
                <PrimaryButton
                  text="Sign In"
                  onClick={onSignIn}
                  allowDisabledFocus
                />
              </Stack>
              {siginError ? (
                <Text className="error-text" block variant="large">
                  Incorrect email or password
                </Text>
              ) : (
                <Stack style={{ height: "64px", margin: 0 }}> </Stack>
              )}
              <Text variant={"medium"} nowrap block>
                Don't have an account?{" "}
                <a className="link" onClick={slideCreate}>
                  Create one!
                </a>
              </Text>
            </Stack>
          </form>
        </div>
      ) : (
        <div
          className={createClass}
          style={{ boxShadow: DefaultEffects.elevation16 }}
        >
            <Stack tokens={stackTokens}>
              <Text variant={"xxLarge"} nowrap block>
                Create Account
              </Text>

              <ControlledTextField
                required={true}
                label="Email"
                control={controlAccount}
                name={nameof<Form>("email")}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "This is not a valid email address",
                  },
                  required: "This field is required",
                }}
              />
              <ControlledTextField
                required={true}
                label="Password"
                control={controlAccount}
                name={nameof<Form>("password")}
                type="password"
                canRevealPassword
                revealPasswordAriaLabel="Show password"
                rules={{ required: "This field is required" }}
              />
              <Stack horizontal>
                <PrimaryButton
                  text="Create Account"
                  onClick={onCreateAccount}
                  allowDisabledFocus
                />
              </Stack>
              {accountError ? (
                <Text className="error-text" block variant="large">
                  Error creating account. Please try again
                </Text>
              ) : (
                <Stack style={{ height: "64px", margin: 0 }}> </Stack>
              )}
              <Text variant={"medium"} nowrap block>
                Already have an account?{" "}
                <a className="link" onClick={slideSigin}>
                  Sign In!
                </a>
              </Text>
            </Stack>
        </div>
      )}
    </div>
  );
};

export default Login;
