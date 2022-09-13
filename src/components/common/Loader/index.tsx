import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { colors } from "~/utils/colors";

const messages = [
  "Searching Podcast Index",
  "Searching YouTube",
  "Searching Twitter Spaces",
  "Finding Transcripts",
  "Loading Audio Clips",
  "Loading Video Clips",
  "Preparing Results",
];

export const Loader = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const messageTimeout = setTimeout(doIndex, 5000);

    return function cleanup() {
      clearTimeout(messageTimeout);
    };
  }, [msgIndex]);

  function doIndex() {
    if (msgIndex < messages.length - 1) setMsgIndex(msgIndex + 1);
  }

  return (
    <Flex grow={1} align="center" justify="center">
      <Flex align="center" py={8}>
        <Text color="white" kind="mediumBold">
          {messages[msgIndex]}...
        </Text>
      </Flex>

      <Flex pt={20}>
        <ClipLoader color={colors.white} loading={true} size={26} />
      </Flex>
    </Flex>
  );
};
