import dayjs from 'dayjs'

export const formatTime = (time: number): string => {
  return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
}

export const setTimeDate = (time: number): number => {
  return Math.floor(time / 1000)
}

export const timeUnitI18n = (t: any, type: string, time: number): string => {
  const dataMap = new Map([
    ['day', t('common.day', time)],
    ['hour', t('common.hour', time)],
    ['minute', t('common.minute', time)],
    ['second', t('common.second', time)],
  ])
  return dataMap.get(type) || ''
}

export const secondToTime = (t: any, seconds: number): string => {
  if (!seconds) return `0 ${t('common.second', 0)}`

  let time = ''
  if (seconds < 60) {
    time = `${seconds} ${timeUnitI18n(t, 'second', seconds)}`
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    time = `${minutes} ${timeUnitI18n(t, 'minute', minutes)} ${sec} ${timeUnitI18n(t, 'second', sec)}`
  } else {
    const hours = Math.floor(seconds / (60 * 60))
    const minutes = Math.floor(Math.floor(seconds % 3600) / 60)
    const sec = Math.floor(Math.floor(seconds % 3600) % 60)

    const minuteUnit = timeUnitI18n(t, 'minute', minutes)
    const secondUnit = timeUnitI18n(t, 'second', sec)

    if (hours > 0 && hours < 24) {
      time = `${hours} ${timeUnitI18n(t, 'hour', hours)} ${minutes} ${minuteUnit} ${sec} ${secondUnit}`
    } else {
      const days = Math.floor(hours / 24)
      const h = hours - 24 * days
      time = `${days} ${timeUnitI18n(t, 'day', days)} ${h} ${timeUnitI18n(t, 'hour', h)} ${minutes} ${minuteUnit} ${sec} ${secondUnit}`
    }
  }
  return time
}