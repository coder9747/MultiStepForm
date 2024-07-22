import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

let baseUrl = "http://localhost:10000";


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "Enter Email"
                },
                password: {
                    type: "password",
                    label: "Password",
                }
            }
            ,
            async authorize(userData) {
                //@ts-ignore
                const { email, password } = userData;
                try {
                    const response = await fetch('http://localhost:10000/api/v1/auth/login', {
                        method: "POST", headers: {
                            "Content-Type": "application/json",
                        }, body: JSON.stringify({ email, password })
                    });
                    const data = await response.json();
                    console.log(data);
                    if (!data.succes) {
                        return null;
                    }
                    const user = { id: data.payload.id, email: data.payload.email, type: "credentials" };
                    return user;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        }
        ),
        Google({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && user?.type == "credentials") {
                token.id = user.id;
                token.email = user.email;
                return token;
            }
            else {
                const email = user?.email;
                try {
                    const response = await fetch("http://localhost:10000/api/v1/auth/loginWithProvider", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, type: "GOOGLE" })
                    });
                    if (!response.ok) return token;
                    const data = await response.json();
                    if (!data.succes) return token;
                    token.id = data.payload.id;
                    token.email = data.payload.email;
                    return token;
                } catch (error) {
                    return token;
                }
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        },
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

