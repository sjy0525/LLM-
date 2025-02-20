import { useState } from "react"
import { Button, Input, message as antdMessage } from "antd"
import {
  GlobalOutlined,
  ArrowUpOutlined,
  PaperClipOutlined,
  PictureTwoTone,
  FileTextTwoTone,
  CloseOutlined
} from '@ant-design/icons';

import { uploadFileAPI } from "../apis";
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from '../store';
import useCozeChat from '../hooks/useCozeChat';
import "./inputbox.scss"


const { TextArea } = Input

const InputBox = (/*{ conversationId = "" }*/) => {
  interface UploadedFile {
    id: string
    name: string
    type: "file" | "image" | "unknown"
    file_id: string | null
    status: "uploading" | "success" | "error"
  }

  const supportedFormats = {
    file: [
      "DOC",
      "DOCX",
      "XLS",
      "XLSX",
      "PPT",
      "PPTX",
      "PDF",
      "Numbers",
      "CSV",
    ],
    images: [
      "JPG",
      "JPG2",
      "PNG",
      "GIF",
      "WEBP",
      "HEIC",
      "HEIF",
      "BMP",
      "PCD",
      "TIFF",
    ],
  }
  const allowedExtensions = [
    ...supportedFormats.file,
    ...supportedFormats.images,
  ]
    .map((ext) => `.${ext.toLowerCase()}`)
    .join(",")

  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { botId } = useUserStore();
  const { sendMessage } = useCozeChat();
  const [isSending, setIsSending] = useState(false); // 新增发送中状态

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files).filter((file) => {
          const extension = file.name.split(".").pop()?.toUpperCase()
          return (
            extension &&
            [...supportedFormats.file, ...supportedFormats.images].includes(
              extension,
            )
          )
        })

        const newFiles = selectedFiles.map((file) => {
          const extension = file.name.split(".").pop()?.toUpperCase()
          let type: "file" | "image" | "unknown" = "unknown"
          if (extension && supportedFormats.file.includes(extension)) {
            type = "file"
          } else if (extension && supportedFormats.images.includes(extension)) {
            type = "image"
          }
          return {
            id: uuidv4(),
            name: file.name,
            type,
            file_id: null,
            status: "uploading" as const,
          }
        })

        setFiles((prevFiles) => [...prevFiles, ...newFiles])

        for (const newFile of newFiles) {
          const file = selectedFiles.find((f) => f.name === newFile.name)
          if (file) {
            try {
              const response = await uploadFileAPI({ file })
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === newFile.id
                    ? { ...f, file_id: response.data.id, status: "success" }
                    : f,
                ),
              )
            } catch (_) {
              antdMessage.error("File upload failed")
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === newFile.id ? { ...f, status: "error" } : f,
                ),
              )
              setTimeout(() => {
                setFiles((prevFiles) =>
                  prevFiles.filter((f) => f.id !== newFile.id),
                )
                antdMessage.info(`Failed file ${newFile.name} has been removed`)
              }, 3000)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in handleFileChange:", error)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase()
    if (extension && supportedFormats.file.includes(extension)) {
      return <FileTextTwoTone />
    }
    if (extension && supportedFormats.images.includes(extension)) {
      return <PictureTwoTone />
    }
    return null
  }

  const handleSend = async () => {
    if (!botId) {
      antdMessage.error('请确保 Bot ID 已设置');
      return;
    }
    if (message.trim() === '') return;

    setIsSending(true); // 开始发送，设置为 loading 状态
    try {
      await sendMessage(message, botId);
    } catch (error) {
      antdMessage.error('消息发送失败，请稍后重试。');
    } finally {
      setIsSending(false); // 发送完成，取消 loading 状态
      setMessage(''); // 清空输入框
    }
  };

  return (
    <div className="inputBox">
      <div className="uploadedFiles">
        {files.map((file, index) => (
          <div key={index} className="uploadedFile">
            <div className="fileIcon">{getFileIcon(file.name)}</div>
            <div className="fileDetails">
              <div className="fileName" title={file.name}>
                <strong>{file.name}</strong>
              </div>
              <div className="fileStatus">
                {file.status === "uploading" && "上传中"}
                {file.status === "success" && "成功上传"}
                {file.status === "error" && "上传失败"}
              </div>
            </div>
            <Button
              shape="circle"
              icon={<CloseOutlined />}
              className="deleteButton"
              size="small"
              ghost
              onClick={() => handleDeleteFile(file.id)}
            />
          </div>
        ))}
      </div>
      <TextArea
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
        placeholder="给LLM-Chat助手发送消息吧~"
        autoSize={{ minRows: 3, maxRows: 15 }}
        onPressEnter={handleSend}
        className="inputBox-textarea"
      />
      <div className="toolBar">
        <div className="toolBar-left">
          <Button shape="round" icon={<GlobalOutlined />}>
            联网搜索
          </Button>
        </div>
        <div className="toolBar-right">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            multiple
            accept={allowedExtensions}
            onChange={handleAddFile}
          />
          <Button
            shape="circle"
            ghost
            icon={<PaperClipOutlined />}
            className="button"
            onClick={() => document.getElementById("fileInput")?.click()}
          ></Button>
          <Button
            shape="circle"
            icon={<ArrowUpOutlined />}
            onClick={handleSend}
            loading={isSending} // 设置 loading 状态
          ></Button>
        </div>
      </div>
    </div>
  )
}

export default InputBox
