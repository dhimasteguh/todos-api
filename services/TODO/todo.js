// const { adminAuth } = framework;
const status = require("http-status");
const controller = require("./controller");
const Redis = require("../../library/redis");
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.get("/todo-items", async (req, res) => {
    const reqData = {
      activityGroupId: req.query["activity_group_id"],
    };
    const result = await Redis.redisHandler(
      `todo-items?${reqData.activityGroupId}`,
      controller._GET_TODOS(reqData)
    );
    // const result = await controller._GET_TODOS(reqData);
    handleResult(res, result);
  });
  app.get("/todo-items/:id", async (req, res) => {
    const reqData = {
      id: req.params.id,
    };
    const result = await Redis.redisHandler(
      `todo-items${reqData.id}`,
      controller._GET_TODO(reqData)
    );
    // const result = await controller._GET_TODO(reqData);
    handleResult(res, result);
  });
  app.post("/todo-items", async (req, res) => {
    const reqData = req.body;
    const result = await controller._CREATE_TODO(reqData);
    Redis.del("todo-items");
    handleResult(res, result);
  });
  app.patch("/todo-items/:id", async (req, res) => {
    const reqData = {
      ...req.body,
      id: req.params.id,
    };
    const result = await controller._UPDATE_TODO(reqData);
    Redis.del(`todo-items?${reqData["activity_group_id"]}`);
    Redis.del(`todo-items${reqData.id}`);
    handleResult(res, result);
  });
  app.delete("/todo-items/:id", async (req, res) => {
    const reqData = {
      id: req.params.id,
    };
    const result = await controller._DELETE_TODO(reqData);
    Redis.del(`todo-items${reqData.id}`);
    handleResult(res, result);
  });
};

const handleResult = (res, [st, data, message]) => {
  if (st >= 200 && st <= 300) {
    res.status(st).send({ status: "Success", data, message });
  } else res.status(st).send({ status: status[st], data, message });
};
