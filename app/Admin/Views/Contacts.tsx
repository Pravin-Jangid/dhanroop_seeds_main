"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  Trash2,
  Eye,
  X,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Crop
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  crop?: string;
  message: string;
  createdAt?: any;
  status?: "new" | "read" | "replied";
}

export default function Contacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "read" | "replied">("all");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Expanded view state
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      })) as ContactMessage[];

      setMessages(data);
      setFilteredMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* ================= FILTER & SEARCH ================= */
  useEffect(() => {
    let filtered = [...messages];
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(m => m.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.phone.toLowerCase().includes(query) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        (m.location && m.location.toLowerCase().includes(query)) ||
        (m.crop && m.crop.toLowerCase().includes(query)) ||
        m.message.toLowerCase().includes(query)
      );
    }
    
    setFilteredMessages(filtered);
  }, [messages, searchQuery, filterStatus]);

  /* ================= MODAL HANDLERS ================= */
  const openModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, "contactMessages", id));
      await fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE EXPAND ================= */
  const toggleExpand = (id: string) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  /* ================= FORMAT DATE ================= */
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    
    // If today, show time only
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    
    // If within 7 days, show relative
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : `${diffDays}d ago`}`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  /* ================= GET STATUS COLOR ================= */
  const getStatusColor = (status: string = "new") => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "read":
        return "bg-green-100 text-green-700";
      case "replied":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ================= GET STATUS ICON ================= */
  const getStatusIcon = (status: string = "new") => {
    switch (status) {
      case "new":
        return <Clock size={12} className="mr-1" />;
      case "read":
        return <Eye size={12} className="mr-1" />;
      case "replied":
        return <CheckCircle size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-600 mt-1">
              {messages.length} total • {messages.filter(m => m.status === "new").length} new
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">New</p>
              <p className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.status === "new").length}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Read</p>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.status === "read").length}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Eye size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Replied</p>
              <p className="text-2xl font-bold text-purple-600">
                {messages.filter(m => m.status === "replied").length}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircle size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages by name, phone, location, crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            >
              <option value="all">All Messages</option>
              <option value="new">New Only</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 uppercase tracking-wider">
          <div className="col-span-4">Contact</div>
          <div className="col-span-3">Details</div>
          <div className="col-span-3">Message Preview</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading State */}
        {loading && messages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2 text-sm">Loading messages...</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          /* Table Body */
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className="group">
                {/* Main Row */}
                <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                  {/* Contact Info */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={18} className="text-blue-600" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          message.status === "new" ? "bg-blue-500" :
                          message.status === "replied" ? "bg-purple-500" : "bg-green-500"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{message.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            {getStatusIcon(message.status)}
                            {message.status || "new"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{message.phone}</span>
                      </div>
                      {message.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{message.email}</span>
                        </div>
                      )}
                      {message.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{message.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="col-span-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    {message.crop && (
                      <div className="flex items-center gap-1 mt-2">
                        <Crop size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{message.crop}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(message)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {message.phone && (
                        <a
                          href={`tel:${message.phone}`}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Call"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                      
                      {message.email && (
                        <a
                          href={`mailto:${message.email}`}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        onClick={() => toggleExpand(message.id)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={expandedMessageId === message.id ? "Collapse" : "Expand"}
                      >
                        {expandedMessageId === message.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedMessageId === message.id && (
                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Full Message</p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.message}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Contact Details</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-sm font-medium">{message.phone}</span>
                              </div>
                              {message.email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-gray-400" />
                                  <span className="text-sm">{message.email}</span>
                                </div>
                              )}
                              {message.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-gray-400" />
                                  <span className="text-sm">{message.location}</span>
                                </div>
                              )}
                              {message.crop && (
                                <div className="flex items-center gap-2">
                                  <Crop size={14} className="text-gray-400" />
                                  <span className="text-sm">{message.crop}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3 border-t border-gray-100">
                        {message.phone && (
                          <a
                            href={`tel:${message.phone}`}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <Phone size={14} />
                            Call Now
                          </a>
                        )}
                        {message.email && (
                          <a
                            href={`mailto:${message.email}?subject=Re: Your enquiry&body=Hi ${message.name},%0D%0A%0D%0AThank you for contacting us.`}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <Mail size={14} />
                            Reply via Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              {searchQuery || filterStatus !== "all" 
                ? "Try adjusting your search or filter" 
                : "No contact messages have been submitted yet"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing <span className="font-medium">{filteredMessages.length}</span> of{" "}
          <span className="font-medium">{messages.length}</span> messages
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            New: {messages.filter(m => m.status === "new").length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Read: {messages.filter(m => m.status === "read").length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Replied: {messages.filter(m => m.status === "replied").length}
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    {selectedMessage.status || "new"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedMessage.createdAt?.toDate ? selectedMessage.createdAt.toDate().toLocaleString() : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Contact Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                  {selectedMessage.location && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {selectedMessage.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>

                {selectedMessage.email && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedMessage.crop && (
                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Crop / Interest</p>
                    <div className="flex items-center gap-2">
                      <Crop size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{selectedMessage.crop}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Phone size={18} />
                    Call Now
                  </a>
                )}
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your enquiry&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for contacting us.`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Mail size={18} />
                    Reply via Email
                  </a>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedMessage.id);
                    closeModal();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}