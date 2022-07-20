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
      pages: 0,
      pageSize: 10,
      audiosCount: 0,
      audioSelected: null,
      queryString: null,
      orderCreatedAt: 'desc'

    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectAudio = this.selectAudio.bind(this)
    this.goBack = this.goBack.bind(this)
    this.goNext = this.goNext.bind(this)
    this.unselectAudio = this.unselectAudio.bind(this)
    this.updateAudio = this.updateAudio.bind(this)
  }

  componentDidMount () {
    this.loadAudios()
  }

  loadAudios (query, restartPagination) {
    let queryString = null
    if (query) {
      // convert query to url querystring
      queryString = Object.keys(query).map((key) => {
        return `${key}=${query[key]}`
      }).join('&')
      this.setState({
        isLoading: true,
        query: query,
        queryString: queryString
      }, () => {
        
      })
    }

    window.fetch(`/api/v2/audio/admin/all/${restartPagination ? 0 : this.state.page}?orderBy=${this.state.orderCreatedAt}&limit=${this.state.pageSize}${queryString ? '&' : ''}${queryString || ''}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log(json)
        this.setState({
          audios: json.audios,
          page: json.page,
          pages: json.pages,
          audiosCount: json.count
        })
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        this.setState({
          isLoading: false
        })
      })
  }
  
  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
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

  goBack () {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1
      }, () => {
        this.loadAudios(this.state.query, false)
      })
    }
  }

  goNext () {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.loadAudios(this.state.query, false)
    })
  }

  updateAudio (audio) {
    // console.log(audio)
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
        <QuerySearch search={(query, restartPagination) => this.loadAudios(query, restartPagination)} />
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Orden</label>
              <select className="form-control" name="orderCreatedAt" onChange={this.handleInputChange}>
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguos primero</option>
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label>Por página</label>
              <input type="number" className="form-control" name="pageSize" onChange={this.handleInputChange} value={this.state.pageSize}/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group text-right">
              <label>Página</label>
              <div>
                <span className="mr-2">Pagina {this.state.page + 1} de {this.state.pages}</span>
                <button className="btn btn-primary btn-sm" disabled={this.state.page === 0 } onClick={this.goBack}><i className="fas fa-arrow-left" /></button>
                <button className="btn btn-primary btn-sm" disabled={this.state.page === this.state.pages-1} onClick={this.goNext}><i className="fas fa-arrow-right" /></button>
              </div>
            </div>
          </div>
        </div>
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
            <a href='/api/v2/audio/all/csv'
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
