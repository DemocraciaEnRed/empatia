import React, { Component } from 'react'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/backend/url-builder'
import userConnector from 'lib/frontend/site/connectors/user'
import Content from './content/component'
import Footer from './footer/component'
import AdminActions from './admin-actions/component'
import Social from './social/component'
import Comments from './comments/component'
import TopicAction from './topic-action/component'
import Header from './header/component'
import LateralBar from './lateral-bar/component'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false,
      nodes: false
    }
    this.scrollTo = this.scrollTo.bind(this)
  }

  // componentWillMount () {
  //   bus.on('sidebar:show', this.toggleSidebar)
  // }

  componentDidMount() {
    const nodes = Array.from(document.querySelectorAll('span[style="font-size: 32px;"]'))
    if (nodes) {
      this.setState({
        nodes: nodes
      })
    }
  }

  scrollTo = (where) => {
    let element = document.getElementById(where)
    element.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    })
  }

  // componentWillUnmount () {
  //   bus.off('sidebar:show', this.toggleSidebar)
  // }

  // toggleSidebar = (bool) => {
  //   this.setState({
  //     showSidebar: bool
  //   })
  // }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  render () {
    const {
      topic,
      forum,
      user
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics

    if (!topic) {
      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {
            canCreateTopics && (
              <button
                className='btn btn-primary'
                onClick={this.handleCreateTopic} >
                {t('homepage.create-debate')}
              </button>
            )
          }
        </div>
      )
    }
    
    return (
      <div className={`topic-article-wrapper`}>

        {/* <Social topic={topic} /> */}

        <div className='secondary-wrapper container'>

        {/* {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        } */}
        {/* <AdminActions forum={forum} topic={topic} /> */}

        <Header
          closingAt={topic.closingAt}
          closed={topic.closed}
          author={topic.author}
          authorUrl={topic.authorUrl}
          tags={topic.tags}
          tag={topic.tag}
          forumName={forum.name}
          mediaTitle={topic.mediaTitle}
          ownerName={topic.owner.displayName}
          contentType={forum.extra && forum.extra.contentType} />
        <div>
          <button className="btn btn-primary mr-3" onClick={() => this.scrollTo('the-action')}><i className="fas fa-thumbs-up"></i> Votá esta propuesta</button>
          <button className="btn btn-main" onClick={() => this.scrollTo('the-comments')}><i className="fas fa-comment"></i> Comentá y debatí</button>
        </div>
        <h3 className="title mt-5">INTRODUCCIÓN</h3>
        <div className="mb-5 mt-3 text-justify" style={{whiteSpace: 'pre-line'}}>
          {topic.attrs.introduccion}
        </div>
        {forum.extra && forum.extra.contentType == 'llamado' && 
            <div className='llamado-content'>
              {topic.extra && topic.extra.problema && 
                <div>
                  <h5 className="topic-article-content">Problema a resolver</h5>
                  <Content clauses={[{markup: topic.extra.problema}]} />
                </div> 
              }
              <h5 className="topic-article-content">Propuesta</h5>
              <Content clauses={topic.clauses} />
            </div> 
          || topic.clauses && 
            <Content clauses={topic.clauses} />
        }
        <br/>
        {
          topic.links && (
            <Footer
              source={topic.source}
              links={topic.links}
              socialUrl={topic.url}
              title={topic.mediaTitle} />
          )
        }
      </div>
      { topic.action.method &&
        <div id="the-action" className="the-action-container">
          <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-top' />
          <img src='/lib/frontend/site/home-multiforum/barritas-colores.png' className='barritas-colores-bottom' />
          <div className="container">
            <h2 className="title mt-1 mb-5 text-center">VOTÁ ESTA PROPUESTA</h2>
            <TopicAction
              topic={topic}
              userAttrs={userAttrs} />
          </div>
        </div>
      }
      <div className="secondary-wrapper container">

        {
          !user.state.pending && <Comments forum={forum} topic={topic} />
        }
      </div>
      {/* {
        this.state.nodes && <LateralBar nodes={this.state.nodes}/>
      } */}

  </div>

    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
