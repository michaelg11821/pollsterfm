import { auth } from "@/auth";

async function Profile() {
  const session = await auth();
  const user = session?.user;

  return <p>{user?.name}</p>;
}

export default Profile;
