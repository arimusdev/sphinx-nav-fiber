import styled from "styled-components";
import { colors } from "~/utils/colors";
import { Booster } from "~/components/Booster";
import { Flex } from "~/components/common/Flex";
import { Pill } from "~/components/common/Pill";
import { useAppStore } from "~/stores/useAppStore";
import { useDataStore } from "~/stores/useDataStore";

type FlagErrorProps = {
  flagErrorIsOpen?: boolean;
};

const FlagError = styled(Flex)<FlagErrorProps>`
  color: ${({ flagErrorIsOpen }) =>
    flagErrorIsOpen ? colors.lightBlue200 : colors.white};
  padding: 0 0 0 8px;
  &:hover {
    cursor: pointer;
    color: ${colors.lightBlue200};
  }
`;

export const Actions = () => {
  const [transcriptIsOpen, setTranscriptOpen] = useAppStore((s) => [
    s.transcriptIsOpen,
    s.setTranscriptOpen,
  ]);

  const [flagErrorIsOpen, setFlagErrorOpen] = useAppStore((s) => [
    s.flagErrorIsOpen,
    s.setFlagErrorOpen,
  ]);

  const selectedNode = useDataStore((s) => s.selectedNode);

  return (
    <Flex align="center" direction="row">
      <Pill
        onClick={() => setTranscriptOpen(!transcriptIsOpen)}
        selected={transcriptIsOpen}
      >
        Transcript
      </Pill>

      <Flex pl={10}>
        <Booster content={selectedNode} refId={selectedNode?.id} />
      </Flex>
      <FlagError
        flagErrorIsOpen={flagErrorIsOpen}
        onClick={() => setFlagErrorOpen(!flagErrorIsOpen)}
      >
        <span className="material-icons" style={{ fontSize: 30 }}>
          error_outline
        </span>
      </FlagError>
    </Flex>
  );
};
