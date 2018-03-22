import React from "react"
import GroupableElement from "./GroupableElement"
export default class Checkbox extends GroupableElement{
    static defaultClassname = "__checkboxElement__"

    constructor(props) {
        super(props)
    }

    async onClick(e) {
        await super.onChange(!this.state.value);
        
    }

    render() {
        const {className} = this.props;
        return <div onClick={this.onClick.bind(this)} className={`${Checkbox.defaultClassname} ${className}`}>
             <svg>
            </svg>
        </div>
    }
}