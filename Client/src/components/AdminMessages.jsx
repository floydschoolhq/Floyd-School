import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Mail, Clock, CheckCircle, X, Filter, Search, Trash2 } from 'lucide-react';

const AdminMessages = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        // Load messages from localStorage
        const storedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        setMessages(storedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        setFilteredMessages(storedMessages);
    }, []);

    useEffect(() => {
        // Filter messages based on search and status
        let filtered = messages;

        if (searchTerm) {
            filtered = filtered.filter(msg => 
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(msg => msg.status === statusFilter);
        }

        setFilteredMessages(filtered);
    }, [messages, searchTerm, statusFilter]);

    const handleStatusUpdate = (messageId, newStatus) => {
        const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, status: newStatus } : msg
        );
        setMessages(updatedMessages);
        localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    };

    const handleDeleteMessage = (messageId) => {
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        setMessages(updatedMessages);
        localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
        if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'reviewed':
                return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'resolved':
                return 'text-green-500 bg-green-500/10 border-green-500/20';
            default:
                return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!messages.length) {
        return (
            <div className={`min-h-screen p-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-slate-400" size={32} />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        No Messages Yet
                    </h2>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        When users send messages through the contact form, they'll appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Contact Messages
                    </h1>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Manage and respond to user inquiries
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                isDark 
                                    ? 'bg-slate-800 border-slate-700 text-white' 
                                    : 'bg-white border-slate-300 text-slate-900'
                            }`}
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${
                            isDark 
                                ? 'bg-slate-800 border-slate-700 text-white' 
                                : 'bg-white border-slate-300 text-slate-900'
                        }`}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="text-blue-500" size={20} />
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total</span>
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {messages.length}
                        </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-yellow-500" size={20} />
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Pending</span>
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {messages.filter(m => m.status === 'pending').length}
                        </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="text-blue-500" size={20} />
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Reviewed</span>
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {messages.filter(m => m.status === 'reviewed').length}
                        </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-green-500" size={20} />
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Resolved</span>
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {messages.filter(m => m.status === 'resolved').length}
                        </div>
                    </div>
                </div>

                {/* Messages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 space-y-3">
                        {filteredMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedMessage(message)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedMessage?.id === message.id
                                        ? isDark ? 'bg-blue-900/30 border-blue-500/50' : 'bg-blue-50 border-blue-300'
                                        : isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="text-slate-400" size={16} />
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {message.name}
                                        </span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(message.status)}`}>
                                        {message.status}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-slate-400 mb-2">
                                    {message.subject}
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock size={12} />
                                    {formatDate(message.timestamp)}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {selectedMessage.subject}
                                    </h3>
                                    <button
                                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <User className="text-slate-400" size={20} />
                                        <div>
                                            <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {selectedMessage.name}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {selectedMessage.email}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-slate-400" size={20} />
                                        <div className="text-sm text-slate-400">
                                            {formatDate(selectedMessage.timestamp)}
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} mb-6`}>
                                    <p className={isDark ? 'text-white' : 'text-slate-900'}>
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage.id, 'reviewed')}
                                        disabled={selectedMessage.status === 'reviewed'}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            selectedMessage.status === 'reviewed'
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        Mark as Reviewed
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage.id, 'resolved')}
                                        disabled={selectedMessage.status === 'resolved'}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            selectedMessage.status === 'resolved'
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className={`p-12 rounded-lg border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <MessageSquare className="text-slate-400 mx-auto mb-4" size={48} />
                                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                    Select a message to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
