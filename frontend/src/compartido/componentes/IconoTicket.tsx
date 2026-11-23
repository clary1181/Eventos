import React from 'react';
import Svg, { G, Line, Path } from 'react-native-svg';

const ANCHO_VB = 230;
const ALTO_VB = 140;

const estrella = (cx: number, cy: number, radioExt: number, radioInt: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const ang = (-90 + i * 36) * (Math.PI / 180);
    const r = i % 2 === 0 ? radioExt : radioInt;
    return `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(ang)).toFixed(2)} ${(cy + r * Math.sin(ang)).toFixed(2)}`;
  }).join(' ') + ' Z';

export function IconoTicket({ ancho = 120, color = '#FFFFFF' }: { ancho?: number; color?: string }) {
  const alto = (ancho * ALTO_VB) / ANCHO_VB;

  return (
    <Svg width={ancho} height={alto} viewBox={`0 0 ${ANCHO_VB} ${ALTO_VB}`}>
      <G transform="translate(5 5) rotate(-14 100 70)">
        <Path
          d="M40 30 H160 Q170 30 170 40 V62 A10 10 0 0 0 170 82 V100 Q170 110 160 110 H40 Q30 110 30 100 V82 A10 10 0 0 0 30 62 V40 Q30 30 40 30 Z"
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <Line x1={62} y1={40} x2={62} y2={100} stroke={color} strokeWidth={5} strokeDasharray="7 7" strokeLinecap="round" />
        <Line x1={138} y1={40} x2={138} y2={100} stroke={color} strokeWidth={5} strokeDasharray="7 7" strokeLinecap="round" />
        <Path d={estrella(100, 71, 21, 9)} fill={color} stroke={color} strokeWidth={3} strokeLinejoin="round" />
      </G>
      <G stroke={color} strokeWidth={6} strokeLinecap="round">
        <Line x1={188} y1={24} x2={204} y2={10} />
        <Line x1={196} y1={44} x2={218} y2={40} />
        <Line x1={194} y1={64} x2={212} y2={72} />
      </G>
    </Svg>
  );
}
