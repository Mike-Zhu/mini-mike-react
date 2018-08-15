const instantiateComponent = require('./instantiateComponent')
const Reconciler = require('./Reconciler')

class Component {
    constructor(props) {
        this.props = props
        this.currentElement = null
        this._renderedComponent = null
        this._renderedNode = null
    }

    _construct(element) {
        this._currentElement = element
    }

    mountComponent() {
        const renderedElement = this.render()
        const renderedComponent = instantiateComponent(renderedElement)
        this._renderedComponent = renderedComponent

        const _Vnode = Reconciler.mountComponent(renderedComponent)
        const _Dom = _Vnode.render()
        _Dom._reactVnode = _Vnode
        this._Vnode = _Vnode
        this._Dom = _Dom
        console.log(_Vnode)
        return _Dom
    }

    setState(partialState) {
        // debugger;
        this._pendingState = Object.assign({}, this.state, partialState)
        this.updateComponent(this._currentElement, this._currentElement)
    }

    updateComponent(preElement, nextElement) {
        // debugger;
        if (preElement !== nextElement) {
            //表示是props变化，重组了Element
        }
        //这里负责state变化那一部分
        //重新设置一些参数
        this._currentElement = nextElement

        this.props = nextElement.props
        this.state = this._pendingState || this.state
        this._pendingState = null

        const prevRenderedElement = this._renderedComponent._currentElement
        const nextRenderedElement = this.render()

        if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
            Reconciler.receiveComponent(this._renderedComponent, nextRenderedElement)
        } else {
            Reconciler.unmountComponent(this._renderedComponent)
            const nextRenderedComponent = instantiateComponent(nextRenderedElement)
            this._renderedNode = Reconciler.mountComponent(nextRenderedElement)

            DOM.replaceNode(this._renderedComponent._domNode, this._renderedNode)

        }
    }
}

function shouldUpdateComponent(prevElement, nextElement) {
    return prevElement.type === nextElement.type
}
module.exports = Component