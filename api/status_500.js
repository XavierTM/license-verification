

function status_500(err, res) {
   res.sendStatus(500);
   console.error(err);
}

module.exports = status_500;