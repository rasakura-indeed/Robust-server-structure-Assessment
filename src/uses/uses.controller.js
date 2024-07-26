const uses = require("../data/uses-data");

const list = (req, res) => {
  const urlId = Number(req.params.urlId);
  res.json({data: uses.filter(urlId ? use => use.urlId === urlId : () => true)});
};

const create = (req, res, next) => {
  next({status: 405, message: `POST method not allowed on ${req.originalUrl}`});
};

const useExists = (req, res, next) => {
  const useId = Number(req.params.useId);
  const foundUse = uses.find((use) => use.id === useId);
  if (foundUse) {
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}.`
  })
};

const read = (req, res) => {
  const useId = Number(req.params.useId);
  const foundUse = uses.find((use) => use.id === useId);
  res.json({data: foundUse}); 
};

const destroy = (req, res) => {
  const useId = Number(req.params.useId);
  const index = uses.findIndex((use) => use.id === useId);
  if (index > -1) {
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  create: [create],
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
}