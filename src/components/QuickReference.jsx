import { useEffect, useMemo, useState } from 'react';
import { jspdfCatalogSections } from '../reference/jspdfCatalog.js';
import { dataReferenceSections } from '../reference/dataReferenceCatalog.js';
import {
  DataReferenceTeachingPanel,
  getDataReferenceItems,
} from './DataReferenceWorkspace.jsx';
import { getReferenceItems, ReferenceTeachingPanel } from './ReferenceWorkspace.jsx';

function QuickReference({ isEnabled, isDataReferenceEnabled = false }) {
  const jsPdfReferenceItems = useMemo(() => getReferenceItems(), []);
  const dataReferenceItems = useMemo(() => getDataReferenceItems(), []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeGuideId, setActiveGuideId] = useState('jspdf');
  const [selectedReferenceTarget, setSelectedReferenceTarget] = useState(null);
  const dataGuide = {
    id: 'data',
    title: 'Data nodes',
    eyebrow: 'Data Ref',
    sections: dataReferenceSections,
    items: dataReferenceItems,
    TeachingPanel: DataReferenceTeachingPanel,
  };
  const jsPdfGuide = {
    id: 'jspdf',
    title: 'jsPDF nodes',
    eyebrow: 'Quick Ref',
    sections: jspdfCatalogSections,
    items: jsPdfReferenceItems,
    TeachingPanel: ReferenceTeachingPanel,
  };
  const activeGuide = activeGuideId === 'data' && isDataReferenceEnabled ? dataGuide : jsPdfGuide;
  const selectedGuide =
    selectedReferenceTarget?.guideId === 'data' && isDataReferenceEnabled ? dataGuide : jsPdfGuide;
  const selectedReference = selectedReferenceTarget
    ? selectedGuide.items.find((item) => item.id === selectedReferenceTarget.itemId)
    : null;
  const SelectedTeachingPanel = selectedGuide.TeachingPanel;

  useEffect(() => {
    if (!isDataReferenceEnabled && activeGuideId === 'data') {
      setActiveGuideId('jspdf');
      setSelectedReferenceTarget(null);
    }
  }, [activeGuideId, isDataReferenceEnabled]);

  function handleToggleGuide(guideId) {
    if (guideId === 'data' && !isDataReferenceEnabled) {
      return;
    }

    setActiveGuideId(guideId);
    setIsDrawerOpen((current) => (activeGuideId === guideId ? !current : true));
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <aside className={`quickRefShell ${isDrawerOpen ? 'isOpen' : ''}`} aria-label="Quick reference">
      <button
        type="button"
        className="quickRefToggle"
        aria-label={isDrawerOpen && activeGuideId === 'jspdf' ? 'Close jsPDF reference' : 'Open jsPDF reference'}
        aria-expanded={isDrawerOpen && activeGuideId === 'jspdf'}
        aria-controls="quick-ref-drawer"
        onClick={() => handleToggleGuide('jspdf')}
      >
        <span>REF</span>
        <small>jsPDF</small>
      </button>

      {isDataReferenceEnabled ? (
        <button
          type="button"
          className="quickRefToggle isDataRef"
          aria-label={isDrawerOpen && activeGuideId === 'data' ? 'Close data reference' : 'Open data reference'}
          aria-expanded={isDrawerOpen && activeGuideId === 'data'}
          aria-controls="quick-ref-drawer"
          onClick={() => handleToggleGuide('data')}
        >
          <span>DATA</span>
          <small>Ref</small>
        </button>
      ) : null}

      <div
        id="quick-ref-drawer"
        className="quickRefDrawer"
        aria-hidden={!isDrawerOpen}
        inert={!isDrawerOpen ? true : undefined}
      >
        <div className="quickRefHeader">
          <div>
            <p className="eyebrow">{activeGuide.eyebrow}</p>
            <h3>{activeGuide.title}</h3>
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
          {activeGuide.sections.map((section) => (
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
                    onClick={() =>
                      setSelectedReferenceTarget({
                        guideId: activeGuide.id,
                        itemId: item.id,
                      })
                    }
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
            onClick={() => setSelectedReferenceTarget(null)}
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
                onClick={() => setSelectedReferenceTarget(null)}
              >
                x
              </button>
            </div>
            <SelectedTeachingPanel item={selectedReference} />
          </section>
        </div>
      ) : null}
    </aside>
  );
}

export default QuickReference;
