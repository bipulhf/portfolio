import type { JSX } from 'react'
import type { EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'

export type SerializedImageNode = Spread<
  {
    alt: string
    src: string
    type: 'image'
    version: 1
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __alt: string

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__key)
  }

  static importJSON(serializedNode: SerializedImageNode) {
    return new ImageNode(serializedNode.src, serializedNode.alt)
  }

  constructor(src: string, alt = '', key?: NodeKey) {
    super(key)
    this.__src = src
    this.__alt = alt
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      alt: this.__alt,
      src: this.__src,
      type: 'image',
      version: 1,
    }
  }

  exportDOM() {
    const img = document.createElement('img')
    img.setAttribute('src', this.__src)
    img.setAttribute('alt', this.__alt)

    return { element: img }
  }

  createDOM(_config: EditorConfig) {
    const container = document.createElement('div')
    container.className = 'editor-image-block'
    return container
  }

  updateDOM() {
    return false
  }

  decorate() {
    return <img alt={this.__alt} className="editor-image-node" src={this.__src} />
  }
}

export function $createImageNode(src: string, alt = '') {
  return $applyNodeReplacement(new ImageNode(src, alt))
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}
