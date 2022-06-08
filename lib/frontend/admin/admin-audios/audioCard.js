import React, { Component } from 'react'
// import t from 't-component'
import 'whatwg-fetch'
// import urlBuilder from 'lib/url-builder'
// import { limit } from '../../api-v2/validate/schemas/pagination'
import moment from 'moment'

export default class AudioCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showMore: false,
      listening: false,
      listeningAudioFile: null,
    }

    this.toggleShowMore = this.toggleShowMore.bind(this)
    this.selectAudio = this.selectAudio.bind(this)
    this.getReaction = this.getReaction.bind(this)
    this.playAudio = this.playAudio.bind(this)
  }

  componentDidMount () {

  }

  playAudio (file) {
    this.setState({
      listening: true,
      listeningAudioFile: file
    })
    const audio = new Audio(file)
    audio.play()
    audio.onended = () => {
      this.setState({
        listening: false,
        listeningAudioFile: null
      })
    }
  }

  getReaction (reaction) {
    switch (reaction) {
      case '1':
        return '🙂'
      case '2':
        return '😟'
      case '3':
        return '🤔'
      case '4':
        return '😡'
      default:
        // question mark
        return '❓'
    }
  }

  selectAudio (audio) {
    this.props.selectAudio(audio)
  }

  toggleShowMore () {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  render () {
    const { audio } = this.props
    const { showMore, listening, listeningAudioFile } = this.state
    return (
      <div className={`media ${audio.spam && 'spam'} ${audio.featured && 'featured'}`} key={audio._id}>
        <div className="media-left">
          {
            audio.file && !listening &&
            <div className="player-button" onClick={() => this.playAudio(audio.file)}>
              <i className="fas fa-circle-play fa-fw is-size-4" />
            </div>
          }
          {
            audio.file && listening && listeningAudioFile === audio.file &&
            <div className="player-button playing animate__animated animate__flash animate__infinite animate__slow">
              <i className="fas fa-circle-play fa-fw is-size-4" />
            </div>
          }
          {
            audio.file && listening && listeningAudioFile !== audio.file &&
            <div className="player-button disabled">
              <i className="fas fa-circle-play fa-fw is-size-4" />
            </div>
          }
        </div>
        <div className="media-body">
          {/* <p><b>Usuario</b>: <span className="upper">{audio.user.lastName}</span>, {audio.user.firstName} - <a href={`mailto:${audio.user.email}`}>{audio.user.email}</a></p> */}
          <p className="my-0">
          {
            audio.spam && <span className="text-danger mr-2"><i className="fas fa-ban fa-fw fa-lg"></i></span>
          }
          {
            audio.resolved && <span className="text-success mr-2"><i className="fas fa-check-circle fa-fw fa-lg"></i></span>
          }
          {
            audio.featured && <span className="text-warning mr-2"><i className="fas fa-star fa-fw fa-lg"></i></span>
          }
            <span className="upper">{audio.user.lastName}</span>, {audio.user.firstName} - {audio.user.email}&nbsp;
          </p>
          {
            showMore &&
            <div className="">
              <p className="my-0 description">{audio.about || '- Sin descripción -'}</p>
              <p className="my-0 is-size-7">
                {moment(audio.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                {
                  audio.group && <span> - Grupo: <span className="badge badge-warning px-1 pt-0 pb-0" style={{fontWeight: 300, borderRadius: 3, lineHeight: 'normal'}}>{audio.group}</span></span>
                }
                {
                  audio.subgroup && <span> - Subgrupo: <span className="badge badge-info px-1 pt-0 pb-0" style={{fontWeight: 300, borderRadius: 3, lineHeight: 'normal'}}>{audio.subgroup}</span></span>
                }
                </p>
            </div>
          }
        </div>
        <div className="media-right">
          <p className="reaction text-center is-size-5 mb-0">
            {
              !showMore && audio.group && <span className="badge badge-warning px-1 pt-0 pb-0 mx-1" style={{fontWeight: 300, borderRadius: 3, lineHeight: 'normal'}}>{audio.group}</span>
            }
            {
              !showMore && audio.group && <span className="badge badge-info px-1 pt-0 pb-0 mx-1" style={{fontWeight: 300, borderRadius: 3, lineHeight: 'normal'}}>{audio.subgroup}</span>
            }
            {this.getReaction(audio.reaction)}&nbsp;<a className="edit-pencil" onClick={() => this.selectAudio(audio)}>
            <i className="fas fa-pencil"/>
          </a>&nbsp;<a className="edit-pencil" onClick={this.toggleShowMore}>
            <i className={`fas fa-lg fa-fw fa-${showMore ? 'angle-up' : 'angle-down'}`} />
          </a></p>

        </div>
      </div>
    )
  }
}