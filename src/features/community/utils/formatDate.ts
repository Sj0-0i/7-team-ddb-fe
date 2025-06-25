import {
  getKSTDate,
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from '../../../shared/lib/date';

export type DateFormatType = 'default' | 'detail' | 'relative';

export function formatDateByType(
  isoString: string,
  type: DateFormatType,
): string {
  switch (type) {
    case 'default':
      return formatDefaultDate(isoString);
    case 'detail':
      return formatDetailDate(isoString);
    case 'relative':
      return formatRelativeDate(isoString);
    default:
      return formatDefaultDate(isoString);
  }
}

// 기본 날짜 표기
function formatDefaultDate(isoString: string): string {
  const date = getKSTDate(isoString);
  return format(date, 'yyyy.MM.dd');
}

// 기록 상세 페이지 표기
function formatDetailDate(isoString: string): string {
  const date = getKSTDate(isoString);
  return format(date, 'yy.MM.dd HH:mm');
}

// 댓글·방문 기록용 상대 시간 표기
function formatRelativeDate(isoString: string): string {
  const target = getKSTDate(isoString);
  const now = getKSTDate();

  if (differenceInDays(now, target) < 1) {
    if (differenceInMinutes(now, target) < 1) {
      return '방금 전';
    }
    if (differenceInHours(now, target) < 1) {
      const minutes = differenceInMinutes(now, target);
      return `${minutes}분 전`;
    }
    const hours = differenceInHours(now, target);
    return `${hours}시간 전`;
  }

  if (differenceInWeeks(now, target) < 1) {
    const days = differenceInDays(now, target);
    if (days === 1) return '어제';
    return `${days}일 전`;
  }

  if (differenceInWeeks(now, target) < 4) {
    const weeks = differenceInWeeks(now, target);
    return `${weeks}주 전`;
  }

  const targetYear = target.getFullYear();
  const nowYear = now.getFullYear();

  const month = target.getMonth() + 1;
  const day = target.getDate();

  if (targetYear === nowYear) {
    return `${month}월 ${day}일`;
  } else {
    return `${targetYear}년 ${month}월 ${day}일`;
  }
}
