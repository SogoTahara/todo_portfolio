import { Routes, Route, Link, useLocation } from "react-router-dom"; 
import TextBox from "./TextBox";
import WeatherBox from "./components/WeatherBox";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [pages, setPages] = useState<{ name: string; path: string }[]>([]);
  const [newPage, setNewPage] = useState("");
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  
  const location = useLocation();

  const getHeaderTitle = () => {
    const currentPath = decodeURIComponent(location.pathname);

    if (currentPath === "/") return "Home";
    if (currentPath === "/weather") return "Weather";
    
    const currentPage = pages.find((p) => p.path === currentPath);
    return currentPage ? currentPage.name : "My ToDo App";
  };

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase.from("pages").select("*");
      if (!error && data) {
        setPages(
          data
            .filter((page) => page.path !== "/" && page.path !== "/weather")
            .map((page) => ({ path: page.path, name: page.name }))
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

  const fetchTaskStats = async (userEmail: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/task-stats?email=${userEmail}`);
      const data = await res.json();
      if (res.ok) setTaskStats({ completed: data.completed, pending: data.pending });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.email) fetchTaskStats(user.email);
  }, [user]);

  const handleLogin = async () => {
    const email = prompt('メールアドレス   "login@login" をコピペしてください！');
    const password = prompt('パスワード    "login123" をコピペしてください');
    if (!email || !password) return;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      await supabase.auth.signUp({ email, password });
    } else {
      try {
        await fetch('http://localhost:5000/api/log-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const addPage = async () => {
    if (!newPage) return;
    const path = "/" + newPage;
    if (pages.some((p) => p.path === path)) return alert("重複しています");
    const { error } = await supabase.from("pages").insert([{ path, name: newPage }]);
    if (!error) {
      setPages([...pages, { path, name: newPage }]);
      setNewPage("");
    }
  };

  const deletePage = async (path: string) => {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("todos").delete().eq("page_path", path);
    const { error } = await supabase.from("pages").delete().eq("path", path);
    if (!error) setPages(pages.filter((page) => page.path !== path));
  };

  return (
    <div className="container-fluid p-0">
      <header className="bg-dark text-white p-3 d-flex align-items-center justify-content-between sticky-top">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-light me-3"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
          >
            ☰
          </button>
          
          <h1 className="h4 mb-0">{getHeaderTitle()}</h1>
        </div>
      </header>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="sidebarMenu">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">メニュー</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <h6 className="text-muted small text-uppercase fw-bold mt-2">ページ一覧</h6>
          <nav className="nav flex-column mb-auto">
            <Link to="/" className="nav-link px-0 text-dark" data-bs-dismiss="offcanvas">
              🏠 Home
            </Link>
            {pages.map((page) => (
              <div
                key={page.path}
                className="d-flex align-items-center justify-content-between border-bottom py-1"
              >
                <Link
                  to={page.path}
                  className="nav-link px-0 text-dark flex-grow-1"
                  data-bs-dismiss="offcanvas"
                >
                  📄 {page.name}
                </Link>
                {user && (
                  <button className="btn btn-sm text-danger" onClick={() => deletePage(page.path)}>
                    ×
                  </button>
                )}
              </div>
            ))}

            {user && (
              <div className="mt-3">
                <input
                  type="text"
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  className="form-control form-control-sm mb-2"
                  placeholder="新しいページ名"
                />
                <button className="btn btn-sm btn-primary w-100" onClick={addPage}>
                  ページ追加
                </button>
              </div>
            )}
          </nav>

          <div className="mt-auto pt-3 border-top">
            <div className="mb-3">
              <WeatherBox />
            </div>
            {!user ? (
              <button className="btn btn-primary w-100" onClick={handleLogin}>
                ログイン
              </button>
            ) : (
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => supabase.auth.signOut()}
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </div>

     <main className="container py-4">
        
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          {user ? (
            <>
              <h5 className="mb-2">📊 現在のタスク集計</h5>
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
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center text-muted gap-2">
              <span> ログインするとタスク統計などの機能が使えます</span>
            </div>
          )}
        </div>
        

 <Routes>
  <Route path="/" element={<TextBox pagePath="/" user={user} />} />
  <Route path="/weather" element={<WeatherBox />} />
  
  {pages.map((page) => (
    <Route
      key={page.path}
      path={page.path}
      element={<TextBox pagePath={page.path} user={user} />}
    />
  ))}
</Routes>
      </main>
    </div>
  );
}