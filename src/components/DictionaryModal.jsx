import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CDICTIONARY, CATEGORIES, CATEGORIES_KO } from '../cDictionary';
import './DictionaryModal.css';

export default function DictionaryModal({ isOpen, onClose, onInsertCode }) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedCategory('All');
      setSelectedItem(null);
    }
  }, [isOpen]);

  const getContent = (item) => {
    return language === 'ko' ? item.ko : item.en;
  };

  const categories = language === 'ko' ? CATEGORIES_KO : CATEGORIES;
  const categoryMap = {};
  CATEGORIES.forEach((cat, i) => {
    categoryMap[cat] = categories[i];
  });

  const filteredItems = CDICTIONARY.filter(item => {
    const content = getContent(item);
    const matchesSearch = searchTerm === '' ||
      item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.syntax.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleKeywordClick = (item) => {
    setSelectedItem(item);
  };

  const handleInsertCode = (code) => {
    if (onInsertCode) {
      onInsertCode(code);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedContent = selectedItem ? getContent(selectedItem) : null;

  return (
    <div className="dict-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="dict-modal" onClick={e => e.stopPropagation()}>
        <div className="dict-header">
          <div className="dict-title-section">
            <h2 className="dict-title">📖 {t('cDictionary')}</h2>
            <p className="dict-subtitle">{t('dictSubtitle')}</p>
          </div>
          <button className="dict-close" onClick={onClose}>×</button>
        </div>

        <div className="dict-search-section">
          <div className="dict-search-box">
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="dict-search-input"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>
          <div className="dict-category-tabs">
            {categories.map((cat, i) => (
              <button
                key={CATEGORIES[i]}
                className={`category-tab ${selectedCategory === CATEGORIES[i] ? 'active' : ''}`}
                onClick={() => setSelectedCategory(CATEGORIES[i])}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="dict-content">
          <div className="dict-results-section">
            <div className="dict-results-header">
              <span className="results-count">{filteredItems.length} {t('results')}</span>
            </div>
            <div className="dict-results-list">
              {filteredItems.length === 0 ? (
                <div className="no-results">
                  <span className="no-results-icon">🔎</span>
                  <p>{t('noResults')}</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div
                    key={item.keyword}
                    className={`dict-result-item ${selectedItem?.keyword === item.keyword ? 'selected' : ''}`}
                    onClick={() => handleKeywordClick(item)}
                  >
                    <div className="result-keyword">{item.keyword}</div>
                    <div className="result-category">{categoryMap[item.category]}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dict-detail-section">
            {selectedItem && selectedContent ? (
              <div className="dict-detail">
                <div className="detail-header">
                  <span className="detail-category">{categoryMap[selectedItem.category]}</span>
                  <h3 className="detail-keyword">{selectedItem.keyword}</h3>
                </div>

                <div className="detail-block">
                  <div className="detail-label">{t('syntax')}</div>
                  <code className="detail-syntax">{selectedContent.syntax}</code>
                </div>

                <div className="detail-block">
                  <div className="detail-label">{t('description')}</div>
                  <p className="detail-desc">{selectedContent.description}</p>
                </div>

                {selectedContent.parameters && selectedContent.parameters.length > 0 && (
                  <div className="detail-block">
                    <div className="detail-label">{t('parameters')}</div>
                    <ul className="detail-params">
                      {selectedContent.parameters.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-block">
                  <div className="detail-label">{t('returns')}</div>
                  <p className="detail-returns">{selectedContent.returns}</p>
                </div>

                {selectedContent.example && (
                  <div className="detail-block">
                    <div className="detail-label">{t('example')}</div>
                    <pre className="detail-example">{selectedContent.example}</pre>
                    <button
                      className="insert-code-btn"
                      onClick={() => handleInsertCode(selectedContent.example)}
                    >
                      {t('insertCode')}
                    </button>
                  </div>
                )}

                {selectedItem.related && selectedItem.related.length > 0 && (
                  <div className="detail-block">
                    <div className="detail-label">{t('relatedKeywords')}</div>
                    <div className="related-tags">
                      {selectedItem.related.map(rel => {
                        const relatedItem = CDICTIONARY.find(d => d.keyword === rel);
                        return (
                          <span
                            key={rel}
                            className="related-tag"
                            onClick={() => relatedItem && handleKeywordClick(relatedItem)}
                          >
                            {rel}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="dict-empty-state">
                <span className="empty-icon">📚</span>
                <p>{t('selectKeyword')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}