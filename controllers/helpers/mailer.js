const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

const confirmationMailer = (email, name, pin) =>{
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[{
                "From": {
                    "Email": "raj.academic8@gmail.com",
                    "Name": "Research Paper Recommedation"
                },
                "To": [{
                    "Email": email,
                    "Name": name
                }],
                "Subject": "Confirmation",
                "TextPart": `Dear ${name}, Your have registered for daily mail recommendation & your confimation pin is ${pin}`,
                "HTMLPart": `
                    <html>
                        <body>
                            <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td width="560" class="esd-container-frame" align="center" valign="top">
                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td align="center" class="esd-block-text es-p20t es-p20b" bgcolor="#071f4f">
                                                                <h1 style="color: #ffffff;">Today's Movie</h1>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" class="esd-block-text es-p20" bgcolor="#071f4f">
                                                                <p style="color: #ffffff;">Hi ${name},<br>&nbsp; &nbsp; &nbsp; &nbsp;Kindly verify you account with thi code - ${pin}<br></p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </body>
                    </html>
                `
            }]
        })

    request
        .then((result) => {
            console.log("mail sent")
        })
        .catch((err) => {
            console.log(err.statusCode)
        })

}
const DailyMovieMailer = (email, title, overview, img, score) =>{
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[{
                "From": {
                    "Email": "amanraj95vs@gmail.com",
                    "Name": "Research Paper Recommedation"
                },
                "To": [{
                    "Email": email,
                }],
                "Subject": `Research Paper of the Day: ${title}`,
                "TextPart": `Research Paper title:${title}, Description:${overview}, image:${img} & rating:${score} CITESCORE`,
                "HTMLPart": `<html>
                    <body>
                        <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                    <tr>
                                        <td width="560" class="esd-container-frame" align="center" valign="top">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td align="center" class="esd-block-text es-p40t es-p40b" bgcolor="#071f4f">
                                                            <h1 style="color: #ffffff;">Title - ${title}</h1>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" class="esd-block-image" style="font-size:0">
                                                            <a target="_blank">
                                                                <img class="adapt-img esdev-empty-img" src=${img} alt width="100%" height="100%" >
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" class="esd-block-text es-p10" bgcolor="#DC143C">
                                                            <h2 style="color: #ffffff;">${score} CITESCORE</h2>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left" class="esd-block-text es-p40" bgcolor="#071f4f">
                                                            <h3 style="color: #ffffff;">${overview}</h3>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </body>
                </html>`
            }]
        })

    request
        .then((result) => {
            console.log(" movie mail sent")
        })
        .catch((err) => {
            console.log(err.statusCode)
            console.log(err)
        })

}

module.exports = {
    confirmationMailer,
    DailyMovieMailer
}