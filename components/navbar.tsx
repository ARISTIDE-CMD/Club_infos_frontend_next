"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/api";

const menuItem = [
  { key: "dashboard", label: "Dashboard", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-2v2m-4-2v2m-2-6h10a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg> },
  { key: "dashboard/projets", label: "Projets", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
  { key: "dashboard/depots", label: "Dépôts", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6h6m-6 0h-2M18 18a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6h-2m-2 0h-6m6 0h2" /></svg> },
  { key: "dashboard/performance", label: "Performances", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { key: "dashboard/forum", label: "Forum", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg> },
  { key: "dashboard/archives", label: "Archives", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [commentaire, setCommentaire] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    setCommentaire(user);
  }, []);

  const handleLogout = async () => {
    setIsLoadingLogout(true);
    try {
      await api.post("/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      localStorage.removeItem("authToken");
      router.replace("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsLoadingLogout(false);
    }
  };

  return (
 <aside
  className={`bg-gray-800 text-white flex flex-col p-4 sticky top-0 h-screen overflow-y-hidden shadow-xl transition-all duration-300
    ${collapsed ? "w-20" : "w-64"}`}
>
  {/* Header */}
  <div className="flex items-center justify-between mb-4 border-b border-gray-700/50 pb-2">
    {!collapsed && <h1 className="text-lg font-bold">Club <span className="text-indigo-400">Info</span></h1>}
    <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>

  {/* Menu */}
  <nav className="flex-1 flex flex-col gap-2 overflow-hidden">
    {menuItem.map(({ key, label, icon }) => {
      const isActive = pathname === `/${key}`;
      return (
        <Link
          key={key}
          href={`/${key}`}
          className={`relative group flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive ? "bg-indigo-900 text-white border-l-4 border-indigo-400" : "text-gray-300 hover:bg-gray-700/60"}`}
        >
          {icon}
          {!collapsed && <span className="font-semibold">{label}</span>}

          {collapsed && (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white
              text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {label}
            </span>
          )}
        </Link>
      );
    })}
  </nav>

  {/* Footer */}
  <div className="mt-4 border-t border-gray-700/50 pt-3 flex flex-col gap-3">
    {/* User */}
    <div className={`flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/50
      ${collapsed ? "justify-center" : ""}`}>
      <span className="h-3 w-3 bg-green-400 rounded-full flex-shrink-0" />
      {!collapsed && commentaire?.name && (
        <div className="leading-tight">
          <p className="font-semibold text-indigo-400">{commentaire.name}</p>
          <p className="text-gray-400 text-xs">{commentaire.email}</p>
        </div>
      )}
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      disabled={isLoadingLogout}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600/10 text-red-300 hover:bg-red-600/30
        transition-all ${collapsed && "justify-center"}`}
    >
      <svg className={`w-5 h-5 ${isLoadingLogout ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {!collapsed && <span className="font-semibold">{isLoadingLogout ? "Déconnexion..." : "Déconnexion"}</span>}
    </button>
  </div>
</aside>

  );
}
