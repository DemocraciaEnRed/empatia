import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import moment from 'moment'
import EditAudio from './editAudio'
import QuerySearch from './querySearch'
import AudioCard from './audioCard'

export default class AdminAudios extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      audios: [],
      page: 0,
      audioSelected: null,
      queryString: null
    }
    this.selectAudio = this.selectAudio.bind(this)
    this.unselectAudio = this.unselectAudio.bind(this)
    this.updateAudio = this.updateAudio.bind(this)
  }

  componentDidMount () {
    this.loadAudios()
  }

  loadAudios (query) {
    if(query) {
      // convert query to url querystring
      const queryString = Object.keys(query).map((key) => {
        return `${key}=${query[key]}`
      }).join('&')
      this.setState({
        isLoading: true,
        page: 0,
        queryString: queryString
      })
    }

    window.fetch(`/api/v2/audio/admin/all/${this.state.page}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        this.setState({
          audios: json,
          isLoading: false,
          page: this.state.page + 1
        })
      })
  }

  selectAudio (audio) {
    this.setState({
      audioSelected: audio
    })
  }

  unselectAudio () {
    this.setState({
      audioSelected: null
    })
  }

  updateAudio (audio) {
    console.log(audio)
    this.setState({
      audioSelected: null,
      audios: this.state.audios.map((a) => {
        if (a._id === audio._id) {
          return audio
        }
        return a
      })
    })
  }

  render () {
    // const { forum } = this.props
    const { isLoading, audios, audioSelected } = this.state
    return (
      <div>
        <h2>Audios</h2>
        <QuerySearch search={(query) => this.loadAudios(query)} />
        <div id="listadoAudio">
          {
            isLoading && <p className="text-center"><i className="fas fa-sync fa-spin" /> Cargando...</p>
          }
          {
            !isLoading && audios.length === 0 && <p className="text-center">No hay audios</p>
          }
          <div>
            {
              !isLoading && audios.length > 0 && audios.map((audio) => 
                <AudioCard key={audio._id} audio={audio} playAudio={this.playAudio} selectAudio={this.selectAudio} />)
            }
          </div>
          {/* Pagination */}
          <br />
          {
          audioSelected &&
            <EditAudio audio={audioSelected} cancel={this.unselectAudio} update={this.updateAudio} key={`edit-${audioSelected._id}`} />
          }
        </div>
        <div className='clearfix'>
          <div className='pull-left'>
            <p className='h4'><i className="fas fa-file-arrow-down"></i>  Descargar listado</p>
            <p>Descarge en una planilla los audios y los usuarios vinculados en una planilla</p>
          </div>
          <div className='pull-right'>
            <a href='/api/v2/padron/all/csv'
              download
              className='btn btn-primary'>
              Descargar CSV
            </a>
          </div>
        </div>
      </div>
      
    )
  }
}
