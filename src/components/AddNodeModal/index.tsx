import { ReactElement, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { MdClose, MdInfo } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as sphinx from "sphinx-bridge-kevkevinpal";
import styled from "styled-components";
import { Button } from "~/components/Button";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { BaseModal } from "~/components/Modal";
import { isDevelopment, NODE_ADD_ERROR, NODE_ADD_SUCCESS } from "~/constants";
import { api } from "~/network/api";
import { useModal } from "~/stores/useModalStore";
import { colors } from "~/utils/colors";
import { getLSat } from "~/utils/getLSat";
import { timeToMilliseconds } from "~/utils/timeToMilliseconds";
import { ToastMessage } from "../common/Toast/toastMessage";
import StyledSelect from "../Select";
import { SourceUrl } from "./SourceUrl";
import TwitId from "./TweetId";
import TwitterHandle from "./TwitterHandle";

type Option = {
  label: string;
  value: string;
};

export const requiredRule = {
  required: {
    message: 'The field is required',
    value: true,
  },
}

const mainInfoMessage =
  'Come across an interesting or useful part of a video or audio you\'d like to share? You can add it to the knowledge graph here!\n\nEnter a valid link to the YouTube video or Twitter Space you were watching, choose a start and end timestamp to encompass the segment you found interesting or useful, provide a brief description of what the segment is about, and add topic tags that are relevant to the segment. Hit "Add node", and your clip will be added to the graph shortly.\n\nYour pubkey will be submitted with your clip, and any boosts your clip receives will go to you!'

type SubmitErrRes = {
  error?: { message?: string }
}

const notify = (message: string) => {
  toast(<ToastMessage message={message} />, {
    icon: false,
    position: toast.POSITION.BOTTOM_CENTER,
    type: message === NODE_ADD_SUCCESS ? 'success' : 'error',
  })
}

const handleSubmit = async (data: FieldValues, close: () => void, sourceType: string) => {

  const body: { [index: string]: unknown } =
    sourceType === LINK
      ? {
          media_url: data.link,
          ...(data.withTimeStamps
            ? {
                job_response: {
                  tags: [
                    {
                      description: data.description,
                      'end-time': timeToMilliseconds(data.endTime),
                      'start-time': timeToMilliseconds(data.startTime),
                      tag: data.tags?.join(', '),
                    },
                  ],
                },
              }
            : {}),
        }
      : {
          source: sourceType === TWITTER_HANDLE ? (data.source || '').replace(/[@_]/g, '') : data.source,
          source_type: sourceType,
        }

  let lsatToken

  if (!isDevelopment) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const enable = await sphinx.enable()

    body.pubkey = enable?.pubkey

    lsatToken = await getLSat('adding_node')

    if (!lsatToken) {
      throw new Error('An error occured calling getLSat')
    }
  }

  const endPoint = sourceType === LINK ? 'add_node' : 'radar';

  try {
    const res: SubmitErrRes = await api.post(`/${endPoint}`, JSON.stringify(body), {
      Authorization: lsatToken,
    } as HeadersInit)

    if (res.error) {
      const { message } = res.error

      throw new Error(message)
    }

    notify(NODE_ADD_SUCCESS)
    close()
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify(NODE_ADD_ERROR)
      close()
    }
  }
}

const LINK = "link";
const TWITTER_HANDLE = "twitter_handle";
const TWITTER_SOURCE = "tweet";

type TOption = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (props: any) => ReactElement<any, any> | null,
  label: string,
}

interface IOptionMap {
  [key: string]: TOption,
}



const CONTENT_TYPE_OPTIONS: IOptionMap = {
  [LINK]: {
    component: SourceUrl,
    label: 'Youtube / Twitter space / Mp3',
  },
  [TWITTER_HANDLE]: {
    component: TwitterHandle,
    label: 'Twitter handle',
  },
  [TWITTER_SOURCE]: {
    component: TwitId,
    label: 'Tweet',
  },
}

