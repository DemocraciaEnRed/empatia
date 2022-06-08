import React, { Component } from 'react'
import t from 't-component'

export default class Footer extends Component {
  render () {
    let source = null
    if (this.props.source) {
      source = (
        <div className='source'>
          <p>
            <i className="fa-solid fa-arrow-up-right-from-square fa-lg text-primary mr-1"></i>
            <a
              href={this.props.source}
              target='_blank'
              rel='noopener noreferrer'
              className='is-size-6'>
              {t('proposal-article.view-original-text')}
            </a>
          </p>
        </div>
      )
    }
    let links = null
    if (this.props.links && this.props.links.length > 0) {
      links = (
        <div className='links'>
          <h6 className="is-size-6 mb-2">{t('common.more-information')}</h6>
          {
            this.props.links
              .map(function (link) {
                if (!link.text) return null
                return (
                  <p key={link._id} >
                     <i className="fa-solid fa-link mr-1"></i>
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='is-size-6'>
                      {link.text}
                    </a>
                  </p>
                )
              })
          }
        </div>
      )
    }

    return (
      <div className='topic-footer topic-article-content'>
        {links}
        {source}
      </div>
    )
  }
}