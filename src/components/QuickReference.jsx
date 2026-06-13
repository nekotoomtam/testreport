import { useMemo, useState } from 'react';
import { jspdfCatalogSections } from '../reference/jspdfCatalog.js';
import { getReferenceItems, ReferenceTeachingPanel } from './ReferenceWorkspace.jsx';

function QuickReference({ isEnabled }) {
  const referenceItems = useMemo(() => getReferenceItems(), []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState(null);
  const selectedReference = referenceItems.find((item) => item.id === selectedReferenceId);

  if (!isEnabled) {
    return null;
  }

  return (
    <aside className={`quickRefShell ${isDrawerOpen ? 'isOpen' : ''}`} aria-label="Quick reference">
      <button
        type="button"
        className="quickRefToggle"
        aria-label={isDrawerOpen ? 'Close quick reference' : 'Open quick reference'}
        aria-expanded={isDrawerOpen}
        aria-controls="quick-ref-drawer"
        onClick={() => setIsDrawerOpen((current) => !current)}
      >
        <span>REF</span>
        <small>Guide</small>
      </button>

      <div
        id="quick-ref-drawer"
        className="quickRefDrawer"
        aria-hidden={!isDrawerOpen}
        inert={!isDrawerOpen ? true : undefined}
      >
        <div className="quickRefHeader">
          <div>
            <p className="eyebrow">Quick Ref</p>
            <h3>jsPDF nodes</h3>
          </div>
          <button
            type="button"
            className="quickRefCloseButton"
            aria-label="Close quick reference"
            onClick={() => setIsDrawerOpen(false)}
          >
            x
          </button>
        </div>

        <div className="quickRefGroups">
          {jspdfCatalogSections.map((section) => (
            <section key={section.id} className="quickRefGroup">
              <div className="quickRefGroupHeader">
                <h4>{section.title}</h4>
                <p>{section.summary}</p>
              </div>
              <div className="quickRefList">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="quickRefItem"
                    onClick={() => setSelectedReferenceId(item.id)}
                  >
                    <span>{item.name}</span>
                    <code>{item.signature}</code>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {selectedReference ? (
        <div className="quickRefModalLayer" role="presentation">
          <button
            type="button"
            className="quickRefBackdrop"
            aria-label="Close reference popup"
            onClick={() => setSelectedReferenceId(null)}
          />
          <section
            className="quickRefModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-ref-title"
          >
            <div className="quickRefModalHeader">
              <div>
                <p className="eyebrow">
                  {selectedReference.sectionTitle} / {selectedReference.apiType}
                </p>
                <h3 id="quick-ref-title">{selectedReference.name}</h3>
              </div>
              <button
                type="button"
                className="quickRefCloseButton"
                aria-label="Close reference popup"
                onClick={() => setSelectedReferenceId(null)}
              >
                x
              </button>
            </div>
            <ReferenceTeachingPanel item={selectedReference} />
          </section>
        </div>
      ) : null}
    </aside>
  );
}

export default QuickReference;
