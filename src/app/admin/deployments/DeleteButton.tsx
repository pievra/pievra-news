"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this deployment?")) return;
    await fetch(`/news/api/admin/deployments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
    >
      Delete
    </button>
  );
}
