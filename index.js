const express = require("express")
const fileUpload = require("express-fileupload")
const app = express()
const tesseract = require("node-tesseract-ocr")

app.use(fileUpload())
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}
app.get("/", (_, res) => {
    res.send(`
    <form action='/upload' method='post' encType="multipart/form-data">
      <input type="file" name="sampleFile" />
      <input type='submit' value='Upload!' />
    </form>`)
})

app.post("/upload", async (req, res) => {
    const { sampleFile } = req.files
    if (!sampleFile) return res.status(400).send("No files were uploaded.")
    tesseract
        .recognize(sampleFile.data, config)
        .then((text) => {
            res.send(`${text}`)
            console.log("Result:", text)
        })
        .catch((error) => {
            res.send(`Error in server`)
            console.log(error.message)
        })

})

app.listen(process.env.PORT || 8000)
