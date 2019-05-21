import React, { Component } from 'react'

class Song extends Component {
    render () {
        return (
            <div>
                <div>
                    {this.props.title}
                </div>
            </div>
        )
    }
}

export default Song
