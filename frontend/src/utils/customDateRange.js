import { startOfDay, endOfDay, addDays, subDays } from 'date-fns';

const getLast6MonthsDate = () => {
  const today = new Date();
  const lastMonthDate = new Date(today);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 6);

  return lastMonthDate
}

export const customDateRange = [{
  label: 'today',
  value: [startOfDay(new Date()), endOfDay(new Date())]
},
{
  label: 'yesterday',
  value: [startOfDay(addDays(new Date(), -1)), endOfDay(addDays(new Date(), -1))]
},
{
  label: 'last7Days',
  value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())]
},
{
  label: 'Last 30 Days',
  value: [startOfDay(subDays(new Date(), 30)), endOfDay(new Date())]
},
{
  label: 'Last 6 Months',
  value: [startOfDay(getLast6MonthsDate()), endOfDay(new Date())]
},
{
  label: 'Last Year',
  value: [startOfDay(subDays(new Date(), 365)), endOfDay(new Date())]
},
{
  label: 'All',
  value: [1, endOfDay(new Date())]
},
]