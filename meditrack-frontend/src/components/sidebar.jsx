import React from "react";

export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Dashboard</h2>
      <ul className="space-y-3">
        {links.map((link, idx) => (
          <li key={idx}>
            <a href={link.href} className="text-blue-600 hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
