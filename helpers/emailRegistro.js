import nodemailer from 'nodemailer'

const emailRegistro = async datos => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Enviar el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `
            <p> Hola: ${nombre}, haz creado una cuenta en nuestro sitio, por favor comprueba tu cuenta en APV. </p>

            <p> Tu cuenta está lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar cuenta </a> </p>
        

            <p> Sí tu no creaste está cuenta, puedes ignorar este mensaje </p>
        `
    })

    console.log('Mensaje enviado: %s', info.messageId)
}

export default emailRegistro