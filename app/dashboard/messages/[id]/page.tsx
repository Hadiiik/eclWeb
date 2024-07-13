import React from 'react'

const Messages = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      {params.id}
    </div>
  )
}

export default Messages
