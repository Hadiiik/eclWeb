"use client"
import Cookies from "js-cookie"
function Home() {
  return (
    <div>
      {Cookies.get("sToken")}
      <h1>hello world</h1>
    </div>
  )
}
export default Home
