import nodemailer from 'nodemailer'
import util from 'util'

const sendRejectemail = async (sendtoemail) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for port 465
        auth: {
            user: process.env.EMAIL,      
            pass: process.env.PASSWORD,  
        },
    });

    const rejectionEmailTemplateHTML = () => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AddaLove Profile Update</title>

<style>
body{
    margin:0;
    padding:0;
    background:#0F172A;
    font-family:'Poppins', Arial, Helvetica, sans-serif;
}

.container{
    max-width:600px;
    margin:40px auto;
    background:#1E293B;
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 10px 40px rgba(0,0,0,0.35);
}

.header{
    background:linear-gradient(
        90deg,
        #6C3BFF,
        #FF4D8D
    );
    
    padding:30px;
    
    text-align:center;
    
    color:white;
    
    font-size:30px;
    
    font-weight:700;
    
    letter-spacing:1px;
}

.content{
    padding:40px 30px;
    color:#E2E8F0;
    text-align:center;
}

.content h2{
    margin-top:0;
    margin-bottom:15px;
    color:#FFFFFF;
    font-size:28px;
}

.content p{
    line-height:1.7;
    font-size:15px;
}

.status-box{
    display:inline-block;

    margin:30px 0;

    padding:20px 35px;

    font-size:24px;

    font-weight:700;

    letter-spacing:2px;

    background:linear-gradient(
        135deg,
        rgba(108,59,255,0.18),
        rgba(255,77,141,0.18)
    );

    border:1px solid rgba(255,77,141,0.35);

    border-radius:16px;

    color:#FFFFFF;

    box-shadow:
        0 10px 30px rgba(108,59,255,0.25);
}

.info{
    font-size:14px;
    color:#94A3B8;
    margin-top: 20px;
}

.highlight{
    color:#FF4D8D;
    font-weight:600;
}

.footer{
    padding:20px;

    text-align:center;

    font-size:13px;

    color:#94A3B8;

    border-top:1px solid rgba(255,255,255,0.08);
}

.footer a{
    color:#4DA6FF;
    text-decoration:none;
}
</style>

</head>

<body>

<div class="container">

    <div class="header">
        📢 AddaLove
    </div>

    <div class="content">

        <h2>Profile Update</h2>

        <p>
            Hello from <span class="highlight">AddaLove</span>.
        </p>

        <p>
            Thank you for your interest in joining our community. After a careful review by our admin team, we regret to inform you that your profile application has been <b>rejected</b> at this time.
        </p>

        <div class="status-box">
            Status: Not Approved ❌
        </div>

        <p class="info">
            This usually happens if the provided details are incomplete, unverifiable, or do not meet our community guidelines.<br><br>
            <i>If you believe this was a mistake or would like to appeal this decision, please reach out to our support team for further clarification.</i>
        </p>

    </div>

    <div class="footer">
        © 2026 AddaLove • Connect • Chat • Discover ❤️
    </div>

</div>

</body>
</html>
`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: sendtoemail,
        subject: "📢 AddaLove Profile Application Update",
        html: rejectionEmailTemplateHTML(),
    };

    // Convert sendMail to return a promise
    const sendMailAsync = util.promisify(transporter.sendMail.bind(transporter));

    try {
        const info = await sendMailAsync(mailOptions);
        console.log("✅ Email sent:", info.response);
        return info.response;  // Return the response
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;   // Throw error for proper handling
    }
}

export default sendRejectemail;