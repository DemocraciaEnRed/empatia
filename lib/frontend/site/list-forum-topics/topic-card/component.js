import React from 'react'
import t from 't-component'
import { browserHistory, Link } from 'react-router'
import topicStore from 'lib/frontend/stores/topic-store/topic-store'
import Social from 'lib/frontend/site/topic-layout/topic-article/social/component'
import Timeago from 'lib/frontend/site/timeago'

export default ({ topic }) => {
  const linkTopic = () => { 
    window.location.href = topic.url
  }
  return (
    <div
      onClick={linkTopic}
      className='horizontal-topic-card'>
        <div className="topic-card-image" style={{ 'backgroundImage': 'url(' + topic.coverUrl + ')' }} />
        <div className='topic-card-body'>
          <span className="badge badge-primary">{topic.tag.name}</span>
          <h3 className="the-title my-3">{topic.mediaTitle}</h3>
          <p>{topic.attrs.resumen}</p>
          <button
                className='btn btn-primary'
                onClick={linkTopic}
              >
                Participá
                </button>
        </div>
    </div>
  )
  // return (
  // <div 
  //   onClick={linkTopic}
  //   className='panel'>
  //   <div
  //     className='panel-heading'
  //     style={{ backgroundImage: `url("${topicStore.getCoverUrl(topic)}")`}} />
  //   <div className='topic-card-wrapper'>
  //     { topic.closingAt &&
  //       <p className='meta-information'>
  //         <i className='icon-clock' />
  //         <span className='time-ago-label'>
  //           {(topic.closed ? t('common.closed') : t('common.close')) + ' '}
  //         </span>
  //         <Timeago className='meta-timeago' date={topic.closingAt} />
  //       </p>
  //     }
  //     <div className='panel-body'>
  //       <h3>{topic.mediaTitle}</h3>
      
  //     </div>
  //     <div className='topic-card-footer'>
  //       <p className='text-muted'>
  //         {topic.action.method === "" ?
  //         `${topic.commentersCount} ${topic.commentersCount === 1 ? t('proposal-article.participant.singular') : t('proposal-article.participant.plural')}` :
  //         `${topic.action.count} ${topic.action.count === 1 ? t('proposal-article.participant.singular') : t('proposal-article.participant.plural')}`
  //         }
  //       </p>
  //       <div className='social-links'>
  //         <Social topic={topic}/>
  //       </div> 
  //     </div>
  //   </div>
  // </div>
  // )
}
