import { Routes, Route, Link } from "react-router-dom";
import TextBox from "./TextBox";
import WeatherBox from "./components/WeatherBox";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


export default function App() {
  
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


  return (
    <div className="container">
      <h1>ポートフォリオ</h1>

      {/* <nav className="mb-3">
        {pages.map((page) => (
          <Link key={page.path} to={page.path} className="me-2">
            {page.name}
          </Link>
        ))}
      </nav> */}
      <nav className="mb-3">
  <Link to="/" className="me-2">Home</Link>
  <Link to="/weather" className="me-2">Weather</Link>

  {pages.map((page) => (
    <Link key={page.path} to={page.path} className="me-2">
      {page.name}
    </Link>
  ))}
</nav>


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
