module.exports = application => {
  application.get("/", (req, res) => {
    return res.json({
      message: "welcome to covid-19 api",
    });
  });
};
