const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));

const hasHref = (req, res, next) => {
	const { data: { href } = {} } = req.body;
	if (href) {
		return next();
	} 
	next({ status: 400, message: "A 'href' property is required."});
};

const create = (req, res) => {
	const { data: { href } = {} } = req.body;

	const newUrl = {
			id: urls.length + 1,
			href,
	};
	urls.push(newUrl);
	res.status(201).json({ data: newUrl});
};

const urlExists = (req, res, next) => {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);
  if (foundUrl) {
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`,
  });
}

const list = (req, res) => {
	res.json({data: urls});
}

const read = (req, res) => {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);
  res.json({ data: foundUrl });
}

const update = (req, res) => {
	const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);

  const { data: { href } = {} } = req.body;

  foundUrl.href = href;

  res.json({ data: foundUrl });
}

const destroy = (req, res, next) => {
	next({status: 405, message: `DELETE method not allowed on ${req.originalUrl}`})
};

const createUse = (req, res, next) => {
	const urlId = Number(req.params.urlId);
	const newUse = {
		id: uses.length + 1,
		urlId: urlId,
		time: Date.now(),
	}
	uses.push(newUse);
	return next();
};


module.exports = {
	create: [hasHref, create],
	list,
	read: [urlExists, createUse, read],
	update: [urlExists, hasHref, update],
	delete: [urlExists, destroy],
	urlExists,
};
