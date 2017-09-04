import React from 'react';

// type PropsType = {
//   checked: boolean,
//   size: number,
//   fill: string,
// }

export default (props/*: PropsType*/) => (
  <svg
    height={props.size}
    viewBox="0 0 24 24"
    width={props.size}
    xmlns="http://www.w3.org/2000/svg"
  >
    { props.checked ?
    <path fill={props.fill} d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    :
    <path fill={props.fill} d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    }
  </svg>
)