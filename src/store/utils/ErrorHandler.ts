class ErrorHandler {
  public registry(status: number): string | null {
    switch (status) {
      case 1:
        return null
      default:
        return null
    }
  }

  public serverStatus(status: number): string | null {
    if (status) {
      switch (status) {
        default:
          return ''
      }
    } else {
      return null
    }
  }
}

export default new ErrorHandler()