export const AddNodeModal = () => {
  const { close } = useModal("addNode");
  const [activeType, setActiveType] = useState("");

  const form = useForm({ mode: 'onSubmit' })

  const { reset, watch, setValue } = form

  const { isSubmitting, errors } = form.formState

  const handleClose = () => {
    setActiveType('');
    reset();
    close();
  };

  const onSubmit = form.handleSubmit(async (data) => {
    await handleSubmit(data, handleClose, activeType)
  });

  const options = Object.keys(CONTENT_TYPE_OPTIONS).map((i: string) => ({
    label: CONTENT_TYPE_OPTIONS[i].label,
    value: i,
  }));

  const selectedValue = activeType
    ? [
        {
          label: activeType,
          value: activeType,
        },
      ]
    : [];

  const startTime = watch("startTime");

  const FormValues = activeType ? CONTENT_TYPE_OPTIONS[activeType].component : () => null
  const formProps = { setValue, startTime }

  return (
    <BaseModal id="addNode" preventOutsideClose>
      <FormProvider {...form}>
        <form id="add-node-form" onSubmit={onSubmit}>
          <Flex align="center" direction="row" justify="space-between" pb={32}>
            <Flex align="center" direction="row">
              <Text kind="bigHeadingBold">Add Content</Text>
              <InfoIcon role="tooltip" tabIndex={0}>
                <MdInfo />

                <div className="tooltip">{mainInfoMessage}</div>
              </InfoIcon>
            </Flex>

            <CloseButton
              id="add-node-close-button"
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Space') {
                  handleClose()
                }
              }}
              role="button"
              tabIndex={0}
            >
              <MdClose color="white" />
            </CloseButton>
          </Flex>

          {!activeType ? (
            <Flex align="center" direction="row" justify="space-between">
              <Flex>
                <Text kind="mediumBold">What do you want to add?</Text>
              </Flex>
              <Flex basis="250px">
                <StyledSelect
                  className={selectedValue.length ? 'hasSelected' : ''}
                  clearable
                  onChange={(values) => {
                    setActiveType(values.length ? (values[0] as Option).value : '')
                  }}
                  options={options}
                  placeholder="Select content type"
                  searchable={false}
                  values={selectedValue}
                />
              </Flex>
            </Flex>
          ) : (
            <>
              <Flex>
                <FormValues {...formProps} />
              </Flex>

              <Flex pt={16} px={4} tabIndex={0}>
                <Text color="lightGray" kind="tinyBold">
                  Your pubkey will be submitted with your node, so you can receive sats that your node earns.
                </Text>
              </Flex>

              <Flex pt={8}>
                {isSubmitting ? (
                  <SubmitLoader>
                    <ClipLoader color={colors.white} size={20} />
                  </SubmitLoader>
                ) : (
                  <Button disabled={isSubmitting} id="add-node-submit-cta" kind="big" type="submit">
                    Add content
                  </Button>
                )}
              </Flex>
            </>
          )}
        </form>
      </FormProvider>
    </BaseModal>
  )
}

const CloseButton = styled(Flex)`
  cursor: pointer;

  svg {
    font-size: 24px;
    color: ${colors.white};
  }
`

const InfoIcon = styled(Flex)`
  cursor: default;
  padding: 8px;
  position: relative;

  svg {
    font-size: 22px;
    color: ${colors.secondaryText4};
  }

  .tooltip {
    position: absolute;
    background-color: ${colors.dashboardHeader};
    border: 1px solid ${colors.secondaryText4};
    border-radius: 4px;
    color: ${colors.white};
    top: 40px;
    left: -142px;
    padding: 4px 8px;
    font-size: 13px;
    visibility: hidden;
    width: 470px;
    white-space: pre-wrap;
    z-index: 1;
  }

  span:hover + .tooltip {
    visibility: visible;
  }

  &:focus .tooltip {
    visibility: visible;
  }
`

const SubmitLoader = styled(Flex).attrs({
  align: 'center',
  background: 'primaryButton',
  borderRadius: 8,
  justify: 'center',
})`
  padding: 16px 24px;
  opacity: 0.5;
`
