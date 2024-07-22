
import FormComponent from "@/components/Form/FormComponent"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"
import { signIn } from "next-auth/react"
import Nav from "@/components/Nav/Nav";
import FormContextProvider from "@/components/Providers/FormContextProvider"
import SignInPrompt from "@/components/SignIn/PleaseSignIN"


const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-screen">
      <Nav />
    {session ?  <FormContextProvider>
        <FormComponent />
      </FormContextProvider>
      :<SignInPrompt/>
      
    }
    </div>
  )
}

export default page
