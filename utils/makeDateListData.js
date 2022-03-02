const makeDateListData = (currentDate) => {
  const startDate = new Date(currentDate.setUTCHours(0, 0, 0));
  const dateList = [];

  for (let i = 1; i < 8; i++) {
    const dayAfterToday = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString();
    dateList.push({
      date: dayAfterToday,
      isChecked: false,
    });
  }

  return dateList;
};

module.exports = makeDateListData;
