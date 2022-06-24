import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Link } from 'react-router'
import Jump from 'jump.js'
import userConnector from 'lib/frontend/site/connectors/user'
import config from 'lib/config'
import Footer from 'lib/frontend/site/footer/component'
import BannerGrabadora from 'lib/frontend/site/banner-grabadora/component'
import forumStore from 'ext/lib/stores/forum-store/forum-store'
import ForumContainer from './forum-container/component'
import ForumCard from './forum-card/component'
import Search from './search/component'
import ListForumTopics from '../list-forum-topics/component'
import BannerHomeAbout from './banner-home-about/component'
import BannerHomeBajada from './banner-home-bajada/component'

class HomeMultiForum extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 0,
      activeFilter: 'byDate',
      forums: []
    }
  }

  componentDidMount () {
    const {
      activeFilter
    } = this.state;

    forumStore
      .filterBy(activeFilter)
      .then((forums) => {
        this.setState({
          forums,
          // las páginas son de a 3 (definido en ext/lib/api/filter.js), entonces si devuelve 3, tal vez hay más
          showMore: forums.length === 3
        })
      })
      .catch(console.error)
  }

  handleClick = (name) => {
    const { page } = this.state;

    forumStore
      .filterBy(name)
      .then((forums) => {
        this.setState({
          page,
          forums,
          activeFilter: name
        })
      })
      .catch(console.error)
  }

  handleMoreClick = () => {
    const {
      page,
      activeFilter
    } = this.state;

    forumStore
      .filterBy(activeFilter, page + 1)
      .then((forums) => {
        this.setState({
          page: this.state.page + 1,
          forums: [...this.state.forums, ...forums],
          showMore: forums.length === 3
        });
      })
      .catch(console.error)
  }

  // handleButtonClick = () => {
  //   Jump('#consultas')
  //   // const consultasNode = ReactDOM.findDOMNode(this.refs.consultas)
  //   // window.scrollTo(0, consultasNode.offsetTop)
  // }

  render () {
    if (this.props.user.state.pending) return null

    const {
      showMore,
      activeFilter,
      forums
    } = this.state
    
    return (
      <div className='ext-site-home-multiforum'>
        <BannerHomeBajada />
        <BannerHomeAbout />
        <BannerGrabadora />
        <div className='container forums-list my-5 py-5' id='consultas'>
          <h2 className='forums-list-title mb-5 text-center is-size-2'>VOTÁ Y COMENTÁ</h2>
          <p className="text-center mx-5 mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad voluptatem possimus illum aliquid tenetur minus aliquam atque incidunt voluptate quae! Facere eveniet accusamus molestiae dignissimos quaerat, quam quo. Enim, minus.</p>
          {/* <div className='about-icons-container'>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/icono-informate.png'
                alt='Graba tu audio' />
              <p><b>Informate</b></p>
              <p>Sobre las propuestas existentes</p>
            </div>
            <div className='hidden-sm-down'>
              <i className='fas fa-angle-right fa-2x m-3' />
            </div>
            <div className='hidden-md-up'>
              <i className='fas fa-angle-down fa-2x m-3' />
            </div>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/icono-aporta.png'
                alt='Describila y detallala' />
              <p><b>Votá</b></p>
              <p>Las acciones de cada propuesta</p>
            </div>
            <div className='hidden-sm-down'>
              <i className='fas fa-angle-right fa-2x m-3' />
            </div>
            <div className='hidden-md-up'>
              <i className='fas fa-angle-down fa-2x m-3' />
            </div>
            <div className='icon-container'>
              <img
                className='the-icon mx-auto'
                src='/lib/frontend/site/home-multiforum/icono-propuesta.png'
                alt='¡Enviá tu propuesta!' />
              <p><b>Comentá</b></p>
              <p>Decinos que opinas de las propuestas</p>
            </div>
          </div> */}
          {!!forums.length && forums.map((forum, key) => (
            <ListForumTopics forum={forum} key={forum.id} />
          ))}
          {/* <div className="filter-container content-center">
            <div className="btn-group btn-group-sm dropdown-element" role="group" aria-label="Filtros">
            <button
                className={`btn dropbtn ${activeFilter === 'byDate' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byDate')}
              >
              {(() => {
                switch(this.state.activeFilter) {
                  case 'byDate':
                    return  'Nuevas'
                  case 'byPopular':
                    return 'Relevantes'
                  case 'byClosed':
                    return 'Finalizadas'
                  }
              })()}
              </button>
            <ul className='dropdown-content'>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byDate' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byDate')}
              >
                Nuevas
              </li>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byPopular' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byPopular')}
              >
                Relevantes
              </li>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byClosed' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byClosed')}
              >
                Finalizadas
              </li></ul>
            </div>
          </div>

          <Search />

          {!forums.length && <h3 className="no-result content-center">No hay resultados</h3>}

          {!!forums.length && forums.map((forum, key) => (
            <ForumContainer forum={forum} key={forum.id} />
          ))}
          {!!forums.length && showMore &&
            <div className='row content-center'>
              <button className="btn btn-active show-more" onClick={this.handleMoreClick}>
                Cargar más consultas
              </button>
            </div>
          } */}
        </div>
        <Footer />
      </div>
    )
  }
}

export default userConnector(HomeMultiForum)
