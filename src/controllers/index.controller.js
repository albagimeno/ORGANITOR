const indexCtrl = {};

indexCtrl.mostrarIndex = (req, res) => {
    res.render('index', { layout: false });
};

module.exports = indexCtrl;