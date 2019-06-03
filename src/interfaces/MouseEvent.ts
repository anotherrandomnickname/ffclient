export interface MouseEventValue extends MouseEvent {
  value?: string | number
}

export interface MouseEvent {
  target: MouseEventValue[]
  currentTarget?: any
  preventDefault: () => void
}
