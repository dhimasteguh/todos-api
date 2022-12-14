const { Todo } = require("./model");
const { Activity } = require("../ACTIVITY/model");
const { _GET_ACTIVITY } = require("../ACTIVITY/controller");
const status = require("http-status");
const Redis = require("../../library/redis");
exports._GET_TODOS = async (data) => {
  try {
    const todos = await Todo.findAll({
      where: {
        activity_group_id: data.activityGroupId,
      },
    });
    return [status.OK, todos, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._GET_TODO = async (data) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: data.id,
      },
    });
    if (!todo)
      return [status.NOT_FOUND, null, `Todo with ID ${data.id} Not Found`];
    return [status.OK, todo, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._CREATE_TODO = async (data) => {
  try {
    if (!data.title) throw "title cannot be null";
    if (!data.activity_group_id) throw "activity_group_id cannot be null";
    // var res = await _GET_ACTIVITY({ id: data.activity_group_id });
    // if (res[0] !== status.OK) return res;
    const todo = await Todo.create(data);
    return [status.CREATED, todo, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
exports._UPDATE_TODO = async (data) => {
  try {
    var count = await Todo.update(data, {
      where: {
        id: data.id,
      },
    });
    if (count === 0)
      return [status.NOT_FOUND, null, `Todo with ID ${data.id} Not Found`];
    return await this._GET_TODO(data);
  } catch (error) {
    return handleError(error);
  }
};
exports._DELETE_TODO = async (data) => {
  try {
    var res = await this._GET_TODO(data);
    if (res[0] !== status.OK) return res;
    var count = await Todo.destroy({
      where: {
        id: data.id,
      },
    });
    if (count === 0)
      return [status.NOT_FOUND, null, `Todo with ID ${data.id} Not Found`];
    Redis.del(`todo-items?${res[1].activityGroupId}`);
    return [status.OK, {}, "Success"];
  } catch (error) {
    return handleError(error);
  }
};
const handleError = (error) => {
  console.error(error);
  const message = typeof error == "string" ? error : "Something wrong";
  return [status.BAD_REQUEST, null, message];
};
