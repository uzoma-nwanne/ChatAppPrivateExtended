import React from 'react'

const ChatContextMenu = (refProp) => {
  return (
    <div>
      <ul ref={refProp}>
        <li>Copy</li>
        <li>Cut</li>
        <li>Paste</li>
        <li>Forward</li>
      </ul>
    </div>
  )
}

export default ChatContextMenu