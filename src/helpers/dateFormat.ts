import {
    format,
    formatDistanceToNow,
    isToday,
    isYesterday,
} from "date-fns";

export const formatDate = (
    date: string | Date
) => {
    return format(
        new Date(date),
        "dd MMM yyyy"
    );
};

export const formatTime = (
    date: string | Date
) => {
    return format(
        new Date(date),
        "hh:mm a"
    );
};

export const formatDateTime = (
    date: string | Date
) => {
    return format(
        new Date(date),
        "dd MMM yyyy, hh:mm a"
    );
};

export const formatSmartDate = (
    date: string | Date
) => {
    const d = new Date(date);

    if (isToday(d)) {
        return "Today";
    }

    if (isYesterday(d)) {
        return "Yesterday";
    }

    return formatDistanceToNow(d, {
        addSuffix: true,
    });
};