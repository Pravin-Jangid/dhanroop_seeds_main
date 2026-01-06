import Link from "next/link";

export default function AgriTipsPage() {
  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">AgriTips</h1>
        <Link
          href="/admin/agritips/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Tip
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">How to Improve Soil</td>
            <td>Published</td>
            <td className="flex gap-2 p-3">
              <Link href="/admin/agritips/edit/1" className="text-blue-600">
                Edit
              </Link>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
