import { useCallback } from 'react';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import { gtagEvent } from '../utils';

const Share = ({absUrl}) => {
  const handleClick = useCallback((method) => {
    gtagEvent({
      action: "share",
      params: {
        method
      }
    })
  })

  return (
    <>
      <FacebookShareButton url={absUrl} onClick={() => handleClick('Facebook')}>
        <FacebookIcon size={24} round={true}></FacebookIcon>
      </FacebookShareButton>
      <TwitterShareButton url={absUrl} onClick={() => handleClick('Twitter')}>
        <TwitterIcon size={24} round={true}></TwitterIcon>
      </TwitterShareButton>
    </>
  )
}

export default Share