import dayjs from 'dayjs';

import {EDateFormatPattern} from '../types';

import {i18n} from './i18n';

export const formatDate = (date: Date | string) =>
  dayjs(date).format(EDateFormatPattern.DATE_WITH_SLASH);

export const formatDateTime = (
  date: Date | string
): {
  time: string;
  date: string;
} => {
  const parsedDate = dayjs(date);

  if (isNaN(parsedDate.valueOf())) {
    throw new Error('Invalid date!');
  }

  const time = parsedDate.format(EDateFormatPattern.TIME);
  const formattedDate = formatDate(date);

  return {time, date: formattedDate};
};

export const getTime = (date: Date) => {
  return dayjs(date).format(EDateFormatPattern.FULL_TIME);
};

export const formatDateDisplay = (dateFromBackend: Date) => {
  const today = dayjs();
  const targetDate = dayjs(dateFromBackend);

  if (targetDate.isSame(today, 'day')) {
    return i18n.t('today');
  }

  return targetDate.format(EDateFormatPattern.DATE_WITH_SLASH);
};

// GREEN-API отдаёт время в секундах
export const formatUnixTime = (timestamp: number) =>
  dayjs.unix(timestamp).format(EDateFormatPattern.TIME);
