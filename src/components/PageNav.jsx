export default function PageNav({ currentPage, pageCount, onPrev, onNext }) {
  if (pageCount <= 1) return null;

  return (
    <div className="page-nav">
      <button type="button" className="ghost-button compact" onClick={onPrev} disabled={currentPage <= 1}>
        {'<'}
      </button>
      <span>
        Page {currentPage} / {pageCount}
      </span>
      <button type="button" className="ghost-button compact" onClick={onNext} disabled={currentPage >= pageCount}>
        {'>'}
      </button>
    </div>
  );
}
