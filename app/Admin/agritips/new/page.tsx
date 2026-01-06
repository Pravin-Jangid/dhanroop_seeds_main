"use client";

export default function NewAgriTip() {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">Add AgriTip</h1>

      <form className="bg-white p-6 rounded shadow space-y-4">
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded h-40"
        />

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Save
        </button>
      </form>
    </>
  );
}
