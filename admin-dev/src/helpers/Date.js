const DateHelper = {
  getMonthAsString (date, locale = 'en-us') {
    return date.toLocaleString(locale, {month: 'long'})
  },
  getDateMonthRange (fromDate, toDate) {
    if (toDate === '') {
      toDate = new Date()
    }
    let timeDiff = Math.abs(fromDate.getTime() - toDate.getTime())
    return Math.ceil(timeDiff / (1000 * 3600 * 24 * 12))
  }
}

export default DateHelper
