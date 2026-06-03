"use client";

import { useState } from "react";
import { useDesign } from "@/context/DesignContext";
import { roomSelectionData } from "@/lib/data";
import Image from "next/image";

export default function HouseBuilderPanel() {
  const {
    roomsList,
    activeRoomId,
    setActiveRoomId,
    addRoom,
    removeRoom,
    renameRoom,
  } = useDesign();

  const [newRoomType, setNewRoomType] = useState("bedroom");
  const [newRoomName, setNewRoomName] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleStartRename = (e, room) => {
    e.stopPropagation(); // Avoid triggering room switch
    setEditingRoomId(room.id);
    setEditingName(room.name);
  };

  const handleSaveRename = (e, roomId) => {
    e.stopPropagation();
    if (editingName.trim()) {
      renameRoom(roomId, editingName);
    }
    setEditingRoomId(null);
  };

  const handleKeyDown = (e, roomId) => {
    if (e.key === "Enter") {
      handleSaveRename(e, roomId);
    } else if (e.key === "Escape") {
      setEditingRoomId(null);
    }
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    addRoom(newRoomType, newRoomName);
    setNewRoomName("");
    setIsAdding(false);
  };

  const getRoomImage = (type) => {
    const matched = roomSelectionData.find((r) => r.slug === type);
    return matched?.image || "/images/living-room.jpg";
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-4 border-b border-stone-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
          House Layout
        </h3>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
        >
          {isAdding ? "Cancel" : "+ Add Room"}
        </button>
      </div>

      {/* ── Add Room Form ── */}
      {isAdding && (
        <form
          onSubmit={handleAddRoomSubmit}
          className="flex flex-col gap-3 rounded-xl border border-brand-100 bg-brand-50/20 p-3.5 transition-all duration-300"
        >
          <div>
            <label htmlFor="room-type-select" className="block text-xs font-medium text-stone-600 mb-1">
              Room Type
            </label>
            <select
              id="room-type-select"
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-brand-500 focus:outline-none"
            >
              {roomSelectionData.map((room) => (
                <option key={room.slug} value={room.slug}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="room-name-input" className="block text-xs font-medium text-stone-600 mb-1">
              Custom Name <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              id="room-name-input"
              type="text"
              placeholder="e.g. Master Bedroom, Guest Bath"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              maxLength={25}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all active:scale-[0.98]"
          >
            Create Room
          </button>
        </form>
      )}

      {/* ── Rooms List ── */}
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {roomsList.map((room) => {
          const isActive = room.id === activeRoomId;
          const isEditing = room.id === editingRoomId;

          return (
            <div
              key={room.id}
              onClick={() => !isEditing && setActiveRoomId(room.id)}
              className={`group relative flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-brand-500 bg-brand-50/20 ring-1 ring-brand-500 shadow-sm"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {/* Room Image Thumbnail */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={getRoomImage(room.type)}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>

              {/* Room Text / Rename Field */}
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      aria-label="Rename room"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, room.id)}
                      autoFocus
                      maxLength={20}
                      className="w-full rounded border border-brand-400 px-1.5 py-0.5 text-xs text-stone-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Save name"
                      onClick={(e) => handleSaveRename(e, room.id)}
                      className="rounded p-0.5 text-brand-600 hover:bg-brand-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="truncate font-semibold text-xs text-stone-900">
                        {room.name}
                      </p>
                      <button
                        type="button"
                        aria-label={`Rename ${room.name}`}
                        onClick={(e) => handleStartRename(e, room)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 rounded p-0.5 text-stone-400 hover:text-stone-600 transition-opacity"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-400 capitalize">
                      {room.type.replace("-", " ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons (Delete) */}
              {!isEditing && roomsList.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove ${room.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRoom(room.id);
                  }}
                  className="rounded-lg p-1 text-stone-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
