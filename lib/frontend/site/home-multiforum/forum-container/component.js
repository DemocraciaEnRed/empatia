import React, { Component } from 'react'
import ListForumTopics from '../../list-forum-topics/component'
import ForumCard from '../forum-card/component'

export default ({ forum }) => (
  <div className='container forum-card-container'>
    <ForumCard forum={forum} />
    <div className='forum-slider-wrapper'>
      <h4 className='forum-slider-title'>
      {
        forum.extra.contentType === 'llamado' && 'Las propuestas que comprenden esta convocatoria son:'
        ||
        forum.extra.contentType === 'propuestas' && 'Las propuestas que comprenden esta consulta son:'
        ||        
        (forum.extra.contentType === 'ejes' || forum.extra.contentType === undefined) && 'Los ejes que comprenden esta consulta son:'
      }
      </h4>
      <ListForumTopics forum={forum} />

    </div>
  </div>
)
