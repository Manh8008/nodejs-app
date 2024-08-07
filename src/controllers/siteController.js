
class Sitecontroller {
    //[GET] /
    index(req, res, next) {
        res.json("Đây là trang home ạ")
    }
}

module.exports = new Sitecontroller();
