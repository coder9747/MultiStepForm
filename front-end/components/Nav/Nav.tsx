"use client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Nav = () => {
    const router = useRouter();
    const session = useSession();
    return (
        <nav className="flex px-10 h-12 justify-around  items-center border ">
            <p >Brand</p>
            {session.status != "unauthenticated" ?
                <button className="bg-black h-7  text-sm text-white px-5 rounded" onClick={() => signOut()}>Sign Out</button> :
                <div className="">
                    <button className="bg-black h-7 mx-2 text-sm text-white px-5 rounded" onClick={() => signIn()}>Sign In</button>
                    <button className="bg-black h-7 mx-2 text-sm text-white px-5 rounded" onClick={()=>router.push("/register")}>Register</button>
                </div>
                    }
        </nav>
    )
}

export default Nav
