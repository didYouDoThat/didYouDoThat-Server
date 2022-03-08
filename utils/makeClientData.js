const makeClientData = (habitServerData) => {
  return {
    id: habitServerData._id,
    title: habitServerData.title,
    endDate: habitServerData.dateList[habitServerData.dateList.length - 1].date,
    dateList: habitServerData.dateList,
    catImage:
      habitServerData.catImage.catType.catStatusList[
        habitServerData.catImage.catStatus
      ],
    status: habitServerData.catImage.catStatus,
  };
};

module.exports = makeClientData;
