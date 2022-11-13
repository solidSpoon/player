import '../styles/globals.css'
import Head from "next/head";
import {Archivo} from '@next/font/google'

const archivo = Archivo();

function MyApp({Component, pageProps}) {
    return <>
        <Head>
            <title>HidePlayer</title>
        </Head>
        <main className={archivo.className}>
            <Component {...pageProps} />
        </main>

    </>
}

export default MyApp
