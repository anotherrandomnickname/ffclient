import moment from 'moment'

moment.locale('ru')

class LocalDate {
  public date: Date
  public baked: string = ''

  constructor(date: Date) {
    if (date !== null) {
      this.date = date
      this.bakeData()
    } else {
      this.date = new Date()
    }
  }

  public getDate(): string {
    return this.baked
  }

  private bakeData(): void {
    if (this.date) {
      const postDateMs: number = moment.utc(this.date).valueOf()
      const nineDaysMs: number = 777600000
      const currentDate: number = moment.utc(this.date).valueOf()
      const currentTime = moment.utc().valueOf()

      if (nineDaysMs - (currentTime - postDateMs) >= 0) {
        this.baked = moment.utc(this.date).from(currentTime)
      } else {
        this.baked = moment
          .utc(this.date)
          .format('lll')
          .replace(/[.,]/g, '')
      }
    }
  }
}

export default LocalDate
