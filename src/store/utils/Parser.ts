export default class Parser {
  public static openTags: RegExp = /@([^! ].*?)@/g
  public static closeTags: RegExp = /@(!.*?)@/g

  public static switchText(key: string, value: string | number): string {
    switch (key) {
      case 'фон':
        return 'background: ' + value + '; '
      case 'интервал':
        if (value >= 10) {
          value = 10
        }
        return 'letter-spacing: ' + value + 'px' + '; '
      case 'позиция':
        return 'margin: ' + '0 auto' + '; display: table;'
      case 'вес':
        if (value >= 1000) {
          value = 1000
        }
        return 'font-weight: ' + value + ';'
      case 'цвет':
        return 'color: ' + value + '; '
      case 'размер':
        if (value >= 100) {
          value = 100
        }
        return 'font-size: ' + value + 'px; '
      case 'шрифт':
        return 'font-family: ' + value + '; '
      default:
        return ''
    }
  }

  public static openTagsReplacer(
    str: string,
    offset: string,
    s: string,
  ): string {
    const tags = str.substring(1, str.length - 1).split(':')
    const length = tags.length
    const keys = new Array(length)
    const values = new Array(length)
    let result: string = '<span style="'
    /* console.log('STR', str)
    console.log('TAGS:', tags) */

    let i = tags.length
    while (--i >= 1) {
      const value = tags[i].split('[')
      keys[i] = value[0]
      values[i] = value[1].slice(0, -1)
      result = result + Parser.switchText(keys[i], values[i])
      /* console.log('KEY:', keys[i])
      console.log('VALUE:', values[i]) */
    }
    i = length
    while (--i >= 1) {}

    /* console.log('RESULT STRING:', result + '">') */

    return result + '">'
  }

  public static closeTagsReplacer(
    str: string,
    offset: string,
    s: string,
  ): string {
    return '</span>'
  }

  public static process(str: string): string {
    let result = str
    result = result.replace(Parser.openTags, Parser.openTagsReplacer)
    result = result.replace(Parser.closeTags, Parser.closeTagsReplacer)
    result = result.replace(/\n/g, '</br>') /* Replaces line breaks \n */
    return result
  }
}
