import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";

export default async function TopPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="display-4 mb-4">社内限定TOPページ</h1>
        <p>ようこそ、{session.user?.email} さん！</p>
        <p>このページはログインした社員のみが閲覧できます。</p>
      </div>
    </>
  );
}
