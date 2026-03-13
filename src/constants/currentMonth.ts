export const startOfCurrentMonth = new Date();
startOfCurrentMonth.setDate(1);
startOfCurrentMonth.setHours(0, 0, 0, 0);

export const endOfCurrentMonth = new Date();
endOfCurrentMonth.setMonth(endOfCurrentMonth.getMonth() + 1);
endOfCurrentMonth.setDate(0);
endOfCurrentMonth.setHours(23, 59, 59, 999);
