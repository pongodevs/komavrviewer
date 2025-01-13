import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/root.css';

function MyApp({ Component, pageProps }:any) {
  return (
    <div
      onContextMenu={(e)=>{
        e.preventDefault()
      }}
    >
        <Component {...pageProps} />
        <ToastContainer
          theme='dark'
        />
    </div>
  )
}

export default MyApp