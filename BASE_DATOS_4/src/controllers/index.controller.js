const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    res.render('index', { layout: false });
};

module.exports = indexCtrl;