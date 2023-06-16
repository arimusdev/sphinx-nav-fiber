import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { usePathway } from '~/components/DataRetriever'
import { NODE_RELATIVE_HIGHLIGHT_COLORS } from '~/constants'

export const PathwayLine = () => {
  const { pathway } = usePathway()
  const ref = useRef<Line2>(null)

  const points = useMemo(() => {
    if (ref.current) {
      const p = pathway.map((node) => {
        const coords = new Vector3(node.x || 0, node.y || 0, node.z || 0)

        return coords
      })

      if (p.length) {
        return p
      }
    }

    return [new Vector3(0, 0, 0)]
  }, [pathway])

  return (
    <Line
      ref={ref}
      color={NODE_RELATIVE_HIGHLIGHT_COLORS.pathway.nodeColor}
      dashed
      dashSize={10}
      forceSinglePass={false}
      lineWidth={2}
      matrixWorldAutoUpdate={false}
      opacity={0.05}
      points={points}
      transparent
    />
  )
}
