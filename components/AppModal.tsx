import React from "react"
import { Modal } from "react-bootstrap"

interface AppModalProps {
  show: boolean
  onHide: any
  children: any
  size?: "lg" | "sm" | "xl" | undefined
  closeButton?: boolean
  title?: string
}

const AppModal = ({
  show,
  onHide,
  children,
  size = "lg",
  closeButton = true,
  title,
}: AppModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered size={size}>
      <Modal.Header closeButton={closeButton}>
        {title && <h6 className="mb-0 mt-1 fw-bold">{title}</h6>}
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  )
}

export default AppModal
