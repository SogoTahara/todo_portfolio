import { Routes, Route, Link } from "react-router-dom";
import TextBox from "./TextBox";
import WeatherBox from "./components/WeatherBox";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";


export default function App() {
  
  const [user, setUser] = useState<any>(null);

const [pages, setPages] = useState<
  { name: string; path: string }[]
>([]);


  const [newPage, setNewPage] = useState("");

  useEffect(() => {
  const fetchPages = async () => {
    const { data, error } = await supabase
      .from("pages")
      .select("*");

    if (!error && data) {
  setPages(
    data
      .filter(
        (page) => page.path !== "/" && page.path !== "/weather"
      )
      .map((page) => ({
        path: page.path,
        name: page.name,
      }))
  );
}

  };

  fetchPages();
}, []);

useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();

  supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
}, []);


const addPage = async () => {
  if (!newPage) return;

  const path = "/" + newPage;

 
  if (pages.some((p) => p.path === path)) {
    alert("同じページ名が存在します");
    return;
  }

  const { data, error } = await supabase
    .from("pages")
    .insert([{ path, name: newPage }])
    .select();

  if (error) {
    alert("ページ追加に失敗しました");
    return;
  }

  setPages([...pages, { path, name: newPage }]);
  setNewPage("");
};

const deletePage = async (path: string) => {
  const confirmDelete = window.confirm("このページを削除しますか？");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("path", path);

  if (error) {
    alert("削除に失敗しました");
    return;
  }

  setPages(pages.filter((page) => page.path !== path));
};

  return (
    <div className="container">
      <h1>ポートフォリオ</h1>
{!user ? (

<button
  className="btn btn-sm btn-outline-primary"
  onClick={async () => {
    const email = prompt("メールアドレス");
    const password = prompt("パスワード");

    if (!email || !password) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログイン失敗: " + error.message);
      return;
    }

    try {
      await fetch('http://localhost:5000/api/log-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      console.log("バックエンドへのログ送信完了");
    } catch (err) {
      console.error("ログ送信失敗（サーバー動いてる？）:", err);
    }
    
   
  }}
>
  ログイン
</button>


) : (
  <button
    className="btn btn-sm btn-outline-secondary"
    onClick={() => supabase.auth.signOut()}
  >
    ログアウト
  </button>
)}

      <nav className="mb-3">
  <Link to="/" className="me-2">Home</Link>
  <Link to="/weather" className="me-2">Weather</Link>

 {pages.map((page) => (
  <span key={page.path} className="me-3">
    <Link to={page.path} className="me-1">
      {page.name}
    </Link>
    {user && (
      <button
      className="btn btn-sm btn-outline-danger px-1 py-0"
      onClick={() => deletePage(page.path)}
    >
      ×
    </button>
    )}
  </span>
))}


</nav>

{user && (
     <div>
        <input
          type="text"
          value={newPage}
          onChange={(e) => setNewPage(e.target.value)}
          placeholder="新しいページ名"
          className="border border-dark me-2 "
        />
        <button className="btn btn-sm btn-primary" onClick={addPage}>
          ページ追加
        </button>
      </div>
)}

 <Routes>
  <Route path="/" element={<TextBox pagePath="/" />} />

  <Route path="/weather" element={<WeatherBox />} />

  {pages.map((page) => (
   <Route
  key={page.path}
  path={page.path}
  element={<TextBox pagePath={page.path} />}
/>

  ))}
</Routes>


    </div>
  );
}
