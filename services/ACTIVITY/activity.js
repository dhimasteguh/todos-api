// const { adminAuth } = framework;
const status = require("http-status");
const controller = require("./controller");
const Redis = require("../../library/redis");
module.exports = (app) => {
  app.get("/activity-groups", async (req, res) => {
    const reqData = {};
    const result = await Redis.redisHandler(
      "activity-groups",
      controller._GET_ACTIVITIES(reqData)
    );
    handleResult(res, result);
  });
  app.get("/activity-groups/:id", async (req, res) => {
    const reqData = {
      id: req.params.id,
    };
    const result = await Redis.redisHandler(
      `activity-groups${reqData.id}`,
      controller._GET_ACTIVITY(reqData)
    );
    // const result = await controller._GET_ACTIVITY(reqData);
    handleResult(res, result);
  });
  app.post("/activity-groups", async (req, res) => {
    const reqData = req.body;
    const result = await controller._CREATE_ACTIVITY(reqData);
    Redis.del("activity-groups");
    handleResult(res, result);
  });
  app.patch("/activity-groups/:id", async (req, res) => {
    const reqData = {
      ...req.body,
      id: req.params.id,
    };
    const result = await controller._UPDATE_ACTIVITY(reqData);
    Redis.del("activity-groups");
    Redis.del(`activity-groups${reqData.id}`);
    handleResult(res, result);
  });
  app.delete("/activity-groups/:id", async (req, res) => {
    const reqData = {
      id: req.params.id,
    };
    const result = await controller._DELETE_ACTIVITY(reqData);
    Redis.del("activity-groups");
    Redis.del(`activity-groups${reqData.id}`);
    handleResult(res, result);
  });
};

const handleResult = (res, [st, data, message]) => {
  if (st >= 200 && st <= 300) {
    res.status(st).send({ status: "Success", data, message });
  } else res.status(st).send({ status: status[st], data, message });
};
