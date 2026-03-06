import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { supabase } from '../supabaseClient';


export default function SearchPaper() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allPapers, setAllPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all papers and join the department code on mount
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('papers_ordered')
          .select(`
            id,
            name,
            semester,
            departments (
              code
            )
          `);

        if (error) throw error;
        
        // Format the data
        const formattedData = data.map(paper => ({
          id: paper.id,
          name: paper.name,
          semester: paper.semester,
          departmentCode: paper.departments?.code || 'Unknown'
        }));

        setAllPapers(formattedData);
      } catch (error) {
        console.error("Error fetching papers for search:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Filter the fetched papers instantly
  const filteredPapers = allPapers.filter(paper => {
    const searchLower = searchQuery.toLowerCase();
    return (
      paper.name.toLowerCase().includes(searchLower) ||
      paper.departmentCode.toLowerCase().includes(searchLower)
    );
  });

  const handlePaperClick = (paper) => {
    navigate(`/${paper.departmentCode}/${paper.semester}/paper/${paper.id}`);
  };

  return (
    <div className="search-page">
      
      {/* Search Header */}
      <div className="search-header">
        <button className="search-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        
        <div className="search-input-wrapper">
          <input
            autoFocus
            type="text"
            className="search-input"
            placeholder="Search for papers, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchQuery && (
          <button className="search-back-btn" onClick={() => setSearchQuery('')}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Results Area */}
      <div className="search-results">
        {isLoading ? (
          /* Render 5 Skeleton Cards while Supabase is fetching */
          [1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="skeleton-card">
              {/* Fake Title */}
              <div className="skeleton-box" style={{ height: '20px', width: '70%' }}></div>
              {/* Fake Meta Info */}
              <div className="skeleton-box" style={{ height: '14px', width: '40%' }}></div>
            </div>
          ))
        ) : filteredPapers.length > 0 ? (
          filteredPapers.map(paper => (
            <div 
              key={paper.id} 
              className="search-paper-card" 
              onClick={() => handlePaperClick(paper)}
            >
              <h3 className="paper-title">{paper.name}</h3>
              <div className="paper-meta">
                <span>{paper.departmentCode}</span>
                <span className="meta-dot">•</span>
                <span>Semester {paper.semester}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            <Search size={48} style={{ opacity: 0.2, marginBottom: '16px', margin: '0 auto' }} />
            <p>No papers found for "{searchQuery}"</p>
          </div>
        )}
      </div>

    </div>
  );
}
