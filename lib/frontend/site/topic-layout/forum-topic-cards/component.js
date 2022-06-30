import React, { Component } from 'react'
import Flickity from 'flickity'
import topicStore from 'lib/frontend/stores/topic-store/topic-store'
import TopicCard from './card'

export default class ForumTopicCards extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null
    }
    this.flkty = null
  }

  componentDidMount () {
    topicStore.findAll({ forum: this.props.forum.id })
      .then((res) => {
        let topics = res[0]
        if (this.props.topic !== undefined) {
          topics = [...topics].filter((topic) => topic.id !== this.props.topic.id)
        }
        if (topics.length > 0) {
          // ordenamos topics por abiertos y cerrados, y por fechas de cierre
          // mismo sort utilizado en home-forum
          topics = topics.sort((a,b) => {  
            // si uno está abierto y el otro cerrado, ordenar por abierto
            if (a.closed && !b.closed)
              return 1
            if (!a.closed && b.closed)
              return -1  
            //// si los dos están abiertos o los dos cerrados
            // si los dos tienen fecha de cierre, ordenar por eso
            if (a.closingAt && b.closingAt)
              if (a.closed && b.closed)
                return new Date(a.closingAt) < new Date(b.closingAt) ? 1 : -1     
              if (!a.closed && !b.closed)
                return new Date(a.closingAt) > new Date(b.closingAt) ? 1 : -1    
            // si alguno tiene fecha de cierre, poner último
            if (a.closingAt)
              return 1
            if (b.closingAt)
              return -1
            // finalmente, si nada de lo anterior se cumple, ordenar por fecha de publicación
            return new Date(a.publishedAt) < new Date(b.publishedAt) ? 1 : -1
          })
          this.setState({
            topics: topics
          })
        }
      })
      .catch((err) => console.error(err))
  }

  componentDidUpdate () {
    if (this.flkty) this.flkty.destroy()
    const options = {
      cellAlign: 'left',
      draggable: false,
      initialIndex: 0,
      // friction: 0.2,
      contain: true,
      // percentPosition: true,
      freeScroll: true,
      prevNextButtons: true,
      pageDots: true,
      autoPlay: false,
      wrapAround: false
      // groupCells: window.matchMedia('(min-width: 1024px)').matches ? 3 : 1
    }
    this.flkty = new Flickity(this.refs.carrusel, options)
    this.flkty.reposition()
  }

  componentWillUnmount () {
    if (this.flkty) this.flkty.destroy()
  }

  render () {
    if (!this.props.forum || !this.state.topics) return null
    return (
      <div id="forum-topic-cards" className='py-5'>
        <hr/>
        {this.props.topic &&
          <p className='is-size-4 has-text-centered my-4 mx-5'><b>CONOCÉ MÁS PROPUESTAS</b></p>
        }
        <div className='topics-container' ref='carrusel'>
          {this.state.topics && this.state.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic}/>
          ))}
        </div>
      </div>
    )
  }
}