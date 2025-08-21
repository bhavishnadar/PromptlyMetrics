import React, { useState, useEffect } from 'react';
import { apiService, PromptRecord } from '../services/api';
import IntercomTheme from '../theme/intercom';

const PromptSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [prompts, setPrompts] = useState<PromptRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);

  const searchPrompts = async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchHighQualityPrompts(term);
      setPrompts(response.prompts);
    } catch (err) {
      setError('Failed to search prompts');
      console.error('Error searching prompts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial results on mount
    searchPrompts('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPrompts(searchTerm);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedPrompt(expandedPrompt === id ? null : id);
  };

  return (
    <div style={{
      backgroundColor: IntercomTheme.colors.backgroundSecondary,
      padding: IntercomTheme.spacing.lg,
      borderRadius: IntercomTheme.borderRadius.lg,
      boxShadow: IntercomTheme.shadows.base,
      border: `1px solid ${IntercomTheme.colors.border}`,
      fontFamily: IntercomTheme.typography.fontFamily
    }}>
      <h2 style={{
        margin: `0 0 ${IntercomTheme.spacing.lg} 0`,
        fontSize: IntercomTheme.typography.fontSizes.xl,
        fontWeight: IntercomTheme.typography.fontWeights.bold,
        color: IntercomTheme.colors.textPrimary
      }}>
        High-Quality Prompts (Score ≥ 80)
      </h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ 
        marginBottom: IntercomTheme.spacing.lg,
        display: 'flex',
        gap: IntercomTheme.spacing.md
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search prompts by content..."
          style={{
            flex: 1,
            padding: IntercomTheme.spacing.md,
            borderRadius: IntercomTheme.borderRadius.md,
            border: `1px solid ${IntercomTheme.colors.border}`,
            fontSize: IntercomTheme.typography.fontSizes.base,
            color: IntercomTheme.colors.textPrimary,
            backgroundColor: IntercomTheme.colors.background,
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = IntercomTheme.colors.primary}
          onBlur={(e) => e.currentTarget.style.borderColor = IntercomTheme.colors.border}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: IntercomTheme.colors.primary,
            color: IntercomTheme.colors.textInverse,
            border: 'none',
            padding: `${IntercomTheme.spacing.md} ${IntercomTheme.spacing.lg}`,
            borderRadius: IntercomTheme.borderRadius.md,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: IntercomTheme.typography.fontSizes.base,
            fontWeight: IntercomTheme.typography.fontWeights.medium,
            transition: 'all 0.2s ease',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = IntercomTheme.colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = IntercomTheme.colors.primary;
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: `1px solid ${IntercomTheme.colors.error}`,
          borderRadius: IntercomTheme.borderRadius.md,
          padding: IntercomTheme.spacing.md,
          marginBottom: IntercomTheme.spacing.lg,
          color: IntercomTheme.colors.error
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: IntercomTheme.spacing.md,
        fontSize: IntercomTheme.typography.fontSizes.sm,
        color: IntercomTheme.colors.textSecondary
      }}>
        <span>{prompts.length} prompts found</span>
        {searchTerm && (
          <span>Searching for: "{searchTerm}"</span>
        )}
      </div>

      {prompts.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: IntercomTheme.spacing['3xl'],
          color: IntercomTheme.colors.textSecondary
        }}>
          {searchTerm ? 'No prompts found matching your search.' : 'No high-quality prompts available.'}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: IntercomTheme.spacing.md
      }}>
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            style={{
              backgroundColor: IntercomTheme.colors.background,
              border: `1px solid ${IntercomTheme.colors.border}`,
              borderRadius: IntercomTheme.borderRadius.md,
              padding: IntercomTheme.spacing.lg,
              transition: 'all 0.2s ease'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: IntercomTheme.spacing.md
            }}>
              <div style={{ display: 'flex', gap: IntercomTheme.spacing.lg }}>
                <div style={{
                  backgroundColor: IntercomTheme.colors.chart.green,
                  color: IntercomTheme.colors.textInverse,
                  padding: `${IntercomTheme.spacing.xs} ${IntercomTheme.spacing.sm}`,
                  borderRadius: IntercomTheme.borderRadius.sm,
                  fontSize: IntercomTheme.typography.fontSizes.sm,
                  fontWeight: IntercomTheme.typography.fontWeights.bold
                }}>
                  Score: {prompt.improved_score || prompt.original_score}
                </div>
                {prompt.score_improvement > 0 && (
                  <div style={{
                    backgroundColor: IntercomTheme.colors.chart.blue,
                    color: IntercomTheme.colors.textInverse,
                    padding: `${IntercomTheme.spacing.xs} ${IntercomTheme.spacing.sm}`,
                    borderRadius: IntercomTheme.borderRadius.sm,
                    fontSize: IntercomTheme.typography.fontSizes.sm,
                    fontWeight: IntercomTheme.typography.fontWeights.bold
                  }}>
                    +{prompt.score_improvement.toFixed(1)} improvement
                  </div>
                )}
              </div>
              <span style={{
                fontSize: IntercomTheme.typography.fontSizes.sm,
                color: IntercomTheme.colors.textSecondary
              }}>
                {formatDate(prompt.request_timestamp)}
              </span>
            </div>

            {/* Prompts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: prompt.improved_prompt ? '1fr 1fr' : '1fr',
              gap: IntercomTheme.spacing.md
            }}>
              <div>
                <h4 style={{
                  margin: `0 0 ${IntercomTheme.spacing.sm} 0`,
                  fontSize: IntercomTheme.typography.fontSizes.sm,
                  fontWeight: IntercomTheme.typography.fontWeights.semibold,
                  color: IntercomTheme.colors.textSecondary
                }}>
                  {prompt.improved_prompt ? 'Original Prompt' : 'Prompt'} 
                  {prompt.original_score && ` (Score: ${prompt.original_score})`}
                </h4>
                <div
                  style={{
                    backgroundColor: IntercomTheme.colors.backgroundSecondary,
                    border: `1px solid ${IntercomTheme.colors.border}`,
                    borderRadius: IntercomTheme.borderRadius.sm,
                    padding: IntercomTheme.spacing.md,
                    fontSize: IntercomTheme.typography.fontSizes.sm,
                    lineHeight: '1.5',
                    color: IntercomTheme.colors.textPrimary,
                    maxHeight: expandedPrompt === prompt.id ? 'none' : '150px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {prompt.original_prompt}
                  {prompt.original_prompt.length > 300 && expandedPrompt !== prompt.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40px',
                      background: `linear-gradient(transparent, ${IntercomTheme.colors.backgroundSecondary})`,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => toggleExpand(prompt.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: IntercomTheme.colors.primary,
                          cursor: 'pointer',
                          fontSize: IntercomTheme.typography.fontSizes.sm,
                          fontWeight: IntercomTheme.typography.fontWeights.medium
                        }}
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {prompt.improved_prompt && (
                <div>
                  <h4 style={{
                    margin: `0 0 ${IntercomTheme.spacing.sm} 0`,
                    fontSize: IntercomTheme.typography.fontSizes.sm,
                    fontWeight: IntercomTheme.typography.fontWeights.semibold,
                    color: IntercomTheme.colors.textSecondary
                  }}>
                    Improved Prompt (Score: {prompt.improved_score})
                  </h4>
                  <div
                    style={{
                      backgroundColor: IntercomTheme.colors.backgroundSecondary,
                      border: `1px solid ${IntercomTheme.colors.border}`,
                      borderRadius: IntercomTheme.borderRadius.sm,
                      padding: IntercomTheme.spacing.md,
                      fontSize: IntercomTheme.typography.fontSizes.sm,
                      lineHeight: '1.5',
                      color: IntercomTheme.colors.textPrimary,
                      maxHeight: expandedPrompt === prompt.id ? 'none' : '150px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {prompt.improved_prompt}
                    {prompt.improved_prompt.length > 300 && expandedPrompt !== prompt.id && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '40px',
                        background: `linear-gradient(transparent, ${IntercomTheme.colors.backgroundSecondary})`,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => toggleExpand(prompt.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: IntercomTheme.colors.primary,
                            cursor: 'pointer',
                            fontSize: IntercomTheme.typography.fontSizes.sm,
                            fontWeight: IntercomTheme.typography.fontWeights.medium
                          }}
                        >
                          Show more
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {(prompt.original_prompt.length > 300 || prompt.improved_prompt?.length > 300) && expandedPrompt === prompt.id && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: IntercomTheme.spacing.md 
              }}>
                <button
                  onClick={() => toggleExpand(prompt.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: IntercomTheme.colors.primary,
                    cursor: 'pointer',
                    fontSize: IntercomTheme.typography.fontSizes.sm,
                    fontWeight: IntercomTheme.typography.fontWeights.medium
                  }}
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptSearch;