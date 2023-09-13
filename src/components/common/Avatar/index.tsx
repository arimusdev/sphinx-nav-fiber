import styled from 'styled-components'

type Props = {
  size?: 45 | 80 | 130 | 188
  src: string
  type: 'audio' | 'video' | 'tweet' | 'message' | 'person'
}

type TTypeMapper = {
  [key: string]: string
}

const TypesMapper: TTypeMapper = {
  youtube: 'video',
  podcast: 'audio',
  tweet: 'tweet',
}

export const Avatar = styled.div<Props>`
  background-image: ${({ src, type = 'audio' }) => `url(${src}), url('/${TypesMapper[type]}_placeholder.svg')`};
  background-size: contain;
  background-repeat: no-repeat;
  width: ${({ size = 45 }) => size}px;
  height: ${({ size = 45 }) => size}px;
  border-radius: 2px;
`
