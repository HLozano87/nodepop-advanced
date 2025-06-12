function changeLang(req, res, next) {
  const lang = req.params.locale;
  res.cookie("nodepop-lang", lang, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.redirect("back");
}

export default changeLang;
