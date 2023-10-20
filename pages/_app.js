import Layout from '@/components/Layout';
import '@/styles/globals.css'
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider className='bg-black min-h-screen'>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextUIProvider>
  )
}
