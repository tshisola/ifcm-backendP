AJOUTE CE CODE (APRÈS app.use)
app.get("/", (req, res) => {
  res.send("🚀 API IFCM fonctionne sur Render !");
});
✔ Exemple complet rapide :
app.use("/api", require("./src/routes"));

app.get("/", (req, res) => {
  res.send("🚀 API IFCM fonctionne sur Render !");
});