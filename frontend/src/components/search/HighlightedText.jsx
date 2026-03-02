export default function HighlightedText({ html, fallback = '', className = '' }) {
  if (!html) return <span className={className}>{fallback}</span>;
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
