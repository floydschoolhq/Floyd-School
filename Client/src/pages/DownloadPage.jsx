/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FileText, FolderOpen, FlaskConical, Download } from 'lucide-react';
import Logo from '../components/Logo';
import Brochure from '../assets/pdf/Brochure.pdf';

// Mock data, replacing original icon references with Lucide icons
const initialDocuments = [
  { 
    id: 1, 
    title: "Brochure", 
    description: "See what is in the course", 
    fileName: "Brochure.pdf", 
    url: Brochure,
    Icon: FileText,
    color: 'bg-indigo-500'
  }
];

/**
 * Handles the dual action: first opens the document in a new tab,
 * then triggers the download shortly after.
 * @param {object} doc - The document object containing url and fileName.
 */
const handleViewAndDownload = (doc) => {
  // 1. Open the PDF in a new tab/window for viewing
  const newWindow = window.open(doc.url, '_blank', 'noopener,noreferrer');

  // 2. Wait a moment before triggering the download. 
  // This small delay (100ms) helps ensure the browser processes the 'open' command first.
  setTimeout(() => {
    try {
      // 3. Trigger the download using a temporary anchor element
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.fileName; // This attribute forces a download dialog
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Download triggered for: ${doc.fileName}`);
    } catch (error) {
      // Fallback for strict browser environments
      console.error("Could not trigger download. The file may only be opened for viewing.", error);
    }
  }, 100);
};

const DocumentCard = ({ doc }) => {
  const IconComponent = doc.Icon;

  return (
    <div>
      <div className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${doc.color} text-white`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
            <p className="text-sm text-gray-500">{doc.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-sm text-blue-600 font-medium truncate max-w-[60%]">
            {doc.fileName}
          </span>
          <button
            onClick={() => handleViewAndDownload(doc)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`View and download ${doc.title}`}
          >
            <Download className="w-4 h-4" />
            <span>View & Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DownloadPage = () => {
  const [documents] = useState(initialDocuments);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <Logo/>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="max-w-4xl mx-auto mt-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Product Documentation
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Click any document to view the PDF and automatically start the download.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default DownloadPage;