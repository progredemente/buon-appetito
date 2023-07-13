import {Component} from 'react';
import './Icon.css';

class Icon extends Component{

    render() {
        return (
            <span className="icon" style={{"--content": `"${this.props.icon}"`}}></span>
        )
    };
}

export default Icon;