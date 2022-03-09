const makeDateListData = (currentDate, localTimeOffset) => {
  const startDate = new Date(
    currentDate.setHours(currentDate.getHours() + localTimeOffset)
  );
  const initialStartDate = new Date(startDate.setUTCHours(0, 0, 0));

  const dateList = [
    {
      date: initialStartDate.toISOString(),
      isChecked: false,
    },
  ];

  for (let i = 1; i < 7; i++) {
    const dayAfterToday = new Date(
      initialStartDate.setDate(initialStartDate.getDate() + 1)
    ).toISOString();

    dateList.push({
      date: dayAfterToday,
      isChecked: false,
    });
  }

  return dateList;
};

module.exports = makeDateListData;
