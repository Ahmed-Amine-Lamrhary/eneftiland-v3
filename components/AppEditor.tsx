import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import { EditorProps } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const Editor: any = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod: any) => mod.Editor),
  { ssr: false }
)

interface AppEditorProps {
  defaultValue: any
  onChange: any
}

const AppEditor = ({ defaultValue, onChange }: AppEditorProps) => {
  const [editorState, setEditorState] = useState<any>()

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(defaultValue || "")
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )

    setEditorState(EditorState.createWithContent(contentState))
  }, [])

  return (
    <Editor
      defaultEditorState={editorState}
      onEditorStateChange={setEditorState}
      wrapperClassName="app-editor-wrapper"
      editorClassName="app-editor-editor"
      onChange={(e: any) =>
        onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      }
    />
  )
}

export default AppEditor
