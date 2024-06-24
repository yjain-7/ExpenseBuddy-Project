import Header from "./Header"
import Footer from "./Footer"
import logo from './EB.png'
export default function LoginPage(){
    return(
        <>
        <Header></Header>
        <div>
        <div><img src={logo} alt="ExpenseBuddy" width="200" height="200" className="pt-3"/></div>
        </div>
        <Footer></Footer>
        </>
    )
}