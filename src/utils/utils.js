import writtenNumber from 'written-number'

export const convertObjectToSearchParams = (values) => {
  if (values) {
    // console.log(values)
    const search = Object.entries(values).filter((entry) => entry[1]).map(([key, value]) => `${key}=${value}`).join('&')
    return `?${search}`
  }
  return ''
}

export const convertSearchParamsToObject = (search) => {
  if (search) {
    const value = search.slice(1)
    const obj = {}
    value.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      obj[key] = value
    });
    return obj
  }
  return {}
}

export const isLoggedIn = () => !!localStorage.getItem('accessToken')

export const notCustomer = () => localStorage.getItem('roles') !== 'CUSTOMER'

export function getWrittenNumber(availAmount, { lang = 'vi' }) {
  let str = writtenNumber(availAmount, { lang })
  if (!str) {
    return ''
  }
  str = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  return `${str.replace(new RegExp('và ', 'g'), '')} đồng`
}

export function formatStringToNumber(value, isComma = true) {
  if (!value && value !== 0) {
    return '-'
  }
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })

  return formatter.format(value).replace(/,/g, isComma ? ',' : '.')
}

export function displayPrice(price) {
  if (price > 1000000000) {
    return `${price / 1000000000} Tỉ`
  }
  return `${price / 1000000} Triệu`
}

export const deleteAccents = (inputStr) => {
  let str = inputStr
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

export const generateCode = (text) => {
  const removeAccents = deleteAccents(text)

  return removeAccents.replaceAll(' ', '_')
}

function text2Link(text) {
  const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim
  const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim
  const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim
  return text
    .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
    .replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>')
}

export function text2HTML(s) {
  let text = s
  if (!text) {
    return ''
  }

  text = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  text = text2Link(text)
  text = text.replace(/\r\n?|\n/g, ' <br> ')
    .replace(/<br>\s*<br>/g, '</p><p>')
  text = `<span>${text}</span>`
  return text
}

export function hideEmail(email) {
  if (!email) return

  const [first, second] = email.split('@')
  const [...dot] = second.split('.').slice(1)
  return `${first.slice(0, 3)}***@***.${dot && dot.join('.')}`
}
