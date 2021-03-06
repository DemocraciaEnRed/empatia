import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import CommentsForm from './form/component'
import CommentsList from './list/component'
import CommentsOrderBy from './order-by/component'
import commentsConnector from './connector'

export class Comments extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comments: props.commentsFetch.value,
      pagination: props.commentsFetch.meta.pagination
    }
  }

  componentWillReceiveProps ({ commentsFetch }) {
    if (!commentsFetch.pending) {
      this.setState({
        comments: commentsFetch.value,
        pagination: commentsFetch.meta.pagination
      })
    }
  }

  render () {
    const { commentsFetch } = this.props
    return (
      <div id="the-comments" className='topic-comments'>
        <div className='topic-article-content'>
          <h2 className='topic-comments-title'>
           {
            this.state.comments !== null 
              && <span className="text-main">{this.state.comments.length}</span>
           }
           {
            this.state.comments !== null && this.state.comments.length === 1 ? ' COMENTARIO' : ' COMENTARIOS'
           }
            <CommentsOrderBy onSort={this.props.handleSort} />
            {
              new Date(this.props.topic.closingAt) < new Date() &&
              (
                <div className="alert alert-info" role="alert" style={{marginTop: '10px'}}>
                  <span className="icon-info" style={{marginRight: '5px'}}></span>
                  <span>La Consulta ha finalizado.</span>
                  <br /><span><Link to='/'>Te invitamos a conocer otras consultas y participar.</Link></span>
                </div>
              )
            }
          </h2>
          {
            new Date(this.props.topic.closingAt) >= new Date() &&
            <CommentsForm
              topic={this.props.topic}
              forum={this.props.forum}
              onSubmit={this.props.handleCreate}
              commentsCreating={this.props.commentsCreating} />
          }
          {!commentsFetch.rejected && (
            <CommentsList
              topic={this.props.topic}
              forum={this.props.forum}
              loading={commentsFetch.pending}
              comments={this.state.comments}
              onReply={this.props.handleReply}
              commentsReplying={this.props.commentsReplying}
              onDelete={this.props.handleDelete}
              onDeleteReply={this.props.handleDeleteReply}
              commentDeleting={this.props.commentDeleting}
              onUnvote={this.props.handleUnvote}
              onUpvote={this.props.handleUpvote}
              onDownvote={this.props.handleDownvote}
              onFlag={this.props.handleFlag}
              onUnflag={this.props.handleUnflag}
              onReplyEdit={this.props.handleReplyEdit}
              onEdit={this.props.handleEdit} />
          )}
          {
            this.state.pagination &&
            this.state.pagination.page < this.state.pagination.pageCount &&
            (
              <div className='load-more'>
                <button
                  type='button'
                  className='btn btn-primary btn-block'
                  disabled={commentsFetch.pending}
                  onClick={this.props.handleNextPage}>
                  {t('comments.load-more')}
                </button>
              </div>
            )
          }
          {commentsFetch.rejected && (
            <div className='alert alert-danger' role='alert'>
              {t('modals.error.default')}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default commentsConnector(Comments)
