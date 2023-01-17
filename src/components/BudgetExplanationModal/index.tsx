import { useCallback } from "react";
import styled from "styled-components";
import { Button } from "~/components/Button";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { BaseModal } from "~/components/Modal";
import { useAppStore } from "~/stores/useAppStore";
import { useModal } from "~/stores/useModalStore";
import { colors } from "~/utils/colors";

const CloseButton = styled(Flex)`
  cursor: pointer;

  span {
    font-size: 18px;
    color: ${colors.primaryRed};
  }
`;

const Shield = styled(Flex)`
  span {
    font-size: 54px;
    color: ${colors.modalShield};
  }
`;

type Props = {
  onClose?: () => void;
};

export const BudgetExplanationModal = ({ onClose }: Props) => {
  const { close } = useModal("budgetExplanation");

  const handlePress = useCallback(() => {
    useAppStore.setState({ hasBudgetExplanationModalBeSeen: true });

    close();
  }, [close]);

  return (
    <BaseModal
      background="budgetExplanationModalBg"
      id="budgetExplanation"
      kind="small"
    >
      <Flex align="flex-end" pb={14}>
        <CloseButton onClick={close}>
          <span className="material-icons">close</span>
        </CloseButton>
      </Flex>

      <Flex align="center">
        <Shield>
          <span className="material-icons">verified_user</span>
        </Shield>

        <Flex pb={10} pt={12}>
          <AuthorizeHeader>Authorize</AuthorizeHeader>
        </Flex>
      </Flex>

      <Flex px={4} py={32}>
        <Text color="white" kind="regularBold">
          Each search of the graph costs 10 sats. Please enter a budget to buy
          an LSAT which will allow you to search up until your budget runs out.
          You will be able to set a new budget when that happens.
        </Text>
      </Flex>

      <ButtonWrap>
        <Button kind="small" onClick={handlePress}>
          Next
        </Button>
      </ButtonWrap>
      <Flex pt={94} />
    </BaseModal>
  );
};

const ButtonWrap = styled(Flex)`
  margin: 0 auto;
`;

const AuthorizeHeader = styled(Text).attrs({
  color: "modalAuth",
  kind: "bigHeading",
})`
  font-size: 32px;
`;
