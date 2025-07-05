import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Box } from '@mui/material'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: '16px 0',
        fontFamily: '"Inter", "Arial", "Helvetica", sans-serif',
        lineHeight: 1.6,
        overflow: 'auto',
        height: '100%',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
          fontWeight: 600,
          marginTop: '24px',
          marginBottom: '16px',
          '&:first-of-type': {
            marginTop: 0,
          },
        },
        '& h1': {
          fontSize: '2.5rem',
          lineHeight: 1.2,
          borderBottom: '1px',
          paddingBottom: '8px',
        },
        '& h2': {
          fontSize: '2rem',
          lineHeight: 1.3,
          borderBottom: '1px',
          paddingBottom: '8px',
        },
        '& h3': {
          fontSize: '1.5rem',
          lineHeight: 1.4,
        },
        '& h4': {
          fontSize: '1.25rem',
          lineHeight: 1.4,
        },
        '& h5': {
          fontSize: '1.125rem',
          lineHeight: 1.4,
        },
        '& h6': {
          fontSize: '1rem',
          lineHeight: 1.4,
          color: '#c3c6cf',
        },
        '& p': {
          marginBottom: '16px',
          color: '#f8f9ff',
          '&:last-child': {
            marginBottom: 0,
          },
        },
        '& a': {
          color: '#a1c9fd',
          textDecoration: 'underline',
          '&:hover': {
            color: '#82b1ff',
          },
        },
        '& code': {
          backgroundColor: '#32353a',
          color: '#ffb4ab',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontFamily: '"JetBrains Mono", "Menlo", "Monaco", "Courier New", monospace',
        },
        '& pre': {
          backgroundColor: '#1a1d21',
          border: '1px solid #32353a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          '& code': {
            backgroundColor: 'transparent',
            color: 'inherit',
            padding: 0,
            fontSize: '0.875rem',
          },
        },
        '& blockquote': {
          borderLeft: '4px solid #a1c9fd',
          paddingLeft: '16px',
          margin: '16px 0',
          color: '#c3c6cf',
          fontStyle: 'italic',
          '& p': {
            marginBottom: '8px',
          },
        },
        '& ul, & ol': {
          paddingLeft: '24px',
          marginBottom: '16px',
          '& li': {
            marginBottom: '4px',
            color: '#f8f9ff',
          },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '16px',
          border: '1px solid #32353a',
          '& th, & td': {
            padding: '8px 12px',
            border: '1px solid #32353a',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: '#32353a',
            fontWeight: 600,
            color: '#f8f9ff',
          },
          '& td': {
            backgroundColor: '#1a1d21',
            color: '#e1e2e8',
          },
        },
        '& hr': {
          border: 'none',
          borderTop: '1px solid #32353a',
          margin: '24px 0',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '16px',
        },

      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content || '*내용이 없습니다.*'}
      </ReactMarkdown>
    </Box>
  )
} 