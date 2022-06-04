import {
  CommandButton,
  DefaultButton,
  Icon,
  Modal,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { createRef, useEffect, useMemo, useState } from "react";
import React, { useRef } from "react";
import Roboflow from "../../roboflow/Roboflow";
import { StyledStack } from "../player-stats/PlayerStats";

interface RollModalProps {
  isModalOpen: boolean;
  hideModal: () => void;
  rollCallback: (roll: number) => void;
  primaryColor: string;
  name: string;
}

export const nameof = <T extends {}>(name: keyof T) => name;

const RollModal: React.FC<RollModalProps> = ({
  isModalOpen,
  hideModal,
  rollCallback,
  primaryColor,
  name,
}: RollModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [videoLoading, setVideoLoading] = useState(true);
  const [streamStarted, setStreamStarted] = useState(false);

  const [prediction, setPrediction] = useState(-1);

  const roboflow = useMemo(() => {
    return new Roboflow(primaryColor);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setTimeout(() => {
        setVideoLoading(true);
        setStreamStarted(false);
        setPrediction(-1);
        roboflow.stop();
      }, 200);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (prediction > -1) {
      roboflow.pause();
    }
  }, [prediction]);

  return (
    <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
      <Stack
        style={{
          height: 800,
          padding: "16px 46px  20px 46px",
        }}
        tokens={{
          childrenGap: 20,
        }}
      >
        <div
          style={{
            padding: "16px 46px  20px 0px",
            boxSizing: "border-box",
          }}
        >
          <Text variant={"xxLarge"} nowrap>
            {name}
          </Text>
          <CommandButton
            onClick={hideModal}
            style={{
              position: "absolute",
              //   transform: "translateX(100%)",
              top: 0,
              right: 0,
            }}
            iconProps={{ iconName: "Cancel" }}
          />
        </div>

        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            marginTop: 16,
            height: 500,
            width: 500,
          }}
        >
          <canvas
            style={{
              height: 500,
              width: 500,
              position: "absolute",
              zIndex: 20000,
            }}
            ref={canvasRef}
          />
          {videoLoading && (
            <Spinner
              style={{
                position: "absolute",
                transform: "translate(245px, 245px) scale(7) ",
                zIndex: 200000,
              }}
              size={SpinnerSize.large}
            />
          )}
          <video
            style={{
              height: 500,
              borderRadius: 2,
              width: 500,
              zIndex: 100,
              position: "absolute",
              objectFit: "cover",
              opacity: videoLoading ? 0.5 : 1,
            }}
            ref={(node) => {
              if (node && isModalOpen && canvasRef.current) {
                roboflow.initialize({
                  videoRef: node,
                  canvasRef: canvasRef.current,
                  loadingCallback: setVideoLoading,
                  predictionCallback: setPrediction,
                  streamStartedCallback: setStreamStarted,
                });
              }
            }}
            autoPlay
            muted
            playsInline
          />
          <Icon
            style={{
              position: "absolute",
              zIndex: 10,
              transform: "translate(250px, 250px) scale(7)",
              opacity: videoLoading && !streamStarted ? 1 : 0,
            }}
            iconName="VideoOff"
          />
        </div>

        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginTop: 40,
            height: 120,
          }}
        >
          {prediction > -1 ? (
            <Stack
              horizontal
              tokens={{
                childrenGap: 20,
              }}
            >
              <Stack
                style={{
                  padding: 0,
                  width: 120,
                  height: 120,
                  border: `5px solid ${primaryColor}`,
                  borderRadius: 120,
                }}
              >
                <Text
                  variant={"xxLarge"}
                  style={{
                    lineHeight: "120px",
                    width: "100%",
                    textAlign: "center",
                    transform: "translateY(-5px)",
                    color: primaryColor,
                  }}
                >
                  {prediction}
                </Text>
              </Stack>
              <Stack>
                <Text
                  variant="xLarge"
                  style={{
                    // marginLeft: 140,
                    lineHeight: "60px",
                  }}
                >
                  Is this number valid?
                </Text>
                <Stack horizontal>
                  <PrimaryButton
                    style={{
                      marginRight: 10,
                    }}
                    onClick={() => {
                      rollCallback(prediction);
                      hideModal();
                    }}
                  >
                    Yes
                  </PrimaryButton>
                  <DefaultButton
                    onClick={() => {
                      setPrediction(-1);
                      roboflow.start();
                    }}
                  >
                    No (Retry)
                  </DefaultButton>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <>
              {!videoLoading && (
                <Stack horizontal>
                  <Spinner
                    style={{
                      position: "absolute",
                      transform: "translate(46px, 46px) scale(4.28571428571)",
                    }}
                    size={SpinnerSize.large}
                  />
                  <Text
                    variant="xLarge"
                    style={{
                      marginLeft: 140,
                      lineHeight: "120px",
                    }}
                  >
                    Waiting for valid roll
                  </Text>
                </Stack>
              )}
            </>
          )}
        </div>
      </Stack>
    </Modal>
  );
};

export default RollModal;
