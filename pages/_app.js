import '../styles/globals.css'
import Link from 'next/link'
import { ToastProvider, useToasts } from 'react-toast-notifications';

function Marketplace({ Component, pageProps }) {
  return (
    <ToastProvider>
      <div>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Metaverse Marketplace</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-pink-500">
                Home
              </a>
            </Link>
            <Link href="/open-box">
              <a className="mr-6 text-pink-500">
                Open Box
              </a>
            </Link>
            <Link href="/create-item">
              <a className="mr-6 text-pink-500">
                Sell Asset
              </a>
            </Link>
            <Link href="/on-sale">
              <a className="mr-6 text-pink-500">
                On Sale
              </a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 text-pink-500">
                My Assets
              </a>
            </Link>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </ToastProvider>
  )
}

export default Marketplace