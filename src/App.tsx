import { Routes, Route, Link } from "react-router-dom";
import TextBox from "./TextBox";
import WeatherBox from "./components/WeatherBox";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [pages, setPages] = useState<{ name: string; path: string }[]>([]);
  const [newPage, setNewPage] = useState("");
  
  // ★統計データ用のState
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });

  // ページ一覧を取得
  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase.from("pages").select("*");
      if (!error && data) {
        setPages(
          data
            .filter((page) => page.path !== "/" && page.path !== "/weather")
            .map((page) => ({
              path: page.path,
              name: page.name,
            }))
        );
      }
    };
    fetchPages();
  }, []);

  // ユーザー情報を取得 & ログイン監視
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

  // ★統計を取得する関数
  const fetchTaskStats = async (userEmail: string) => {
    try {
      // バックエンドのAPIを叩く
      const res = await fetch(`http://localhost:5000/api/task-stats?email=${userEmail}`);
      const data = await res.json();
      
      if (res.ok) {
        setTaskStats({ completed: data.completed, pending: data.pending });
      }
    } catch (err) {
      console.error("統計取得失敗:", err);
    }
  };

  // ユーザーが変わったら統計を取得
  useEffect(() => {
    if (user?.email) {
      fetchTaskStats(user.email);
    }
  }, [user]);

  // ページ追加処理
  const addPage = async () => {
    if (!newPage) return;
    const path = "/" + newPage;
    if (pages.some((p) => p.path === path)) {
      alert("同じページ名が存在します");
      return;
    }
    const { error } = await supabase
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

  // ページ削除処理
  const deletePage = async (path: string) => {
    const confirmDelete = window.confirm("このページを削除しますか？");
    if (!confirmDelete) return;
    const deletePage = async (path: string) => {
  const confirmDelete = window.confirm("このページと、含まれるタスクを全て削除しますか？");
  if (!confirmDelete) return;

  // 1. 先にそのページのタスクを全削除
  await supabase
    .from("todos")
    .delete()
    .eq("page_path", path);

  // 2. その後でページ自体を削除
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
    
  };

  return (
    <div className="container">
      <h1>ポートフォリオ</h1>
      
      {/* ログイン・ログアウトボタン */}
      {!user ? (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={async () => {
            const email = prompt("メールアドレス");
            const password = prompt("パスワード");
            if (!email || !password) return;

            // 1. Supabaseログイン
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
               // ログイン失敗ならサインアップを試す（元のコードの挙動を維持）
               await supabase.auth.signUp({ email, password });
            } else {
               // 2. ログイン成功時のみバックエンドへ履歴送信
               try {
                 await fetch('http://localhost:5000/api/log-login', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ email: email }),
                 });
               } catch(e) {
                 console.error(e);
               }
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

      {/* ★ログイン時のみ表示するタスク統計エリア */}
      {user && (
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          margin: '15px 0', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h5 className="mb-2">現在のタスク集計</h5>
          <div className="d-flex align-items-center gap-3">
            <span className="text-success fw-bold">
              完了: {taskStats.completed}
            </span>
            <span className="text-danger fw-bold">
              未完了: {taskStats.pending}
            </span>
            <button 
              className="btn btn-sm btn-outline-dark ms-auto"
              onClick={() => user.email && fetchTaskStats(user.email)}
            >
              更新
            </button>
          </div>
        </div>
      )}

      <nav className="mb-3 mt-3">
        <Link to="/" className="me-2">Home</Link>
        <Link to="/weather" className="me-2">Weather</Link>
        {pages.map((page) => (
          <span key={page.path} className="me-3">
            <Link to={page.path} className="me-1">{page.name}</Link>
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
        <div className="mb-3">
          <input
            type="text"
            value={newPage}
            onChange={(e) => setNewPage(e.target.value)}
            placeholder="新しいページ名"
            className="border border-dark me-2"
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