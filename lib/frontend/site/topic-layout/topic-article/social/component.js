import React, { PureComponent } from 'react'
import t from 't-component'
import config from 'lib/config'
const moment = require('moment')

export default ({ topic }) => {
  const { url, mediaTitle, action } = topic

  const socialLinksUrl = window.location.origin + url
  const twitterText = encodeURIComponent(
    // config.tweetText ? 
    //     t(config.tweetText, { organizationName: config.organizationName, bajadaPlataforma: config.bajadaPlataforma }).replace(/\\n/g, "\n")
    //   : mediaTitle
    config.tweetText ? 
        `${config.tweetText}\nLink a la propuesta: ${socialLinksUrl}`
      : `Te invito a ver "${mediaTitle}"\nLink: ${socialLinksUrl}`
  )
  const whatsappText = encodeURIComponent(
    config.tweetText ? 
        `${config.tweetText}\nLink a la propuesta: ${socialLinksUrl}`
      : `Te invito a ver "${mediaTitle}"\nLink: ${socialLinksUrl}`
  )
  
  const preventClickBehind = e => {
    e.stopPropagation()
  }

  return (
    <div className='topic-social text-center'>
        <a
          href={`http://www.facebook.com/sharer.php?u=${socialLinksUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={preventClickBehind}
          className="btn btn-primary text-white mx-1" >
          <i className="fab fa-facebook fa-fw"></i> Facebook
        </a>
        <a
          href={`http://twitter.com/share?text=${twitterText}`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={preventClickBehind}
          className="btn btn-primary text-white mx-1" >
          <i className="fab fa-twitter fa-fw"></i> Twitter
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${whatsappText}`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={preventClickBehind}
          className="btn btn-primary text-white mx-1" >
          <i className="fab fa-whatsapp fa-fw"></i> Whatsapp
        </a>
    </div>
  )
}
