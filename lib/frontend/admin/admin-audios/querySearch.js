import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import moment from 'moment'

export default class QuerySearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      spam: false,
      featured: false,
      resolved: false,
      notag: false,
      group: '',
      subgroup: '',
      reaction: null,
      fullName: '',
      email: '',
      dni: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleTypeSelected = this.handleTypeSelected.bind(this)
    this.changeReaction = this.changeReaction.bind(this)
    this.search = this.search.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentDidMount () {
        
  }

  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
  }

  changeReaction (reaction) {
    if(this.state.reaction == reaction) {
      this.setState({
        reaction: null
      })
    }
    else {
      this.setState({
        reaction: reaction
      })
    }
  }

  closeWarnings () {
    this.setState({
      showWarning: false
    })
  }

  // object is not empty
  isEmpty (obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  
  handleTypeSelected (e) {
    if (e.target.value == 'spam') {
      this.setState({
        spam: true,
        featured: false,
        resolved: false,
        notag: false
      })
    } else if (e.target.value == 'featured') {
      this.setState({
        spam: false,
        featured: true,
        resolved: false,
        notag: false
      })
    } else if (e.target.value == 'resolved') {
      this.setState({
        spam: false,
        featured: false,
        resolved: true,
        notag: false
      })
    } else if (e.target.value == 'notag') {
      this.setState({
        spam: false,
        featured: false,
        resolved: false,
        notag: true
      })
    } else {
      this.setState({
        spam: false,
        featured: false,
        resolved: false,
        notag: false
      })
    }
  }

  search () {
    let query = {}
    if (this.state.featured) query.featured = true
    if (this.state.resolved) query.resolved = true
    if (this.state.spam) query.spam = true
    if (this.state.notag) {
      query.featured = false
      query.spam = false
      query.resolved = false
    }
    if (this.state.group) query.group = this.state.group
    if (this.state.subgroup) query.subgroup = this.state.subgroup
    if (this.state.reaction) query.reaction = this.state.reaction
    if (this.state.fullName) query.fullName = this.state.fullName
    if (this.state.email) query.email = this.state.email
    if (this.state.dni) query.dni = this.state.dni
    console.log('checking query', query)
    // if (!this.isEmpty(query)) {
    //   this.props.search(query)
    // }
    this.props.search(query, true)
  }

  restart () {
    this.setState({
      spam: false,
      featured: false,
      resolved: false,
      notag: false,
      group: '',
      subgroup: '',
      reaction: null,
      fullName: '',
      email: '',
      dni: ''
    })
    this.props.search({}, true)
  }

  render () {
    // let { proyectistas } = this.state
    return ( 
      <div id="queryAudios" className="well">
        <h5 className="mb-3">Filtros</h5>
        <div className='row'>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Tipo</label>
              <select className='form-control' onChange={this.handleTypeSelected}>
                <option value=''>Todos</option>
                <option value='featured'>⭐ Destacados</option>
                <option value='spam'>🚫 Spam</option>
                <option value='resolved'>✅ Resueltos</option>
                <option value='notag'>Sin marcar</option>
              </select>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label>Grupo</label>
              <input type='text' name='group' onChange={this.handleInputChange} className='form-control' />
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label>Subgrupo</label>
              <input type='text' name='subgroup' onChange={this.handleInputChange} className='form-control' />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group'>
              <label>Reaccion</label>
              <div>
                <span className={`reaction ${this.state.reaction === '1' && 'selected'}`} onClick={() => this.changeReaction('1')}>🙂</span>
                <span className={`reaction ${this.state.reaction === '2' && 'selected'}`} onClick={() => this.changeReaction('2')}>😟</span>
                <span className={`reaction ${this.state.reaction === '3' && 'selected'}`} onClick={() => this.changeReaction('3')}>🤔</span>
                <span className={`reaction ${this.state.reaction === '4' && 'selected'}`} onClick={() => this.changeReaction('4')}>😡</span>
                <span className={`reaction ${this.state.reaction === '' && 'selected'}`} onClick={() => this.changeReaction('')}>❓</span>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>Nombre</label>
              <input type='text' name='fullName' onChange={this.handleInputChange} className='form-control' />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>Email</label>
              <input type='text' name='email' onChange={this.handleInputChange} className='form-control' />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>DNI</label>
              <input type='text' name='dni' onChange={this.handleInputChange} className='form-control' />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
              <div className='form-group'>
                <div>
                  <button onClick={this.restart} className='btn btn-info mx-1'>Reiniciar</button>
                  <button onClick={this.search} className='btn btn-primary mx-1'>Buscar</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
