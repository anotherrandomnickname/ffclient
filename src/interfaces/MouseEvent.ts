export interface MouseEventValue extends MouseEvent {
  value?: string | number
}

export interface MouseEvent {
  target: Array<MouseEventValue>
  currentTarget?: any
  preventDefault: () => void
}
