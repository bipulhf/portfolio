import { useEffect, useId, useRef } from 'react'
import { $generateHtmlFromNodes } from '@lexical/html'
import { $createCodeNode, CodeNode } from '@lexical/code'
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { ListItemNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { $createImageNode, ImageNode } from './image-node'
import { EditorPendingShell } from '~/components/loaders/crayon-pending'

function ToolbarButton({
  active = false,
  children,
  onClick,
}: Readonly<{
  active?: boolean
  children: string
  onClick: () => void
}>) {
  return (
    <button
      className={`rounded-[0.85rem] border px-3 py-2 font-hand text-[1rem] transition-colors ${active ? 'border-ink bg-yellow text-ink' : 'border-ink/15 bg-white/65 text-ink-soft hover:border-ink hover:text-ink'}`}
      onClick={(event) => {
        event.preventDefault()
        onClick()
      }}
      type="button"
    >
      {children}
    </button>
  )
}

function ToolbarPlugin({
  onUploadImage,
}: Readonly<{
  onUploadImage?: (file: File) => Promise<string>
}>) {
  const [editor] = useLexicalComposerContext()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="editor-toolbar">
      <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>Undo</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>Redo</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>Bold</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>Italic</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>Underline</ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode())
            }
          })
        }
      >
        P
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h2'))
            }
          })
        }
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h3'))
            }
          })
        }
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode())
            }
          })
        }
      >
        Quote
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>List</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>1.</ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>Clear list</ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const codeNode = $createCodeNode()
              selection.insertNodes([codeNode])
              codeNode.selectEnd()
            }
          })
        }
      >
        Code
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const href = window.prompt('Enter a URL')
          if (!href) {
            return
          }

          editor.dispatchCommand(TOGGLE_LINK_COMMAND, href)
        }}
      >
        Link
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}>Rule</ToolbarButton>
      {onUploadImage ? (
        <>
          <input
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              event.currentTarget.value = ''

              if (!file) {
                return
              }

              const src = await onUploadImage(file)

              editor.update(() => {
                const selection = $getSelection()
                const imageNode = $createImageNode(src, file.name.replace(/\.[^.]+$/, ''))

                if ($isRangeSelection(selection)) {
                  selection.insertNodes([imageNode, $createParagraphNode()])
                } else {
                  $getRoot().append(imageNode, $createParagraphNode())
                }
              })
            }}
            ref={fileInputRef}
            type="file"
          />
          <ToolbarButton onClick={() => fileInputRef.current?.click()}>Image</ToolbarButton>
        </>
      ) : null}
    </div>
  )
}

function SeedHtmlPlugin({ html }: Readonly<{ html: string }>) {
  const seededRef = useRef(false)
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (seededRef.current || !html) {
      return
    }

    seededRef.current = true

    editor.update(() => {
      if ($getRoot().getTextContent().trim()) {
        return
      }

      const parser = new DOMParser()
      const document = parser.parseFromString(html, 'text/html')
      const text = document.body.textContent?.trim()

      if (text) {
        $getRoot().append($createParagraphNode().append($createTextNode(text)))
      }
    })
  }, [editor, html])

  return null
}

export function LexicalRichEditor({
  onChange,
  onUploadImage,
  placeholder = 'Start writing...',
  valueHtml,
  valueJson,
}: Readonly<{
  onChange: (value: { bodyHtml: string; bodyJson: Record<string, unknown> | null }) => void
  onUploadImage?: (file: File) => Promise<string>
  placeholder?: string
  valueHtml: string
  valueJson: Record<string, unknown> | null
}>) {
  const namespace = useId()

  if (typeof window === 'undefined') {
    return <EditorPendingShell />
  }

  return (
    <LexicalComposer
      initialConfig={{
        namespace,
        onError: (error) => {
          throw error
        },
        editorState: valueJson ? JSON.stringify(valueJson) : undefined,
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode, AutoLinkNode, HorizontalRuleNode, ImageNode],
        theme: {},
      }}
    >
      <div className="editor-shell">
        <ToolbarPlugin onUploadImage={onUploadImage} />
        <div className="editor-surface">
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={<ContentEditable className="editor-content" />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          {!valueJson && valueHtml ? <SeedHtmlPlugin html={valueHtml} /> : null}
          <OnChangePlugin
            ignoreSelectionChange
            onChange={(editorState, editor) => {
              editorState.read(() => {
                onChange({
                  bodyHtml: $generateHtmlFromNodes(editor, null),
                  bodyJson: editorState.toJSON() as unknown as Record<string, unknown>,
                })
              })
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  )
}
