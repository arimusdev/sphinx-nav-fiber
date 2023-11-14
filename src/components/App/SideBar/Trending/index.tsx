import { Button, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ClipLoader } from 'react-spinners'
import styled from 'styled-components'
import SentimentDataIcon from '~/components/Icons/SentimentDataIcon'
import { Flex } from '~/components/common/Flex'
import { getTrends } from '~/network/fetchGraphData'
import { useDataStore } from '~/stores/useDataStore'
import { useModal } from '~/stores/useModalStore'
import { Trending as TrendingType } from '~/types'
import { colors } from '~/utils/colors'
import { BriefDescription } from './BriefDescriptionModal'

const TRENDING_TOPICS = ['Drivechain', 'Ordinals', 'L402', 'Nostr', 'AI']

type Props = {
  onSubmit?: () => void
}

export const Trending = ({ onSubmit }: Props) => {
  const [loading, setLoading] = useState(false)
  const [briefDescription, setBriefDescription] = useState('')
  const { open } = useModal('briefDescription')

  const [trendingTopics, setTrendingTopics] = useDataStore((s) => [s.trendingTopics, s.setTrendingTopics])

  const { setValue } = useFormContext()

  useEffect(() => {
    const init = async () => {
      setLoading(true)

      try {
        const res = await getTrends()

        if (res.length) {
          setTrendingTopics(res)
        }
      } catch (err) {
        setTrendingTopics(TRENDING_TOPICS.map((i) => ({ topic: i, count: 0 })))
      } finally {
        setLoading(false)
      }
    }

    if (!trendingTopics.length) {
      init()
    }
  }, [trendingTopics, setTrendingTopics])

  const selectTrending = (val: string) => {
    setValue('search', val)
    onSubmit?.()
  }

  const showModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, trending: TrendingType) => {
    e.stopPropagation()

    if (trending?.tldr) {
      setBriefDescription(trending.tldr)
      open()
    }
  }

  return (
    <Wrapper>
      <div className="heading">
        <span className="heading__title">Trending Topics</span>
        <span className="heading__icon">
          {loading ? <ClipLoader color={colors.PRIMARY_BLUE} size={16} /> : <SentimentDataIcon />}
        </span>
      </div>
      <ul className="list">
        {loading ? (
          <>
            <StyledSkeleton animation="wave" height={47} variant="rectangular" width={382} />
            <StyledSkeleton animation="wave" height={47} variant="rectangular" width={382} />
            <StyledSkeleton animation="wave" height={47} variant="rectangular" width={382} />
            <StyledSkeleton animation="wave" height={47} variant="rectangular" width={382} />
            <StyledSkeleton animation="wave" height={47} variant="rectangular" width={382} />
          </>
        ) : (
          <>
            {trendingTopics.map((i) => (
              <Flex
                key={i.topic}
                align="center"
                className="list-item"
                direction="row"
                justify="space-between"
                onClick={() => selectTrending(i.topic)}
              >
                <span>#{i.topic}</span>
                {i.tldr && <Button onClick={(e) => showModal(e, i)}>TLDR</Button>}
              </Flex>
            ))}
          </>
        )}
      </ul>
      <BriefDescription onClose={() => setBriefDescription('')} text={briefDescription} />
    </Wrapper>
  )
}

const Wrapper = styled(Flex)`
  .heading {
    color: ${colors.GRAY6};
    padding: 0 24px 9px 24px;
    font-family: Barlow;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 1.12px;
    text-transform: uppercase;
    display: flex;
    align-items: flex-end;

    &__icon {
      margin-left: 16px;
      font-size: 24px;
    }
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    cursor: pointer;

    &-item {
      padding: 18px 16px 18px 24px;
      overflow: hidden;
      color: ${colors.white};
      text-overflow: ellipsis;
      font-family: Barlow;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 11px;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
        color: ${colors.SECONDARY_BLUE};
      }

      &:active {
        background: rgba(0, 0, 0, 0.2);
        color: ${colors.PRIMARY_BLUE};
      }
    }
  }
`

const StyledSkeleton = styled(Skeleton)`
  && {
    background: rgba(0, 0, 0, 0.15);
  }
`
