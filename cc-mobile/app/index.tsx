import { Redirect } from "expo-router";
import { useSession } from "./ctx";

export default function Home() {
  const { session } = useSession();

  return (
    <Redirect href={session ? "/home" : "/sign-in"} />
  )
}