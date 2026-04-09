import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

export const fmtDate = (d) => {
    if (!d) return '—';
    return format(typeof d === 'string' ? parseISO(d) : d, 'dd MMM yyyy');
};

export const fmtDateTime = (d) => {
    if (!d) return '—';
    return format(typeof d === 'string' ? parseISO(d) : d, 'dd MMM yyyy, hh:mm a');
};

export const fmtRelative = (d) => {
    if (!d) return '—';
    return formatDistanceToNow(typeof d === 'string' ? parseISO(d) : d, { addSuffix: true });
};

export const daysUntil = (d) => {
    if (!d) return null;
    return differenceInDays(typeof d === 'string' ? parseISO(d) : d, new Date());
};

export const fmtCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join('');

export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
