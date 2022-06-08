import React, { Component } from 'react'

export default class Content extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false,
      sections: [],
      nodes: false,
      selectedSection: null
    }
    this.toggleSection = this.toggleSection.bind(this)
  }

  componentDidMount () {
    // deep copy
    let clausesCopy = JSON.parse(JSON.stringify(this.props.clauses))
    clausesCopy.sort(function (a, b) {
      return a.position > b.position ? 1 : -1
    })
    const sections = []
    let newSection = {
      title: '',
      content: []
    }
    let skipFirstRun = true
    clausesCopy.forEach((clause, index) => {
      // check if its a title, its a new section
      if (clause.markup.includes('font-size: 24px;')){
        // if its the first run, dont push the first section
        if (skipFirstRun) {
          skipFirstRun = false
          newSection.title = clause.markup
        } else {
          sections.push(newSection)
          newSection = {
            title: clause.markup,
            content: []
          }
        }
      } else {
        newSection.content.push(clause)
      }
    })
    sections.push(newSection)
    this.setState({
      sections: sections
    })
    // const nodes = Array.from(document.querySelectorAll('span[style="font-size: 24px;"]'))
    // const htmlContent = this.createClauses(this.props.clauses)
    // if (nodes) {
    //   this.setState({
    //     nodes: nodes,
    //     htmlContent: htmlContent
    //   })
    // }
  }

  createClauses (clauses) {
    return {
      __html: clauses
        .sort(function (a, b) {
          return a.position > b.position ? 1 : -1
        })
        .map(function (clause) {
          return clause.markup
        })
        .join('')
        .replace(/<a/g, '<a rel="noopener noreferer" target="_blank"')
    }
  }

  toggleSection (index) {
    if (this.state.selectedSection === index) {
      this.setState({
        selectedSection: null
      })
    } else {
      this.setState({
        selectedSection: index
      })
    }
  }

  render () {
    return (
      <div className='entry-content topic-article-content topic-content-special my-4'>
        {
          this.state.sections.map((section, indexSec) => {
            return (
              <div className="content-section my-4" key={indexSec}>
                <div onClick={() => this.toggleSection(indexSec)} className="section-title">
                  <div dangerouslySetInnerHTML={{ __html: section.title }} style={{ flexGrow: '1' }} />
                  {
                    this.state.selectedSection === indexSec ?
                      <i className="ml-3 fas fa-2x fa-angle-up"></i>
                      : <i className="ml-3 fas fa-2x fa-angle-down"></i>
                  }
                  
                </div>
                <div className={`section-body ${this.state.selectedSection === indexSec ? 'visible' : 'hidden'}`} >
                  {
                    section.content.map((content, indexCon) => {
                      return (
                        <div className='text-justify' dangerouslySetInnerHTML={{ __html: content.markup }} key={`cont-${indexSec}-${indexCon}`} />
                        )
                    })
                  }
                </div>
              </div>
            )
          })
        }
        {/* <div
          className='clauses'
          dangerouslySetInnerHTML={createClauses(this.props.clauses)} /> */}
      </div>
    )
  }
}
// export default class Content extends Component {
//   render () {
//     function createClauses (clauses) {
//       return {
//         __html: clauses
//           .sort(function (a, b) {
//             return a.position > b.position ? 1 : -1
//           })
//           .map(function (clause) {
//             return clause.markup
//           })
//           .join('')
//           .replace(/<a/g, '<a rel="noopener noreferer" target="_blank"')
//       }
//     }

//     return (
//       <div className='entry-content topic-article-content'>
//         <div
//           className='clauses'
//           dangerouslySetInnerHTML={createClauses(this.props.clauses)} />
//       </div>
//     )
//   }
// }
