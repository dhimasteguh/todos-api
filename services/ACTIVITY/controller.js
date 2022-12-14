const { Activity } = require("./model");
const status = require("http-status");

exports._GET_ACTIVITIES = async (data) => {
  try {
    const activities = await Activity.findAll({});
    return [status.OK, activities, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._GET_ACTIVITY = async (data) => {
  try {
    const activity = await Activity.findAll({
      where: {
        id: data.id,
      },
    });
    if (!activity[0])
      return [status.NOT_FOUND, null, `Activity with ID ${data.id} Not Found`];
    return [status.OK, activity[0], "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._CREATE_ACTIVITY = async (data) => {
  try {
    if (!data.title) throw "title cannot be null";
    const activity = await Activity.create(data);
    return [status.CREATED, activity, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._UPDATE_ACTIVITY = async (data) => {
  try {
    // var res = await this._GET_ACTIVITY(data);
    // if (res[0] !== status.OK) return res;
    await Activity.update(data, {
      where: {
        id: data.id,
      },
    });
    return this._GET_ACTIVITY(data);
  } catch (error) {
    return handleError(`Activity with ID ${data.id} Not Found`);
  }
};
exports._DELETE_ACTIVITY = async (data) => {
  try {
    // var res = await this._GET_ACTIVITY(data);
    // if (res[0] !== status.OK) return res;
    await Activity.destroy({
      where: {
        id: data.id,
      },
    });
    return [status.OK, {}, "Success"];
  } catch (error) {
    return handleError(`Activity with ID ${data.id} Not Found`);
  }
};
const handleError = (error) => {
  console.error(error);
  const message = typeof error == "string" ? error : "Something wrong";
  return [status.NOT_FOUND, null, message];
};
