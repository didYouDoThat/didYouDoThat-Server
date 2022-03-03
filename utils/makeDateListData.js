const makeDateListData = (currentDate) => {
  const nowDate = new Date(currentDate);
  const initialStartDate = new Date(new Date(currentDate).setUTCHours(0, 0, 0));
  const startDate = new Date(initialStartDate.setDate(nowDate.getDate()));

  const dateList = [{
    date: startDate.toISOString(),
    isChecked: false,
  }];

  for (let i = 1; i < 7; i++) {
    const dayAfterToday = new Date(
      startDate.setDate(startDate.getDate() + 1)
    ).toISOString();

    dateList.push({
      date: dayAfterToday,
      isChecked: false,
    });
  }

  console.log(dateList);
  return dateList;
};

module.exports = makeDateListData;
